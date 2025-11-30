import React, { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { toast } from "@/components/ui/sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
            <Input value={password} onChange={(e) => setPassword(e.target.value)} type="password" />
          </div>
          <div className="flex items-center justify-between">
            <Button type="submit" disabled={loading}>{loading ? "Signing in..." : "Sign in"}</Button>
            <Link to="/signup" className="text-sm text-primary">Create account</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
