import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { Navigation } from './Navigation';
import { AttendanceStats } from './AttendanceStats';
import { PwaBanner } from './PwaBanner';
import { InstallPrompt } from './InstallPrompt';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { toast } from '@/components/ui/sonner';
import { useAuthState } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';

export const Layout = () => {
  const location = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname]);
  return (
    <div className="min-h-screen bg-gradient-background">
      {/* Enhanced responsive container with better mobile padding */}
      <div className="container mx-auto px-2 xs:px-3 sm:px-4 md:px-6 py-3 xs:py-4 sm:py-6 max-w-7xl">
        <div className="flex items-center justify-end mb-2">
          <AuthMenu />
        </div>
        {/* Theme toggle moved into Attendance Overview */}
        <AttendanceStats />
        {/* Enhanced spacing for mobile and safe areas */}
        <main className="mt-3 xs:mt-4 sm:mt-6 pb-20 xs:pb-22 sm:pb-24 md:pb-28 supports-[safe-area-inset-bottom]:pb-[calc(5rem+env(safe-area-inset-bottom))]">
          <Outlet />
        </main>
        <Navigation />
        <PwaBanner />
        <InstallPrompt />
      </div>
    </div>
  );
};

const AuthMenu = () => {
  const { user, loading } = useAuthState();
  const navigate = useNavigate();

  const onSignOut = async () => {
    try {
      await signOut(auth);
      toast.success('Signed out');
      navigate('/login', { replace: true });
    } catch (err: any) {
      toast.error(err?.message || 'Failed to sign out');
    }
  };

  if (loading) return null;
  if (!user) return null;

  return (
    <div className="flex items-center gap-3">
      <div className="text-sm text-muted-foreground">{user.email}</div>
      <Button variant="ghost" onClick={onSignOut}>Sign out</Button>
    </div>
  );
};