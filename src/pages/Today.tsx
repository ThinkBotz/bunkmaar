import { useState, useMemo } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, X, Ban, RotateCcw, Clock, CheckCheck, XCircle, Power, Eraser } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export default function Today() {
  const subjects = useAppStore((state) => state.subjects);
  const timetable = useAppStore((state) => state.timetable);
  const attendanceRecords = useAppStore((state) => state.attendanceRecords);
  
  const todaySchedule = useMemo(() => {
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
    const daySchedule = timetable.schedule.find(d => d.day === today);
    return daySchedule?.timeSlots || [];
  }, [timetable]);
  const markAttendance = useAppStore((state) => state.markAttendance);
  const clearAttendance = useAppStore((state) => state.clearAttendance);
  const markAllDayAttendance = useAppStore((state) => state.markAllDayAttendance);

  const today = new Date().toISOString().split('T')[0];
  const todayName = new Date().toLocaleDateString('en-US', { weekday: 'long' });

  const getSubjectName = (subjectId?: string) => {
    if (!subjectId) return 'Free Period';
    const subject = subjects.find(s => s.id === subjectId);
    return subject?.name || 'Unknown Subject';
  };

  const getAttendanceStatus = (timeSlotId: string) => {
    const record = attendanceRecords.find(
      r => r.date === today && r.timeSlotId === timeSlotId
    );
    return record?.status;
  };

  const handleAttendance = (timeSlotId: string, subjectId: string | undefined, status: 'present' | 'absent' | 'cancelled') => {
    if (!subjectId) return;
    markAttendance(today, todayName, timeSlotId, subjectId, status);
  };

  const handleClear = (timeSlotId: string) => {
    clearAttendance(today, timeSlotId);
  };

  const handleBulkAttendance = (status: 'present' | 'absent' | 'cancelled' | 'clear') => {
    markAllDayAttendance(today, todayName, status);
    const statusText = status === 'clear' ? 'cleared' : `marked as ${status}`;
    toast.success(`All classes ${statusText} for today!`);
  };

  const getStatusStyles = (status?: string) => {
    switch (status) {
      case 'present': 
        return {
          bg: 'bg-success/10 dark:bg-success/15',
          border: 'border-success/30',
          text: 'text-success',
        };
      case 'absent': 
        return {
          bg: 'bg-warning/10 dark:bg-warning/15',
          border: 'border-warning/30',
          text: 'text-warning',
        };
      case 'cancelled': 
        return {
          bg: 'bg-neutral/10 dark:bg-neutral/15',
          border: 'border-neutral/30',
          text: 'text-neutral',
        };
      default: 
        return {
          bg: '',
          border: '',
          text: '',
        };
    }
  };

  return (
    <div className="space-y-5 xs:space-y-6 pb-24 xs:pb-28">
      {/* Header section with iOS-style hierarchy */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl xs:text-3xl sm:text-4xl font-bold text-foreground tracking-tight">
          Today's Schedule
        </h1>
        <p className="text-sm xs:text-base text-muted-foreground font-medium">
          {new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </p>
      </div>

      {todaySchedule.length === 0 ? (
        /* Empty state with glassmorphic card */
        <Card className="relative overflow-hidden border-0 bg-card/40 dark:bg-card/30 backdrop-blur-2xl backdrop-saturate-180 shadow-card">
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-white/5 pointer-events-none" />
          <div className="relative p-8 xs:p-10 sm:p-12 text-center space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 xs:w-20 xs:h-20 rounded-3xl bg-primary/10 dark:bg-primary/15">
              <Clock className="h-8 w-8 xs:h-10 xs:w-10 text-primary" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg xs:text-xl font-semibold text-foreground">No Classes Today</h3>
              <p className="text-sm xs:text-base text-muted-foreground">Enjoy your free day!</p>
            </div>
          </div>
        </Card>
      ) : (
        <>
          {/* Quick actions card */}
          <Card className="relative overflow-hidden border-0 bg-card/40 dark:bg-card/30 backdrop-blur-2xl backdrop-saturate-180 shadow-card hover:shadow-elevated transition-all duration-300 ease-smooth">
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-white/5 pointer-events-none" />
            <div className="relative p-4 xs:p-5 space-y-3">
              <h3 className="text-base xs:text-lg font-semibold text-foreground">Quick Actions</h3>
              
              {/* iOS-style action buttons grid */}
              <div className="grid grid-cols-4 gap-2 xs:gap-3">
                <Button
                  onClick={() => handleBulkAttendance('present')}
                  className={cn(
                    "flex flex-col items-center gap-2 h-auto py-3 xs:py-4 px-2",
                    "bg-success/15 hover:bg-success/25 dark:bg-success/20 dark:hover:bg-success/30",
                    "text-success border-0 shadow-lg",
                    "transition-all duration-300 ease-bounce active:scale-95",
                    "rounded-2xl"
                  )}
                >
                  <CheckCheck className="h-5 w-5 xs:h-6 xs:w-6" />
                  <span className="text-[10px] xs:text-xs font-medium">All Present</span>
                </Button>
                
                <Button
                  onClick={() => handleBulkAttendance('absent')}
                  className={cn(
                    "flex flex-col items-center gap-2 h-auto py-3 xs:py-4 px-2",
                    "bg-warning/15 hover:bg-warning/25 dark:bg-warning/20 dark:hover:bg-warning/30",
                    "text-warning border-0 shadow-lg",
                    "transition-all duration-300 ease-bounce active:scale-95",
                    "rounded-2xl"
                  )}
                >
                  <XCircle className="h-5 w-5 xs:h-6 xs:w-6" />
                  <span className="text-[10px] xs:text-xs font-medium">All Absent</span>
                </Button>
                
                <Button
                  onClick={() => handleBulkAttendance('cancelled')}
                  className={cn(
                    "flex flex-col items-center gap-2 h-auto py-3 xs:py-4 px-2",
                    "bg-neutral/15 hover:bg-neutral/25 dark:bg-neutral/20 dark:hover:bg-neutral/30",
                    "text-neutral border-0 shadow-lg",
                    "transition-all duration-300 ease-bounce active:scale-95",
                    "rounded-2xl"
                  )}
                >
                  <Power className="h-5 w-5 xs:h-6 xs:w-6" />
                  <span className="text-[10px] xs:text-xs font-medium">All Off</span>
                </Button>
                
                <Button
                  onClick={() => handleBulkAttendance('clear')}
                  className={cn(
                    "flex flex-col items-center gap-2 h-auto py-3 xs:py-4 px-2",
                    "bg-muted/50 hover:bg-muted dark:bg-muted/30 dark:hover:bg-muted/50",
                    "text-muted-foreground border-0 shadow-lg",
                    "transition-all duration-300 ease-bounce active:scale-95",
                    "rounded-2xl"
                  )}
                >
                  <Eraser className="h-5 w-5 xs:h-6 xs:w-6" />
                  <span className="text-[10px] xs:text-xs font-medium">Clear</span>
                </Button>
              </div>
            </div>
          </Card>

          {/* Class cards with floating design */}
          <div className="space-y-3 xs:space-y-4">
            {todaySchedule.map((slot) => {
            const status = getAttendanceStatus(slot.id);
            const subjectName = getSubjectName(slot.subjectId);
            const statusStyles = getStatusStyles(status);
            
            return (
              <Card 
                key={slot.id} 
                className={cn(
                  "relative overflow-hidden group",
                  "border-0 backdrop-blur-2xl backdrop-saturate-180",
                  "shadow-card hover:shadow-elevated",
                  "transition-all duration-300 ease-smooth",
                  "hover:scale-[1.01] active:scale-[0.99]",
                  status ? statusStyles.bg : "bg-card/40 dark:bg-card/30"
                )}
              >
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-white/5 pointer-events-none" />
                
                {/* Status indicator bar */}
                {status && (
                  <div className={cn("absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl", statusStyles.border)} />
                )}
                
                <div className="relative p-4 xs:p-5">
                  <div className="flex items-center justify-between gap-3">
                    {/* Subject info */}
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-base xs:text-lg font-semibold text-foreground truncate">
                          {subjectName}
                        </h3>
                        {status && (
                          <span className={cn(
                            "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium backdrop-blur-xl",
                            statusStyles.bg,
                            statusStyles.text
                          )}>
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                          </span>
                        )}
                      </div>
                      <p className="text-xs xs:text-sm text-muted-foreground font-medium">
                        {slot.startTime} - {slot.endTime}
                      </p>
                    </div>
                    
                    {/* Action buttons with iOS-style design */}
                    {slot.subjectId && (
                      <div className="flex items-center gap-1 xs:gap-1.5">
                        <Button
                          variant={status === 'present' ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => handleAttendance(slot.id, slot.subjectId, 'present')}
                          className={cn(
                            "w-9 h-9 xs:w-10 xs:h-10 p-0 rounded-xl",
                            "transition-all duration-200 ease-smooth active:scale-90",
                            status === 'present' && "bg-success hover:bg-success/90 border-success shadow-lg"
                          )}
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                        
                        <Button
                          variant={status === 'absent' ? 'destructive' : 'outline'}
                          size="sm"
                          onClick={() => handleAttendance(slot.id, slot.subjectId, 'absent')}
                          className={cn(
                            "w-9 h-9 xs:w-10 xs:h-10 p-0 rounded-xl",
                            "transition-all duration-200 ease-smooth active:scale-90",
                            status === 'absent' && "bg-warning hover:bg-warning/90 border-warning shadow-lg"
                          )}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                        
                        <Button
                          variant={status === 'cancelled' ? 'secondary' : 'outline'}
                          size="sm"
                          onClick={() => handleAttendance(slot.id, slot.subjectId, 'cancelled')}
                          className={cn(
                            "w-9 h-9 xs:w-10 xs:h-10 p-0 rounded-xl",
                            "transition-all duration-200 ease-smooth active:scale-90",
                            status === 'cancelled' && "bg-neutral hover:bg-neutral/90 border-neutral shadow-lg"
                          )}
                        >
                          <Ban className="h-4 w-4" />
                        </Button>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleClear(slot.id)}
                          className="w-9 h-9 xs:w-10 xs:h-10 p-0 rounded-xl transition-all duration-200 ease-smooth active:scale-90"
                        >
                          <RotateCcw className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
          </div>
        </>
      )}
    </div>
  );
}