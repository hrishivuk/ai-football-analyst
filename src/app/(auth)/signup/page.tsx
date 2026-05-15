"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, displayName }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Sign up failed");
        setLoading(false);
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("Network error. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 dot-grid">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-emerald-500/5 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md relative">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-xl pitch-surface flex items-center justify-center shadow-lg shadow-emerald-900/30 mx-auto mb-4">
            <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 2a14.5 14.5 0 000 20 14.5 14.5 0 000-20" />
              <path d="M2 12h20" />
            </svg>
          </div>
          <h1 className="font-(family-name:--font-display) text-2xl font-bold text-white">
            Create your account
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Start building your tactical edge
          </p>
        </div>

        <form onSubmit={handleSignup} className="glass-card rounded-2xl p-6 space-y-5">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
              Name
            </label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Coach name"
              required
              className="w-full px-4 py-3 bg-surface-raised border border-border rounded-xl text-white text-sm placeholder-slate-600 focus:outline-none focus:border-emerald-500/50 input-glow transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="coach@club.com"
              required
              className="w-full px-4 py-3 bg-surface-raised border border-border rounded-xl text-white text-sm placeholder-slate-600 focus:outline-none focus:border-emerald-500/50 input-glow transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Min 6 characters"
              required
              minLength={6}
              className="w-full px-4 py-3 bg-surface-raised border border-border rounded-xl text-white text-sm placeholder-slate-600 focus:outline-none focus:border-emerald-500/50 input-glow transition-all"
            />
          </div>

          {error && (
            <div className="px-4 py-3 bg-red-500/8 border border-red-500/20 rounded-xl text-red-400 text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-emerald-500 text-white font-bold rounded-xl hover:bg-emerald-400 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-lg shadow-emerald-500/20 cursor-pointer text-sm"
          >
            {loading ? "Creating account..." : "Create Account"}
          </button>

          <p className="text-center text-sm text-slate-500">
            Already have an account?{" "}
            <Link href="/login" className="text-emerald-400 hover:text-emerald-300 font-medium">
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
