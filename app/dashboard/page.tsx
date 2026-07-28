"use client";

import { useQuery } from "@tanstack/react-query";
import { BarChart3, BriefcaseBusiness, Users, TrendingUp, CalendarRange, Bell } from "lucide-react";
import { DashboardShell } from "@/components/dashboard-shell";
import { dashboardMetrics, pipelineColumns } from "@/lib/mock-data";

const statCards = [
  { label: "Total Jobs", icon: BriefcaseBusiness },
  { label: "Active Jobs", icon: CalendarRange },
  { label: "Total Candidates", icon: Users },
  { label: "Hire Rate", icon: TrendingUp },
];

export default function DashboardPage() {
  const { data } = useQuery({
    queryKey: ["dashboard-metrics"],
    queryFn: async () => {
      const response = await fetch("/api/dashboard/metrics");
      return response.json();
    },
    initialData: dashboardMetrics,
  });

  const stats = [
    { label: "Total Jobs", value: data.totalJobs, icon: BriefcaseBusiness },
    { label: "Active Jobs", value: data.activeJobs, icon: CalendarRange },
    { label: "Total Candidates", value: data.totalCandidates.toLocaleString(), icon: Users },
    { label: "Hire Rate", value: `${Math.round(data.hireRate * 100)}%`, icon: TrendingUp },
  ];

  return (
    <DashboardShell title="Dashboard" subtitle="Overview of hiring activity, pipeline health and notifications.">
      <div className="grid gap-6 xl:grid-cols-4">
        {stats.map((item) => {
          const Icon = item.icon;
          return (
            <article key={item.label} className="rounded-[20px] border border-white/10 bg-white/5 p-5 shadow-soft">
              <div className="flex items-center justify-between">
                <div className="text-sm text-slate-400">{item.label}</div>
                <Icon size={18} className="text-blue-400" />
              </div>
              <div className="mt-4 text-3xl font-semibold text-white">{item.value}</div>
            </article>
          );
        })}
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.4fr_0.6fr]">
        <article className="rounded-[20px] border border-white/10 bg-white/5 p-5 shadow-soft">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Recruitment Funnel</h2>
            <BarChart3 size={18} className="text-blue-400" />
          </div>
          <div className="mt-6 grid grid-cols-7 gap-3">
            {pipelineColumns.map((column, index) => (
              <div key={column} className="rounded-2xl border border-white/10 bg-slate-900/70 p-3 text-center">
                <div
                  className="mx-auto mb-3 w-full rounded-t-2xl bg-gradient-to-t from-blue-600 to-emerald-400"
                  style={{ height: `${32 + index * 10}px` }}
                />
                <div className="text-xs text-slate-300">{column}</div>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-[20px] border border-white/10 bg-white/5 p-5 shadow-soft">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Notifications</h2>
            <Bell size={18} className="text-blue-400" />
          </div>
          <div className="mt-4 space-y-3">
            {[
              "New candidate applied",
              "Interview reminder due in 30 mins",
              "Offer sent to candidate",
            ].map((item) => (
              <div key={item} className="rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3 text-sm text-slate-300">
                {item}
              </div>
            ))}
          </div>
        </article>
      </div>
    </DashboardShell>
  );
}
