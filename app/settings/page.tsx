import { Settings2 } from "lucide-react";
import { DashboardShell } from "@/components/dashboard-shell";

export default function SettingsPage() {
  return (
    <DashboardShell title="Settings" subtitle="Environment, security, company profile and future SaaS options.">
      <div className="grid gap-4 xl:grid-cols-2">
        {[
          "Environment configuration",
          "JWT authentication",
          "Redis cache",
          "Docker compose",
        ].map((item) => (
          <article key={item} className="rounded-[20px] border border-white/10 bg-white/5 p-5 shadow-soft">
            <div className="flex items-center gap-3">
              <Settings2 size={18} className="text-blue-400" />
              <h2 className="text-lg font-semibold">{item}</h2>
            </div>
            <p className="mt-3 text-sm leading-7 text-slate-300">
              Khung này được thiết kế để mở rộng thành SaaS nhiều công ty, có phân quyền và deployment sẵn sàng.
            </p>
          </article>
        ))}
      </div>
    </DashboardShell>
  );
}
