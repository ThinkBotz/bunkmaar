import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Settings as SettingsIcon, Info, User, Phone, Mail, Instagram, BookOpen, Clock, LogOut, ChevronRight, ChevronDown } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { toast } from 'sonner';
import { useRef, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ThemeToggle } from '@/components/ThemeToggle';
import { UserProfileSelector } from '@/components/UserProfileSelector';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useAuthState } from '@/hooks/useAuth';
// Removed custom profile form; keeping original profile selector

export default function Settings() {
  const navigate = useNavigate();
  const { user } = useAuthState();
  
  const [showDataManagement, setShowDataManagement] = useState(false);
  const [showAcademicSettings, setShowAcademicSettings] = useState(false);
  const [showAppInfo, setShowAppInfo] = useState(false);
  const [theme, setTheme] = useState(false);
  const subjects = useAppStore((state) => state.subjects);
  const timetable = useAppStore((state) => state.timetable);
  const attendanceRecords = useAppStore((state) => state.attendanceRecords);
  const importData = useAppStore((state) => state.importData);
  const settings = useAppStore((state) => state.settings);
  const addHoliday = useAppStore((state) => state.addHoliday);
  const removeHoliday = useAppStore((state) => state.removeHoliday);
  const addExamDay = useAppStore((state) => state.addExamDay);
  const removeExamDay = useAppStore((state) => state.removeExamDay);
  const setSemester = useAppStore((state) => state.setSemester);
  // Revert: no direct profile editing form here
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [holidayInput, setHolidayInput] = useState('');
  const [examDayInput, setExamDayInput] = useState('');
  const [semesterStart, setSemesterStart] = useState<string>(settings.semesterStart || '');
  const [semesterEnd, setSemesterEnd] = useState<string>(settings.semesterEnd || '');
  
  // Removed profile form state

  const exportData = () => {
    const data = {
      subjects,
      timetable,
      attendanceRecords,
      settings,
      exportDate: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `BunkMaar-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    try { localStorage.setItem('student-app:lastBackupAt', new Date().toISOString()); } catch {}
    toast.success('Data exported successfully!');
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const data = JSON.parse(text);
      
      // Validate the data structure
      if (!data.subjects || !data.timetable || !data.attendanceRecords) {
        throw new Error('Invalid backup file format');
      }
      
  importData(data);
  try { localStorage.setItem('student-app:lastRestoreAt', new Date().toISOString()); } catch {}
      toast.success('Data imported successfully!');
      
      // Clear the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      toast.error('Failed to import data. Please check your backup file.');
      console.error('Import error:', error);
    }
  };

  const clearAllData = () => {
    if (window.confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
      localStorage.removeItem('student-app-storage');
      window.location.reload();
      toast.success('All data cleared successfully!');
    }
  };

  // Predefined datasets available in `public/predefined/`
  const predefinedDatasets = [
    { id: 'aiml', label: 'AI&ML - 3rd Year', path: '/predefined/aiml_3.json' },
    { id: 'cse', label: 'AI&DS - 3rd Year', path: '/predefined/AIDS_3.json' },
  ];

  const applyPredefined = async (datasetPath: string) => {
    if (!window.confirm('This will replace current data with the selected predefined dataset. Continue?')) return;
    try {
      const res = await fetch(datasetPath);
      if (!res.ok) throw new Error('Failed to fetch predefined dataset');
      const data = await res.json();
      // Basic validation
      if (!data.subjects || !data.timetable || !data.attendanceRecords) {
        throw new Error('Invalid dataset format');
      }
      importData(data);
      try { localStorage.setItem('student-app:lastBackupAt', new Date().toISOString()); } catch {}
      toast.success('Predefined dataset applied');
    } catch (err) {
      console.error(err);
      toast.error('Failed to apply dataset');
    }
  };


  const [showProfileSettings, setShowProfileSettings] = useState(false);

  const onSignOut = async () => {
    try {
      await signOut(auth);
      toast.success('Signed out');
      navigate('/login', { replace: true });
    } catch (err: any) {
      toast.error(err?.message || 'Failed to sign out');
    }
  };

  // Removed profile submit handler

  return (
    <div className="space-y-4 sm:space-y-6 pb-20 sm:pb-24">
      <div className="text-center px-2">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">Settings</h1>
        <p className="text-muted-foreground text-sm sm:text-base">Manage your app preferences</p>
      </div>

      {/* Profile tile */}
      <Card className="p-0 overflow-hidden border-0 bg-card/40 backdrop-blur-2xl shadow-card">
        <button
          onClick={() => setShowProfileSettings(true)}
          className="w-full flex items-center justify-between px-4 sm:px-5 py-4 sm:py-5 hover:bg-card/50 transition-colors"
        >
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <User className="h-5 w-5 text-primary" />
            </div>
            <div className="text-left">
              <div className="text-base sm:text-lg font-semibold">{user?.email || 'Profile'}</div>
            </div>
          </div>
          <ChevronRight className="h-5 w-5 text-muted-foreground" />
        </button>
      </Card>

      <div className="px-1 text-sm text-muted-foreground">Settings</div>

      {/* Unified settings list with collapsible rows */}
      <Card className="p-0 overflow-hidden border-0 bg-card/40 backdrop-blur-2xl shadow-card">
        <div className="divide-y divide-border/60">
          <button
            className="w-full flex items-center justify-between px-4 sm:px-5 py-4 hover:bg-card/50"
            onClick={() => setShowProfileSettings((v) => !v)}
          >
            <div className="flex items-center gap-3">
              <User className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm sm:text-base">Profile details</span>
            </div>
            <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${showProfileSettings ? 'rotate-180' : ''}`} />
          </button>
          {showProfileSettings && (
            <div className="px-4 sm:px-5 py-4 bg-card/40">
              <div className="p-3 rounded-lg border border-border/50 bg-background/50">
                <UserProfileSelector />
              </div>
            </div>
          )}

          
            <button
              className="w-full flex items-center justify-between px-4 sm:px-5 py-4 hover:bg-card/50"
              onClick={() => setTheme(v => !v)}
            >
              <div className="flex items-center gap-3">
<SettingsIcon className="h-5 w-5 text-muted-foreground" />                <span className="text-sm sm:text-base">Theme</span>
              </div>
              <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${theme ? 'rotate-180' : ''}`} />
            </button>
            {theme && (
              <div className="w-full flex items-center justify-between px-4 sm:px-5 py-4">
                <div className="flex items-center gap-3">
<br></br>                  <span className="text-sm sm:text-base">Dark/Light</span>
                </div>
                <ThemeToggle />
              </div>
            )}

                

          

          {/* Academic Settings collapsible */}
          <button
            className="w-full flex items-center justify-between px-4 sm:px-5 py-4 hover:bg-card/50"
            onClick={() => setShowAcademicSettings(v => !v)}
          >
            <div className="flex items-center gap-3">
              <SettingsIcon className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm sm:text-base">Academic Settings</span>
            </div>
            <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${showAcademicSettings ? 'rotate-180' : ''}`} />
          </button>
          {showAcademicSettings && (
            <div className="px-4 sm:px-5 py-4 space-y-6 bg-card/40">
              <div className="space-y-3">
                <h3 className="text-sm font-semibold">Semester Duration</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="semesterStart" className="text-xs">Semester Start</Label>
                    <Input id="semesterStart" type="date" value={semesterStart} onChange={(e) => setSemesterStart(e.target.value)} />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="semesterEnd" className="text-xs">Semester End</Label>
                    <Input id="semesterEnd" type="date" value={semesterEnd} onChange={(e) => setSemesterEnd(e.target.value)} />
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button size="sm" variant="outline" onClick={() => { setSemester(semesterStart || undefined, semesterEnd || undefined); toast.success('Semester dates saved'); }}>Save</Button>
                </div>
              </div>
              <div className="space-y-3 border-t pt-4">
                <h3 className="text-sm font-semibold">Holidays</h3>
                <div className="flex gap-2">
                  <Input type="date" value={holidayInput} onChange={(e) => setHolidayInput(e.target.value)} className="flex-1" />
                  <Button size="sm" onClick={() => { if (holidayInput) { addHoliday(holidayInput); setHolidayInput(''); toast.success('Holiday added'); } }}>Add</Button>
                </div>
                {settings.holidays?.length ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {settings.holidays.map(d => (
                      <div key={d} className="flex items-center justify-between p-2 rounded border bg-background/50 text-xs">
                        <span>🔵 {d}</span>
                        <Button size="sm" variant="ghost" onClick={() => removeHoliday(d)}>Remove</Button>
                      </div>
                    ))}
                  </div>
                ) : <p className="text-xs text-muted-foreground">No holidays added</p>}
              </div>
              <div className="space-y-3 border-t pt-4">
                <h3 className="text-sm font-semibold">Exam Days</h3>
                <div className="flex gap-2">
                  <Input type="date" value={examDayInput} onChange={(e) => setExamDayInput(e.target.value)} className="flex-1" />
                  <Button size="sm" onClick={() => { if (examDayInput) { addExamDay(examDayInput); setExamDayInput(''); toast.success('Exam day added'); } }}>Add</Button>
                </div>
                {settings.examDays?.length ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {settings.examDays.map(d => (
                      <div key={d} className="flex items-center justify-between p-2 rounded border bg-background/50 text-xs">
                        <span>📚 {d}</span>
                        <Button size="sm" variant="ghost" onClick={() => removeExamDay(d)}>Remove</Button>
                      </div>
                    ))}
                  </div>
                ) : <p className="text-xs text-muted-foreground">No exam days added</p>}
              </div>
            </div>
          )}

          {/* Data Management collapsible */}
          <button
            className="w-full flex items-center justify-between px-4 sm:px-5 py-4 hover:bg-card/50"
            onClick={() => setShowDataManagement(v => !v)}
          >
            <div className="flex items-center gap-3">
              <SettingsIcon className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm sm:text-base">Data Management</span>
            </div>
            <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${showDataManagement ? 'rotate-180' : ''}`} />
          </button>
          {showDataManagement && (
            <div className="px-4 sm:px-5 py-4 space-y-4 bg-card/40">
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold">Export Data</h3>
                    <p className="text-xs text-muted-foreground">Download a backup of all your data</p>
                  </div>
                  <Button size="sm" variant="outline" onClick={exportData} className="shrink-0">Export</Button>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold">Import Data</h3>
                    <p className="text-xs text-muted-foreground">Restore data from a backup file</p>
                  </div>
                  <Button size="sm" variant="outline" onClick={handleImportClick} className="shrink-0">Import</Button>
                </div>
                <div className="space-y-2 border-t pt-3">
                  <h3 className="text-sm font-semibold">Predefined Datasets</h3>
                  <p className="text-xs text-muted-foreground">Quickly load a sample dataset (replaces current data).</p>
                  <div className="flex flex-wrap gap-2">
                    {predefinedDatasets.map(ds => (
                      <Button key={ds.id} size="sm" variant="outline" onClick={() => applyPredefined(ds.path)}>{ds.label}</Button>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground">If missing class data contact developer on <a href="https://wa.me/919951970441?text=I%20Dont%20find%20my%20class%20data" className="text-primary hover:underline">WhatsApp</a>.</p>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-t pt-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-destructive">Clear All Data</h3>
                    <p className="text-xs text-muted-foreground">Permanently delete all saved data</p>
                  </div>
                  <Button size="sm" variant="outline" onClick={clearAllData} className="shrink-0 text-destructive hover:bg-destructive hover:text-destructive-foreground">Clear</Button>
                </div>
              </div>
            </div>
            
          )}
          {/* App Information collapsible */}
          <button
            className="w-full flex items-center justify-between px-4 sm:px-5 py-4 hover:bg-card/50"
            onClick={() => setShowAppInfo(v => !v)}
          >
            <div className="flex items-center gap-3">
              <Info className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm sm:text-base">App Information</span>
            </div>
            <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${showAppInfo ? 'rotate-180' : ''}`} />
          </button>
          {showAppInfo && (
            <div className="px-4 sm:px-5 py-4 space-y-4 bg-card/40">
              <div className="relative overflow-hidden p-4 rounded-lg bg-card/50 backdrop-blur-xl border border-border/40 shadow-sm">
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-white/10 pointer-events-none" />
                <div className="relative space-y-2 text-center">
                  <h3 className="text-base font-semibold tracking-tight">BunkMaar</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    A simple and efficient way to track your class attendance and maintain academic records.
                  </p>
                </div>
              </div>
              <div className="p-3 rounded-lg border border-border/50 bg-background/40 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Total Subjects</span><span className="font-medium">{subjects.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Attendance Records</span><span className="font-medium">{attendanceRecords.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Version</span><span className="font-medium">2.0.0</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* About & account */}
      <Card className="p-0 overflow-hidden border-0 bg-card/40 backdrop-blur-2xl shadow-card">
        <div className="divide-y divide-border/60">
          {/* <button
            className="w-full flex items-center justify-between px-4 sm:px-5 py-4 hover:bg-card/50"
            onClick={() => setShowAppInfo(!showAppInfo)}
          >
            <div className="flex items-center gap-3">
              <Info className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm sm:text-base">About application</span>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </button> */}



          <button
            className="w-full flex items-center justify-between px-4 sm:px-5 py-4 hover:bg-card/50"
            onClick={() => navigate('/timetable')}
          >
            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm sm:text-base">Timetable</span>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </button>

          <button
            className="w-full flex items-center justify-between px-4 sm:px-5 py-4 hover:bg-card/50"
            onClick={() => navigate('/subjects')}
          >
            <div className="flex items-center gap-3">
              <BookOpen className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm sm:text-base">Subjects</span>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </button>

          

          <button
            className="w-full flex items-center justify-between px-4 sm:px-5 py-4 hover:bg-card/50"
            onClick={() => {
              const msg = 'hello sameer i have a problem';
              const url = `https://wa.me/919951970441?text=${encodeURIComponent(msg)}`;
              window.open(url, '_blank', 'noopener,noreferrer');
            }}
          >
            <div className="flex items-center gap-3">
              <span className="inline-flex h-5 w-5 items-center justify-center rounded-md bg-muted/50 text-muted-foreground">?</span>
              <span className="text-sm sm:text-base">Help/FAQ</span>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </button>
          <button
            className="w-full flex items-center justify-between px-4 sm:px-5 py-4 hover:bg-card/50"
            onClick={onSignOut}
          >
            <div className="flex items-center gap-3">
              <LogOut className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm sm:text-base text-destructive">Sign out</span>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </button>
        </div>
      </Card>

      {/* Cloud Backup removed: using local export/import only */}

      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Contact Information */}
      <Card className="p-0 overflow-hidden border-0 bg-card/40 backdrop-blur-2xl shadow-card p-4 sm:p-6">
        <div className="flex items-center mb-4">
          <Info className="h-5 w-5 text-primary mr-2" />
          <h2 className="text-lg font-semibold text-foreground">Contact Developer</h2>
        </div>
        <div className="space-y-3 text-sm">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <a href="tel:+919951970441" className="font-medium text-primary hover:underline">+91 9951970441</a>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <a href="mailto:syedsame2244@gmail.com" className="font-medium text-primary hover:underline break-all">syedsame2244@gmail.com</a>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div className="flex items-center gap-2">
              <Instagram className="h-4 w-4 text-muted-foreground" />
              <a href="https://instagram.com/_samxiao" target="_blank" rel="noopener noreferrer" className="font-medium text-primary hover:underline">@_samxiao</a>
  <a href="https://instagram.com/sibgath_yt" target="_blank" rel="noopener noreferrer" className="font-medium text-primary hover:underline">@sibgath_yt</a>
              
            </div>
          </div>
        </div>
      </Card>

      {/* Standalone About card removed (merged into App Information) */}
    </div>
  );
}
