"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  BarChart3,
  BriefcaseBusiness,
  CalendarRange,
  CheckCircle2,
  FileText,
  FolderKanban,
  Globe2,
  LockKeyhole,
  Search,
  Users,
} from "lucide-react";
import { AuthModal } from "@/components/auth-modal";
import { featureCards, landingStats, pricingPlans, testimonials } from "@/lib/mock-data";
import { useAuthStore, persistUser } from "@/store/auth-store";

const heroHighlights = [
  "Smart Recruitment OS",
  "Modern UI for HR teams",
  "Candidate-friendly journey",
];

const trustPoints = [
  "Branded job pages",
  "Pipeline visibility",
  "Interview scheduling",
  "Evaluation scorecards",
];

export function LandingPage() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);
  const [authMode, setAuthMode] = useState<"login" | "register" | "forgot" | null>(null);

  const authCopy = useMemo(() => {
    switch (authMode) {
      case "login":
        return {
          title: "Welcome back",
          subtitle: "Sign in to continue managing jobs, candidates, and hiring pipeline.",
        };
      case "register":
        return {
          title: "Create your workspace",
          subtitle: "Set up a hiring workspace for your company in just a few minutes.",
        };
      default:
        return {
          title: "Reset password",
          subtitle: "Use a verification code to recover access securely.",
        };
    }
  }, [authMode]);

  function loginDemo() {
    const nextUser = {
      name: "Demo HR",
      email: "hr@uneedwhat.com",
      role: "HR" as const,
      companyName: "UneedWhat Labs",
    };

    setUser(nextUser);
    persistUser(nextUser);
    setAuthMode(null);
    router.push("/dashboard");
  }

  return (
    <main className="min-h-screen overflow-hidden bg-slate-950 text-slate-100">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_20%_20%,rgba(37,99,235,0.18),transparent_0_24%),radial-gradient(circle_at_80%_10%,rgba(34,197,94,0.12),transparent_0_18%),radial-gradient(circle_at_70%_80%,rgba(245,158,11,0.12),transparent_0_16%)]" />
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.03),transparent_20%,transparent_80%,rgba(15,23,42,0.7))]" />

      <AuthModal
        open={authMode !== null}
        title={authCopy.title}
        subtitle={authCopy.subtitle}
        onClose={() => setAuthMode(null)}
      >
        {authMode === "forgot" ? (
          <form className="space-y-4">
            <input className="auth-input" placeholder="Company email" />
            <input className="auth-input" placeholder="OTP code" />
            <input className="auth-input" placeholder="New password" type="password" />
            <button className="auth-submit" type="button" onClick={loginDemo}>
              Reset password
            </button>
          </form>
        ) : authMode === "register" ? (
          <form className="space-y-4">
            <input className="auth-input" placeholder="Company name" />
            <input className="auth-input" placeholder="Work email" />
            <input className="auth-input" placeholder="Password" type="password" />
            <button className="auth-submit" type="button" onClick={loginDemo}>
              Create account
            </button>
          </form>
        ) : (
          <form className="space-y-4">
            <input className="auth-input" placeholder="Work email" />
            <input className="auth-input" placeholder="Password" type="password" />
            <label className="flex items-center gap-2 text-sm text-slate-300">
              <input type="checkbox" className="h-4 w-4 accent-blue-500" />
              Remember me
            </label>
            <button className="auth-submit" type="button" onClick={loginDemo}>
              Sign in
            </button>
            <button
              className="mx-auto block text-sm text-slate-400 hover:text-white"
              type="button"
              onClick={() => setAuthMode("forgot")}
            >
              Forgot password?
            </button>
          </form>
        )}
      </AuthModal>

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <header className="flex flex-wrap items-center justify-between gap-4 rounded-[24px] border border-white/10 bg-white/6 px-5 py-4 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-2xl bg-blue-500 text-white shadow-soft">
              <FolderKanban size={20} />
            </div>
            <div>
              <div className="text-sm font-semibold tracking-wide">UneedWhat I Need U</div>
              <div className="text-xs uppercase tracking-[0.24em] text-slate-400">
                Recruitment platform
              </div>
            </div>
          </div>

          <nav className="hidden items-center gap-6 text-sm text-slate-300 md:flex">
            <a href="#features" className="hover:text-white">
              Features
            </a>
            <a href="#dashboard-preview" className="hover:text-white">
              Dashboard
            </a>
            <a href="#pricing" className="hover:text-white">
              Pricing
            </a>
          </nav>

          <div className="flex items-center gap-3">
            {user ? (
              <button className="secondary-btn" onClick={() => router.push("/dashboard")}>
                Go to dashboard
              </button>
            ) : (
              <>
                <button className="auth-link" onClick={() => setAuthMode("login")}>
                  Login
                </button>
                <button className="primary-btn" onClick={() => setAuthMode("register")}>
                  Start free <ArrowRight size={16} />
                </button>
              </>
            )}
          </div>
        </header>

        <section className="grid gap-10 py-16 lg:grid-cols-[1.08fr_0.92fr] lg:items-center lg:py-20">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-500/10 px-4 py-2 text-sm text-blue-200">
              <BadgeCheck size={14} />
              Built for HR teams, hiring managers, and candidates
            </div>

            <h1 className="max-w-3xl text-5xl font-semibold tracking-tight text-white md:text-7xl">
              Modern recruitment,
              <span className="block text-transparent bg-gradient-to-r from-blue-300 via-white to-emerald-300 bg-clip-text">
                all in one place.
              </span>
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
              UneedWhat I Need U is an ATS-style hiring platform that helps HR teams publish jobs,
              manage candidates, schedule interviews, and move faster with a cleaner, more
              professional workflow.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <button className="primary-btn" onClick={() => setAuthMode("register")}>
                Start free <ArrowRight size={16} />
              </button>
              <button className="secondary-btn" onClick={() => setAuthMode("login")}>
                View demo
              </button>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              {heroHighlights.map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300"
                >
                  {item}
                </span>
              ))}
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              {landingStats.map((item, index) => (
                <motion.article
                  key={item.label}
                  className="rounded-[22px] border border-white/10 bg-white/6 p-5 shadow-soft"
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  viewport={{ once: true }}
                >
                  <div className="text-3xl font-semibold text-white">{item.value}</div>
                  <div className="mt-2 text-sm font-medium text-slate-200">{item.label}</div>
                  <div className="mt-1 text-xs leading-5 text-slate-400">{item.note}</div>
                </motion.article>
              ))}
            </div>
          </motion.div>

          <motion.div
            id="dashboard-preview"
            className="relative rounded-[32px] border border-white/10 bg-slate-900/90 p-5 shadow-soft"
            initial={{ opacity: 0, y: 30, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.55, delay: 0.1 }}
          >
            <div className="absolute -left-8 -top-8 h-24 w-24 rounded-full bg-blue-500/20 blur-3xl" />
            <div className="absolute -bottom-10 right-8 h-28 w-28 rounded-full bg-emerald-500/15 blur-3xl" />

            <div className="rounded-[24px] border border-white/10 bg-white/5 p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="text-xs uppercase tracking-[0.24em] text-blue-300">
                    Live hiring board
                  </div>
                  <div className="mt-2 text-lg font-semibold text-white">
                    Pipeline overview for today
                  </div>
                </div>
                <div className="rounded-full border border-emerald-400/20 bg-emerald-500/10 px-3 py-1 text-xs text-emerald-200">
                  Updated just now
                </div>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl bg-blue-500/10 p-4">
                  <div className="flex items-center gap-2 text-sm text-blue-200">
                    <BriefcaseBusiness size={14} /> Active jobs
                  </div>
                  <div className="mt-3 text-3xl font-semibold text-white">18</div>
                  <div className="mt-1 text-xs text-slate-400">Published roles hiring now</div>
                </div>
                <div className="rounded-2xl bg-white/5 p-4">
                  <div className="flex items-center gap-2 text-sm text-slate-200">
                    <Users size={14} /> Candidates
                  </div>
                  <div className="mt-3 text-3xl font-semibold text-white">12.8k</div>
                  <div className="mt-1 text-xs text-slate-400">Profiles in the ATS</div>
                </div>
                <div className="rounded-2xl bg-emerald-500/10 p-4">
                  <div className="flex items-center gap-2 text-sm text-emerald-200">
                    <BarChart3 size={14} /> Hire rate
                  </div>
                  <div className="mt-3 text-3xl font-semibold text-white">38%</div>
                  <div className="mt-1 text-xs text-slate-400">Monthly conversion rate</div>
                </div>
              </div>

              <div className="mt-4 grid gap-3">
                {[
                  ["Applied", 72, "Incoming applicants"],
                  ["Screening", 48, "HR review in progress"],
                  ["Interview", 29, "Next interviews scheduled"],
                  ["Offer", 12, "Awaiting final decision"],
                ].map(([label, value, note]) => (
                  <div
                    key={label}
                    className="rounded-2xl border border-white/10 bg-slate-950/60 p-4"
                  >
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-200">{label as string}</span>
                      <span className="text-white">{value as number}</span>
                    </div>
                    <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/5">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-blue-500 to-emerald-400"
                        style={{ width: `${value as number}%` }}
                      />
                    </div>
                    <div className="mt-2 text-xs text-slate-400">{note as string}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="rounded-[24px] border border-white/10 bg-white/5 p-4">
                <div className="flex items-center gap-2 text-sm text-slate-200">
                  <CalendarRange size={14} className="text-blue-300" />
                  Next interview
                </div>
                <div className="mt-3 text-lg font-semibold text-white">Sarah Kim</div>
                <div className="mt-1 text-sm text-slate-400">Frontend Engineer · 10:00 AM</div>
                <div className="mt-3 flex items-center gap-2 text-xs text-slate-300">
                  <Globe2 size={13} />
                  meet.uneedwhat.com/sarah-kim
                </div>
              </div>
              <div className="rounded-[24px] border border-white/10 bg-white/5 p-4">
                <div className="flex items-center gap-2 text-sm text-slate-200">
                  <LockKeyhole size={14} className="text-emerald-300" />
                  Access and safety
                </div>
                <div className="mt-3 text-lg font-semibold text-white">Role-based control</div>
                <div className="mt-1 text-sm text-slate-400">
                  Super Admin, Company Admin, HR, and Interviewer.
                </div>
                <div className="mt-3 flex items-center gap-2 text-xs text-emerald-200">
                  <CheckCircle2 size={13} />
                  Secure by default
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        <section id="features" className="py-8">
          <div className="max-w-3xl">
            <p className="text-xs uppercase tracking-[0.28em] text-blue-400">Platform features</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white md:text-4xl">
              A hiring experience that feels clear, fast, and premium.
            </h2>
            <p className="mt-4 text-slate-400">
              Built to help HR teams move from job posting to hiring decisions with fewer clicks
              and stronger visual hierarchy.
            </p>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {featureCards.map((card, index) => {
              const iconSet = [Search, BriefcaseBusiness, CalendarRange, FileText, BarChart3, Users];
              const Icon = iconSet[index % iconSet.length];

              return (
                <motion.article
                  key={card.title}
                  className="rounded-[24px] border border-white/10 bg-white/6 p-6 shadow-soft transition hover:-translate-y-1"
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-300">
                    <Icon size={18} />
                  </div>
                  <h3 className="mt-5 text-xl font-semibold text-white">{card.title}</h3>
                  <p className="mt-3 leading-7 text-slate-400">{card.description}</p>
                </motion.article>
              );
            })}
          </div>
        </section>

        <section className="py-20">
          <div className="grid gap-6 lg:grid-cols-[1.02fr_0.98fr]">
            <div className="rounded-[28px] border border-white/10 bg-white/6 p-7 shadow-soft">
              <p className="text-xs uppercase tracking-[0.28em] text-blue-400">Why teams choose it</p>
              <div className="mt-4 grid gap-4">
                {trustPoints.map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-950/50 px-4 py-3"
                  >
                    <CheckCircle2 size={18} className="text-emerald-300" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[28px] border border-white/10 bg-slate-900/80 p-7 shadow-soft">
              <p className="text-xs uppercase tracking-[0.28em] text-blue-400">Social proof</p>
              <div className="mt-4 grid gap-4">
                {testimonials.map((item) => (
                  <blockquote
                    key={item.name}
                    className="rounded-2xl border border-white/10 bg-white/5 p-5"
                  >
                    <p className="leading-7 text-slate-300">“{item.quote}”</p>
                    <footer className="mt-4">
                      <div className="font-semibold text-white">{item.name}</div>
                      <div className="text-sm text-slate-400">{item.role}</div>
                    </footer>
                  </blockquote>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="pricing" className="py-8 pb-20">
          <div className="max-w-3xl">
            <p className="text-xs uppercase tracking-[0.28em] text-blue-400">Pricing</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white md:text-4xl">
              Simple plans that scale from one team to multi-company SaaS.
            </h2>
          </div>

          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {pricingPlans.map((plan) => (
              <motion.article
                key={plan.name}
                className={[
                  "rounded-[28px] border p-7 shadow-soft",
                  plan.highlight
                    ? "border-blue-400/30 bg-blue-500/10"
                    : "border-white/10 bg-white/6",
                ].join(" ")}
                whileHover={{ y: -4 }}
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-white">{plan.name}</h3>
                  {plan.highlight ? (
                    <span className="rounded-full border border-blue-300/20 bg-blue-400/10 px-3 py-1 text-xs text-blue-200">
                      Most popular
                    </span>
                  ) : null}
                </div>
                <div className="mt-5 text-4xl font-semibold text-white">{plan.price}</div>
                <div className="mt-2 text-sm text-slate-400">per month</div>
                <ul className="mt-6 space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-3 text-slate-300">
                      <CheckCircle2 size={16} className="text-emerald-300" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <button className="secondary-btn mt-7 w-full">
                  Choose plan <ArrowRight size={16} />
                </button>
              </motion.article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
