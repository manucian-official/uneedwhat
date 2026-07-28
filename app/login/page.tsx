"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuthStore, persistUser } from "@/store/auth-store";

export default function LoginPage() {
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const user = { name: email.split("@")[0] || "Guest", email, role: "HR" as const };
    setUser(user);
    persistUser(user);
    router.push("/dashboard");
  }

  return (
    <main className="relative mx-auto flex min-h-screen max-w-md items-center px-4 py-10">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,rgba(37,99,235,0.18),transparent_0_28%)]" />
      <form
        onSubmit={handleSubmit}
        className="w-full space-y-4 rounded-[28px] border border-white/10 bg-white/6 p-8 shadow-soft backdrop-blur-xl"
      >
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-blue-400">Recruitment access</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">Sign in</h1>
          <p className="mt-2 text-sm leading-6 text-slate-400">
            Log in to manage jobs, candidates, interviews, and reporting.
          </p>
        </div>
        <label className="block space-y-2 text-sm text-slate-300">
          <span>Email</span>
          <input
            className="auth-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="hr@company.com"
            type="email"
          />
        </label>
        <label className="block space-y-2 text-sm text-slate-300">
          <span>Password</span>
          <input
            className="auth-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            type="password"
          />
        </label>
        <label className="flex items-center gap-2 text-sm text-slate-300">
          <input type="checkbox" className="h-4 w-4 accent-blue-500" /> Remember me
        </label>
        <button className="auth-submit" type="submit">
          Sign in
        </button>
        <div className="flex justify-between gap-3 text-sm text-slate-400">
          <Link href="/forgot-password">Forgot password?</Link>
          <Link href="/register">Create account</Link>
        </div>
      </form>
    </main>
  );
}
