"use client";

import Link from "next/link";
import { useState } from "react";

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false);

  return (
    <main className="relative mx-auto flex min-h-screen max-w-md items-center px-4 py-10">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,rgba(245,158,11,0.15),transparent_0_28%)]" />
      <form
        className="w-full space-y-4 rounded-[28px] border border-white/10 bg-white/6 p-8 shadow-soft backdrop-blur-xl"
        onSubmit={(event) => {
          event.preventDefault();
          setSent(true);
        }}
      >
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-blue-400">Recruitment access</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">Recover access</h1>
          <p className="mt-2 text-sm leading-6 text-slate-400">
            Verify your email, confirm OTP, and reset your password.
          </p>
        </div>
        <input className="auth-input" placeholder="Work email" />
        <input className="auth-input" placeholder="OTP code" />
        <input className="auth-input" placeholder="New password" type="password" />
        <button className="auth-submit" type="submit">
          Send OTP
        </button>
        {sent && <p className="text-sm text-emerald-400">OTP has been sent. Reset password now.</p>}
        <div className="text-center text-sm text-slate-400">
          <Link href="/login">Back to login</Link>
        </div>
      </form>
    </main>
  );
}
