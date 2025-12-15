import { NavLink } from 'react-router-dom';
import { Calendar, Settings, Home } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { path: '/', icon: Home, label: 'Today' },
  { path: '/calendar', icon: Calendar, label: 'Calendar' },
  { path: '/settings', icon: Settings, label: 'Settings' },
];

export const Navigation = () => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 supports-[safe-area-inset-bottom]:pb-[env(safe-area-inset-bottom)]">
      {/* iOS-style frosted glass background with tinted translucency */}
      <div className="absolute inset-0 bg-card/70 dark:bg-card/60 backdrop-blur-2xl backdrop-saturate-180 border-t border-white/10 dark:border-white/5" />
      
      {/* Subtle top highlight for depth */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 dark:via-white/10 to-transparent" />
      
      <div className="relative container mx-auto px-2 xs:px-3 sm:px-4">
        {/* iOS-style tab bar with floating pill design */}
        <div className="flex justify-around items-center h-16 xs:h-[4.5rem] sm:h-20">
          {navItems.map(({ path, icon: Icon, label }) => (
            <NavLink
              key={path}
              to={path}
              className={({ isActive }) =>
                cn(
                  // Base styles with iOS-level touch optimization
                  "group relative flex flex-col items-center justify-center",
                  "px-2 xs:px-3 sm:px-4 py-2 rounded-xl xs:rounded-2xl",
                  "min-h-[48px] min-w-[56px] xs:min-w-[64px]",
                  "transition-all duration-300 ease-smooth",
                  "touch-manipulation active:scale-95",
                  // Active state: iOS-style pill with subtle glow
                  isActive && [
                    "bg-primary/10 dark:bg-primary/15",
                    "shadow-sm",
                  ],
                  // Inactive state: smooth hover
                  !isActive && [
                    "hover:bg-card/40 dark:hover:bg-card/30",
                    "active:bg-card/60 dark:active:bg-card/40",
                  ]
                )
              }
            >
              {({ isActive }) => (
                <>
                  {/* Icon with smooth color transitions */}
                  <Icon 
                    className={cn(
                      "h-5 w-5 xs:h-6 xs:w-6 mb-0.5 xs:mb-1 transition-all duration-300",
                      isActive 
                        ? "text-primary scale-105" 
                        : "text-muted-foreground group-hover:text-foreground/80"
                    )} 
                  />
                  
                  {/* Label with iOS SF font weight */}
                  <span 
                    className={cn(
                      "text-[10px] xs:text-[11px] font-medium leading-tight transition-all duration-300",
                      isActive 
                        ? "text-primary" 
                        : "text-muted-foreground/90 group-hover:text-foreground/80"
                    )}
                  >
                    {label}
                  </span>
                  
                  {/* Active indicator dot (iOS style) */}
                  {isActive && (
                    <div className="absolute -top-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary animate-pulse" />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
};