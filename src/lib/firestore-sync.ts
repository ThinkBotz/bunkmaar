import { doc, setDoc, getDoc, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';
import { useAppStore } from '@/store/useAppStore';

export interface UserData {
  subjects: any[];
  timetable: any;
  attendanceRecords: any[];
  settings: any;
  profiles: Record<string, any>;
  activeUserId: string;
  lastSyncedAt?: any;
}

/**
 * Save app data to Firestore for a specific user
 */
export async function saveToFirestore(userId: string) {
  if (!userId) return;
  
  const state = useAppStore.getState();
  const userData: UserData = {
    subjects: state.subjects,
    timetable: state.timetable,
    attendanceRecords: state.attendanceRecords,
    settings: state.settings,
    profiles: state.profiles,
    activeUserId: state.activeUserId,
    lastSyncedAt: serverTimestamp(),
  };

  try {
    await setDoc(doc(db, 'users', userId), userData, { merge: true });
    console.log('✅ Data synced to Firestore');
  } catch (error) {
    console.error('❌ Failed to sync to Firestore:', error);
    throw error;
  }
}

/**
 * Load app data from Firestore for a specific user
 */
export async function loadFromFirestore(userId: string): Promise<UserData | null> {
  if (!userId) return null;

  try {
    const docRef = doc(db, 'users', userId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      console.log('✅ Data loaded from Firestore');
      return docSnap.data() as UserData;
    } else {
      console.log('ℹ️ No data found in Firestore for this user');
      return null;
    }
  } catch (error) {
    console.error('❌ Failed to load from Firestore:', error);
    throw error;
  }
}

/**
 * Subscribe to real-time updates from Firestore
 */
export function subscribeToFirestore(userId: string, onUpdate: (data: UserData) => void) {
  if (!userId) return () => {};

  const docRef = doc(db, 'users', userId);
  
  return onSnapshot(
    docRef,
    (docSnap) => {
      if (docSnap.exists()) {
        console.log('🔄 Real-time update from Firestore');
        onUpdate(docSnap.data() as UserData);
      }
    },
    (error) => {
      console.error('❌ Firestore subscription error:', error);
    }
  );
}

/**
 * Merge Firestore data with local state (conflict resolution: server wins)
 */
export function mergeWithLocalState(firestoreData: UserData) {
  const state = useAppStore.getState();
  
  // Import all data from Firestore
  if (firestoreData.subjects) state.subjects = firestoreData.subjects;
  if (firestoreData.timetable) state.timetable = firestoreData.timetable;
  if (firestoreData.attendanceRecords) state.attendanceRecords = firestoreData.attendanceRecords;
  if (firestoreData.settings) state.settings = firestoreData.settings;
  if (firestoreData.profiles) state.profiles = firestoreData.profiles;
  if (firestoreData.activeUserId !== undefined) state.activeUserId = firestoreData.activeUserId;
  
  console.log('🔄 State merged with Firestore data');
}
