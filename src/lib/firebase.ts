import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics, isSupported as analyticsIsSupported } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

// Prefer using Vite env vars, but fall back to a hard-coded config when env vars are not provided.
// If you prefer not to commit keys into source, set the `VITE_FIREBASE_*` vars instead.
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY ?? "AIzaSyAObhNZIAjcMm7HYuiq579OK2YMIOD1KKo",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ?? "bunkmaar.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID ?? "bunkmaar",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET ?? "bunkmaar.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID ?? "934327992946",
  appId: import.meta.env.VITE_FIREBASE_APP_ID ?? "1:934327992946:web:f033895059baa5b33b38eb",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID ?? "G-0FV1CM0EV2",
};

// Initialize app (only once)
const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);

// Initialize analytics only in browsers that support it
let analytics: ReturnType<typeof getAnalytics> | undefined = undefined;
if (typeof window !== "undefined") {
  // analyticsIsSupported returns a Promise<boolean>
  analyticsIsSupported()
    .then((supported) => {
      if (supported) {
        try {
          analytics = getAnalytics(app);
        } catch (err) {
          // ignore analytics initialization errors in non-supported environments
          // (e.g. when running inside some CI containers)
        }
      }
    })
    .catch(() => {
      // ignore errors
    });
}

export { app, analytics };
export const auth = getAuth(app);
export const db = getFirestore(app);
