import React, { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, signInWithRedirect, getRedirectResult } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { toast } from "@/components/ui/sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as any)?.from?.pathname || "/";

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if (!email) {
      toast.error("Please enter an email");
      setLoading(false);
      return;
    }
    if (!password) {
      toast.error("Please enter your password");
      setLoading(false);
      return;
    }
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success("Signed in");
      navigate(from, { replace: true });
    } catch (err: any) {
      console.error("Signin error:", err);
      const code = err?.code ? `${err.code} — ` : "";
      const message = err?.message || "Failed to sign in";
      toast.error(code + message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      try {
        await signInWithPopup(auth, provider);
      } catch (err: any) {
        // If popup is blocked (common in preview environments), fallback to redirect
        const code = err?.code || '';
        if (code.includes('auth/popup-blocked') || code.includes('auth/operation-not-supported-in-this-environment') || code.includes('auth/web-storage-unsupported')) {
          await signInWithRedirect(auth, provider);
          return;
        }
        throw err;
      }
      toast.success("Signed in with Google");
      navigate(from, { replace: true });
    } catch (err: any) {
      console.error("Google signin error:", err);
      const code = err?.code ? `${err.code} — ` : "";
      const message = err?.message || "Failed to sign in with Google";
      toast.error(code + message);
    } finally {
      setLoading(false);
    }
  };

  // Handle redirect result when returning from Google sign-in redirect flow
  React.useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const result = await getRedirectResult(auth);
        if (result && result.user && mounted) {
          toast.success('Signed in with Google');
          navigate(from, { replace: true });
        }
      } catch (err: any) {
        // ignore; user may have cancelled or error will be shown when clicking button
        console.debug('getRedirectResult error', err?.code || err?.message || err);
      }
    })();
    return () => { mounted = false; };
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md p-6 rounded-md border bg-card">
        <h2 className="text-2xl mb-4">Sign in</h2>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm mb-1">Email</label>
            <Input value={email} onChange={(e) => setEmail(e.target.value)} type="email" />
          </div>
          <div>
            <label className="block text-sm mb-1">Password</label>
            <div className="relative">
              <Input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type={showPassword ? "text" : "password"}
              />
              <button
                type="button"
                aria-label={showPassword ? "Hide password" : "Show password"}
                onClick={() => setShowPassword((s) => !s)}
                className="absolute inset-y-0 right-2 flex items-center px-2 text-sm text-muted-foreground"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <Button type="submit" disabled={loading}>{loading ? "Signing in..." : "Sign in"}</Button>
            <Link to="/signup" className="text-sm text-primary">Create account</Link>
          </div>
        </form>
        <div className="mt-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-px bg-border flex-1" />
            <div className="text-xs text-muted-foreground">or</div>
            <div className="h-px bg-border flex-1" />
          </div>
          <Button onClick={handleGoogleSignIn} className="w-full flex items-center justify-center gap-2" disabled={loading}>
            {loading ? (
              "Processing..."
            ) : (
              <>
                <span className="flex items-center justify-center h-4 w-4">
                  <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                    <path d="M17.64 9.2c0-.63-.06-1.23-.18-1.81H9v3.44h4.84c-.21 1.12-.86 2.07-1.82 2.7v2.25h2.94c1.72-1.58 2.7-3.94 2.7-6.58z" fill="#4285F4"/>
                    <path d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.94-2.25c-.82.55-1.87.88-3.02.88-2.32 0-4.29-1.56-4.99-3.66H1.01v2.3C2.5 15.86 5.55 18 9 18z" fill="#34A853"/>
                    <path d="M4.01 10.79A5.41 5.41 0 0 1 3.6 9c0-.62.11-1.22.41-1.79V4.91H1.01A9 9 0 0 0 0 9c0 1.45.33 2.82.9 4.09l3.11-2.3z" fill="#FBBC05"/>
                    <path d="M9 3.58c1.32 0 2.5.45 3.43 1.35l2.57-2.57C13.46.99 11.42 0 9 0 5.55 0 2.5 2.14 1.01 4.91l3.11 2.3C4.71 5.14 6.68 3.58 9 3.58z" fill="#EA4335"/>
                  </svg>
                </span>
                <span>Sign in with Google</span>
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Login;
