import { Search, UserCircle2 } from "lucide-react";
import { DashboardShell } from "@/components/dashboard-shell";
import { candidates } from "@/lib/mock-data";

export default function CandidatesPage() {
  return (
    <DashboardShell title="Candidates" subtitle="Filter, search and review candidate profiles in real time.">
      <div className="mb-4 flex gap-3">
        <input className="auth-input max-w-md" placeholder="Search candidate..." />
        <button className="primary-btn">
          <Search size={16} /> Search
        </button>
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        {candidates.map((candidate) => (
          <article key={candidate.name} className="rounded-[20px] border border-white/10 bg-white/5 p-5 shadow-soft">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-xs uppercase tracking-[0.24em] text-blue-400">{candidate.status}</div>
                <h2 className="mt-2 text-xl font-semibold">{candidate.name}</h2>
                <p className="mt-1 text-sm text-slate-400">{candidate.position}</p>
              </div>
              <UserCircle2 size={18} className="text-blue-400" />
            </div>
            <div className="mt-5 space-y-2 text-sm text-slate-300">
              <div>Source: {candidate.source}</div>
              <div>Score: {candidate.score}/100</div>
            </div>
            <div className="mt-4 h-2 rounded-full bg-slate-800">
              <div className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-emerald-400" style={{ width: `${candidate.score}%` }} />
            </div>
          </article>
        ))}
      </div>
    </DashboardShell>
  );
}
