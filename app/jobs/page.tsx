import { BadgeCheck, BriefcaseBusiness } from "lucide-react";
import { DashboardShell } from "@/components/dashboard-shell";
import { jobs } from "@/lib/mock-data";

export default function JobsPage() {
  return (
    <DashboardShell title="Jobs" subtitle="Create, edit, close and clone job posts.">
      <div className="grid gap-4 xl:grid-cols-3">
        {jobs.map((job) => (
          <article key={job.title} className="rounded-[20px] border border-white/10 bg-white/5 p-5 shadow-soft">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-xs uppercase tracking-[0.24em] text-blue-400">{job.status}</div>
                <h2 className="mt-2 text-xl font-semibold">{job.title}</h2>
                <p className="mt-1 text-sm text-slate-400">{job.department} · {job.location}</p>
              </div>
              <BriefcaseBusiness className="text-blue-400" size={18} />
            </div>
            <div className="mt-5 space-y-3 text-sm text-slate-300">
              <div><span className="text-slate-500">Salary:</span> {job.salary}</div>
              <div><span className="text-slate-500">Requirement:</span> {job.requirement}</div>
              <div><span className="text-slate-500">Benefit:</span> {job.benefit}</div>
              <div><span className="text-slate-500">Deadline:</span> {job.deadline}</div>
            </div>
            <div className="mt-5 flex gap-2">
              <button className="secondary-btn text-xs">Edit</button>
              <button className="secondary-btn text-xs">Clone Job</button>
              <button className="primary-btn text-xs">Publish</button>
            </div>
          </article>
        ))}
      </div>
    </DashboardShell>
  );
}
