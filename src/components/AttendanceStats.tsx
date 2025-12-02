
import { useMemo } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { Card } from '@/components/ui/card';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

const REQUIRED_ATTENDANCE_PERCENTAGE = 75;

export const AttendanceStats = () => {
  const attendanceRecords = useAppStore((state) => state.attendanceRecords);
  const settings = useAppStore((state) => state.settings);
  

  // --- Monthly Attendance Logic (copied from Calendar) ---
  const timetable = useAppStore((state) => state.timetable);
  const now = new Date();
  const currentMonthStr = format(now, 'yyyy-MM');

  // Group attendance records by month
  const recordsByMonth = useMemo(() => {
    const grouped: Record<string, typeof attendanceRecords> = {};
    attendanceRecords.forEach((rec) => {
      if (rec.status === 'cancelled') return;
      const month = rec.date.slice(0, 7); // 'YYYY-MM'
      if (!grouped[month]) grouped[month] = [];
      grouped[month].push(rec);
    });
    return grouped;
  }, [attendanceRecords]);

  // Find the latest month with attendance if current month is empty
  const allMonths = Object.keys(recordsByMonth).sort();
  let monthToShow = currentMonthStr;
  if (!recordsByMonth[monthToShow] || recordsByMonth[monthToShow].length === 0) {
    if (allMonths.length > 0) {
      monthToShow = allMonths[allMonths.length - 1];
    }
  }

  // Calculate working days and periods in a month (excluding holidays and Sundays)
  const getWorkingDaysAndPeriodsInMonth = (month: string) => {
    const [year, m] = month.split('-').map(Number);
    const daysInMonth = new Date(year, m, 0).getDate();
    let workingDays = 0;
    let totalPeriods = 0;
    let periodsPerDayArr: number[] = [];
    
    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(year, m - 1, d);
      const iso = format(date, 'yyyy-MM-dd');
      if (date.getDay() === 0) continue; // Sunday
      if (settings.holidays?.includes(iso)) continue; // Holiday
      if (settings.examDays?.includes(iso)) continue; // Exam day (no attendance taken)
      const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
      const schedule = timetable.schedule.find((s) => s.day === dayName);
      const periods = schedule ? schedule.timeSlots.filter((s) => s.subjectId).length : 0;
      if (periods > 0) {
        workingDays++;
        totalPeriods += periods;
        periodsPerDayArr.push(periods);
      }
    }
    return { workingDays, totalPeriods, periodsPerDayArr };
  };

  // Calculate monthly stats (only counting periods where attendance was taken)
  const getMonthlyStats = (month: string) => {
    const records = recordsByMonth[month] || [];
    // Only count records where attendance was taken (present or absent)
    const validRecords = records.filter(r => r.status === 'present' || r.status === 'absent');
    const present = records.filter(r => r.status === 'present').length;
    const absent = records.filter(r => r.status === 'absent').length;
    const totalTaken = present + absent; // Total classes where attendance was taken
    
    // Calculate percentage based only on classes where attendance was taken
    const percentage = totalTaken > 0 ? (present / totalTaken) * 100 : 0;
    // Clamp to 100 if over (shouldn't happen, but for safety)
    const clamped = Math.min(percentage, 100);
    return { total: totalTaken, present, absent, percentage: Math.round(clamped * 100) / 100 };
  };

  // Calculate stats across all attendance records
  const validRecords = attendanceRecords.filter(r => r.status === 'present' || r.status === 'absent');
  const totalClassesConducted = validRecords.length;
  const totalPresentClasses = validRecords.filter(r => r.status === 'present').length;
  const totalAbsentClasses = validRecords.filter(r => r.status === 'absent').length;

  // Calculate percentage only from classes where attendance was taken
  const percentage = totalClassesConducted > 0 ? (totalPresentClasses / totalClassesConducted) * 100 : 0;
  const overallPercentage = Math.min(Math.round(percentage * 100) / 100, 100);

  // This month stats (show latest month with attendance if current is empty)
  const monthlyStats = getMonthlyStats(monthToShow);
  
  const stats = {
    percentage: overallPercentage,
    monthlyPercentage: monthlyStats.percentage,
  };

  const getPercentageStyles = (percentage: number) => {
    // iOS-style semantic colors with tinted backgrounds
    if (percentage >= 75) {
      return {
        bg: 'bg-success/15 dark:bg-success/20',
        text: 'text-success dark:text-success',
        glow: 'shadow-success/20',
      };
    }
    if (percentage >= 60) {
      return {
        bg: 'bg-warning/15 dark:bg-warning/20',
        text: 'text-warning dark:text-warning',
        glow: 'shadow-warning/20',
      };
    }
    return {
      bg: 'bg-destructive/15 dark:bg-destructive/20',
      text: 'text-destructive dark:text-destructive',
      glow: 'shadow-destructive/20',
    };
  };

  const styles = getPercentageStyles(stats.percentage);

  return (
    <div className="relative">
      {/* Glassmorphic card with iOS-style material layers */}
      <Card className="relative overflow-hidden border-0 bg-card/40 dark:bg-card/30 backdrop-blur-2xl backdrop-saturate-180 shadow-card hover:shadow-elevated transition-all duration-500 ease-smooth">
        {/* Subtle gradient overlay for depth */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-white/5 pointer-events-none" />
        
        {/* Content */}
        <div className="relative p-5 xs:p-6 sm:p-7">
          <div className="flex items-center justify-between gap-4">
            {/* Title with premium typography */}
            <h2 className="text-xl xs:text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
              Attendance
            </h2>
            
            {/* Percentage badge with iOS-style pill design */}
            <div className={cn(
              "relative flex items-center justify-center",
              "px-4 xs:px-5 py-2 xs:py-2.5 rounded-2xl",
              "font-semibold text-base xs:text-lg",
              "backdrop-blur-xl transition-all duration-300 ease-smooth",
              "shadow-lg",
              styles.bg,
              styles.text,
              styles.glow
            )}>
              {/* Subtle inner glow */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
              
              {/* Percentage text */}
              <span className="relative z-10 tabular-nums">
                {stats.percentage.toFixed(1)}%
              </span>
              
              {/* Micro label */}
              <span className="relative z-10 ml-1.5 text-xs font-medium opacity-80">
                Overall
              </span>
            </div>
          </div>
        </div>
        
        {/* Bottom border highlight */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 dark:via-white/5 to-transparent" />
      </Card>
    </div>
  );
};