import { Users2 } from "lucide-react";
import { DashboardShell } from "@/components/dashboard-shell";

export default function TeamPage() {
  return (
    <DashboardShell title="Team" subtitle="Role based collaboration across Super Admin, Company Admin, HR and Interviewer.">
      <div className="grid gap-4 xl:grid-cols-4">
        {["Super Admin", "Company Admin", "HR", "Interviewer"].map((role) => (
          <article key={role} className="rounded-[20px] border border-white/10 bg-white/5 p-5 shadow-soft">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">{role}</h2>
              <Users2 size={18} className="text-blue-400" />
            </div>
            <p className="mt-3 text-sm leading-7 text-slate-300">
              Quản lý quyền, phân công và phân cấp truy cập theo vai trò.
            </p>
          </article>
        ))}
      </div>
    </DashboardShell>
  );
}
