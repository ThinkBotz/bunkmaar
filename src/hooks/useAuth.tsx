import React, { useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { Navigate, useLocation } from "react-router-dom";

export function useAuthState() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1) Restore from localStorage immediately for offline-friendly startup
    try {
      const raw = localStorage.getItem('auth:user');
      if (raw) {
        const cached = JSON.parse(raw) as { uid: string; email?: string };
        // Create a minimal shape; consumers typically use email/uid
        setUser({
          uid: cached.uid,
          email: cached.email,
        } as unknown as User);
      } else if (auth.currentUser) {
        // If Firebase already has a current user in memory, use it
        setUser(auth.currentUser);
        // Persist a minimal snapshot
        localStorage.setItem('auth:user', JSON.stringify({ uid: auth.currentUser.uid, email: auth.currentUser.email || undefined }));
      }
    } catch {}
    // Mark loading false to allow app to render even when offline
    setLoading(false);

    // 2) Subscribe to auth changes; update cache when online/available
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      try {
        if (u) {
          localStorage.setItem('auth:user', JSON.stringify({ uid: u.uid, email: u.email || undefined }));
        } else {
          localStorage.removeItem('auth:user');
        }
      } catch {}
    });
    return () => unsub();
  }, []);

  return { user, loading } as const;
}

export function RequireAuth({ children }: { children: JSX.Element }) {
  const { user, loading } = useAuthState();
  const location = useLocation();

  if (loading) return <div className="p-8">Loading...</div>;
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;
  return children;
}
