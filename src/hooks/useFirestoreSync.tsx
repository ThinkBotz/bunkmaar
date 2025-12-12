import { useEffect, useRef } from 'react';
import { useAuthState } from './useAuth';
import { loadFromFirestore, saveToFirestore, subscribeToFirestore } from '@/lib/firestore-sync';
import { useAppStore } from '@/store/useAppStore';
import { toast } from 'sonner';

/**
 * Hook to sync app data with Firestore when user is authenticated
 */
export function useFirestoreSync() {
  const { user } = useAuthState();
  const hasLoadedRef = useRef(false);
  const saveTimeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (!user?.uid) {
      hasLoadedRef.current = false;
      return;
    }

    // Load data from Firestore on first auth
    if (!hasLoadedRef.current) {
      hasLoadedRef.current = true;
      
      loadFromFirestore(user.uid)
        .then((data) => {
          if (data) {
            const state = useAppStore.getState();
            
            // Merge Firestore data into local state
            if (data.subjects) state.subjects = data.subjects;
            if (data.timetable) state.timetable = data.timetable;
            if (data.attendanceRecords) state.attendanceRecords = data.attendanceRecords;
            if (data.settings) state.settings = data.settings;
            if (data.profiles) state.profiles = data.profiles;
            if (data.activeUserId !== undefined) state.activeUserId = data.activeUserId;
            
            toast.success('✅ Data loaded from cloud');
          }
        })
        .catch((error) => {
          console.error('Failed to load from Firestore:', error);
          toast.error('Failed to load cloud data');
        });
    }

    // Subscribe to real-time updates
    const unsubscribe = subscribeToFirestore(user.uid, (data) => {
      // Only update if data has changed (avoid infinite loops)
      const state = useAppStore.getState();
      const currentData = {
        subjects: state.subjects,
        timetable: state.timetable,
        attendanceRecords: state.attendanceRecords,
        settings: state.settings,
        profiles: state.profiles,
        activeUserId: state.activeUserId,
      };

      // Simple comparison (could be optimized with deep equals)
      const dataChanged = JSON.stringify(currentData) !== JSON.stringify({
        subjects: data.subjects,
        timetable: data.timetable,
        attendanceRecords: data.attendanceRecords,
        settings: data.settings,
        profiles: data.profiles,
        activeUserId: data.activeUserId,
      });

      if (dataChanged) {
        if (data.subjects) state.subjects = data.subjects;
        if (data.timetable) state.timetable = data.timetable;
        if (data.attendanceRecords) state.attendanceRecords = data.attendanceRecords;
        if (data.settings) state.settings = data.settings;
        if (data.profiles) state.profiles = data.profiles;
        if (data.activeUserId !== undefined) state.activeUserId = data.activeUserId;
        
        console.log('🔄 Data synced from cloud');
      }
    });

    return () => {
      unsubscribe();
    };
  }, [user?.uid]);

  // Auto-save to Firestore on state changes (debounced)
  useEffect(() => {
    if (!user?.uid) return;

    const unsubscribeStore = useAppStore.subscribe((state) => {
      // Debounce saves to avoid too many writes
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }

      saveTimeoutRef.current = setTimeout(() => {
        saveToFirestore(user.uid)
          .then(() => {
            console.log('💾 Auto-saved to cloud');
          })
          .catch((error) => {
            console.error('Failed to auto-save:', error);
          });
      }, 2000); // Wait 2 seconds after last change
    });

    return () => {
      unsubscribeStore();
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [user?.uid]);
}
