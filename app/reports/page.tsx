import { BarChart3, TrendingUp } from "lucide-react";
import { DashboardShell } from "@/components/dashboard-shell";

export default function ReportsPage() {
  return (
    <DashboardShell title="Reports" subtitle="Recruitment funnel, hiring rate, candidate sources and monthly hiring.">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          ["Recruitment Funnel", "84%"],
          ["Hiring Rate", "38%"],
          ["Candidate Sources", "12"],
          ["Monthly Hiring", "26"],
        ].map(([label, value]) => (
          <article key={label} className="rounded-[20px] border border-white/10 bg-white/5 p-5 shadow-soft">
            <div className="text-sm text-slate-400">{label}</div>
            <div className="mt-3 text-3xl font-semibold">{value}</div>
          </article>
        ))}
      </div>
      <div className="mt-6 grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
        <article className="rounded-[20px] border border-white/10 bg-white/5 p-5 shadow-soft">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Analytics dashboard</h2>
            <BarChart3 size={18} className="text-blue-400" />
          </div>
          <div className="mt-6 grid grid-cols-6 gap-3">
            {[44, 58, 72, 48, 62, 80].map((height, index) => (
              <div key={height} className="rounded-2xl border border-white/10 bg-slate-900/70 p-3">
                <div
                  className="w-full rounded-t-2xl bg-gradient-to-t from-blue-600 to-emerald-400"
                  style={{ height: `${height}px` }}
                />
                <div className="mt-2 text-center text-xs text-slate-400">M{index + 1}</div>
              </div>
            ))}
          </div>
        </article>
        <article className="rounded-[20px] border border-white/10 bg-white/5 p-5 shadow-soft">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Hiring rate</h2>
            <TrendingUp size={18} className="text-blue-400" />
          </div>
          <p className="mt-4 text-sm leading-7 text-slate-300">
            Dashboard này là nền sẵn cho các biểu đồ funnel, source, conversion và monthly hiring.
          </p>
        </article>
      </div>
    </DashboardShell>
  );
}
