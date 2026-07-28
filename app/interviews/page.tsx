import { CalendarRange, Link2, UserRoundCheck } from "lucide-react";
import { DashboardShell } from "@/components/dashboard-shell";
import { interviews, evaluations } from "@/lib/mock-data";

export default function InterviewsPage() {
  return (
    <DashboardShell title="Interviews" subtitle="Create schedules, share meeting links and track notes.">
      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <section className="rounded-[20px] border border-white/10 bg-white/5 p-5 shadow-soft">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Calendar view</h2>
            <CalendarRange size={18} className="text-blue-400" />
          </div>
          <div className="space-y-3">
            {interviews.map((item) => (
              <div key={item.candidate} className="rounded-2xl border border-white/10 bg-slate-900/70 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="font-medium text-white">{item.candidate}</div>
                    <div className="text-sm text-slate-400">{item.interviewer}</div>
                  </div>
                  <div className="text-sm text-slate-300">{item.time}</div>
                </div>
                <div className="mt-3 flex items-center gap-2 text-sm text-blue-300">
                  <Link2 size={14} /> {item.link}
                </div>
              </div>
            ))}
          </div>
        </section>
        <section className="rounded-[20px] border border-white/10 bg-white/5 p-5 shadow-soft">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Evaluation</h2>
            <UserRoundCheck size={18} className="text-blue-400" />
          </div>
          <div className="space-y-4">
            {evaluations.map((item) => (
              <div key={item.label}>
                <div className="mb-2 flex justify-between text-sm">
                  <span>{item.label}</span>
                  <span>{item.score}/10</span>
                </div>
                <div className="h-2 rounded-full bg-slate-800">
                  <div className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-emerald-400" style={{ width: `${item.score * 10}%` }} />
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </DashboardShell>
  );
}
