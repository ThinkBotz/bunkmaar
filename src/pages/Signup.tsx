import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { toast } from "@/components/ui/sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const Signup: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Basic client-side validation
    if (!email) {
      toast.error("Please enter an email");
      setLoading(false);
      return;
    }
    if (!password || password.length < 6) {
      toast.error("Password must be at least 6 characters");
      setLoading(false);
      return;
    }
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      toast.success("Account created");
      navigate("/", { replace: true });
    } catch (err: any) {
      console.error("Signup error:", err);
      const code = err?.code ? `${err.code} — ` : "";
      const message = err?.message || "Failed to create account";
      toast.error(code + message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md p-6 rounded-md border bg-card">
        <h2 className="text-2xl mb-4">Create account</h2>
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
            <Button type="submit" disabled={loading}>{loading ? "Creating..." : "Create account"}</Button>
            <Link to="/login" className="text-sm text-primary">Have an account?</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;
