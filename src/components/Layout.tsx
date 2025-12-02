import { Outlet, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { Navigation } from './Navigation';
import { AttendanceStats } from './AttendanceStats';
import { PwaBanner } from './PwaBanner';
import { InstallPrompt } from './InstallPrompt';

export const Layout = () => {
  const location = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname]);
  
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* iOS-style mesh gradient background */}
      <div className="fixed inset-0 bg-gradient-mesh opacity-40 dark:opacity-30 pointer-events-none" />
      <div className="fixed inset-0 bg-gradient-background pointer-events-none" />
      
      {/* Glassmorphic content container */}
      <div className="relative z-10 container mx-auto px-4 xs:px-5 sm:px-6 md:px-8 py-4 xs:py-5 sm:py-6 max-w-7xl">
        {/* Header auth menu removed: Sign out now only in Settings */}
        
        {/* Attendance overview card */}
        <AttendanceStats />
        
        {/* Main content area with premium spacing */}
        <main className="mt-4 xs:mt-5 sm:mt-6 pb-24 xs:pb-26 sm:pb-28 md:pb-32 supports-[safe-area-inset-bottom]:pb-[calc(6rem+env(safe-area-inset-bottom))]">
          <Outlet />
        </main>
        
        {/* Navigation and PWA components */}
        <Navigation />
        <PwaBanner />
        <InstallPrompt />
      </div>
    </div>
  );
};
