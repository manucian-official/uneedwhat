"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  BarChart3,
  Bell,
  BriefcaseBusiness,
  ChevronLeft,
  ChevronRight,
  House,
  LayoutDashboard,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
  Settings,
  Users,
  CalendarRange,
  BadgeCheck,
  FileText,
  type LucideIcon,
} from "lucide-react";
import { motion } from "framer-motion";
import { useAuthStore, persistUser } from "@/store/auth-store";
import { useUiStore } from "@/store/ui-store";
import { cn } from "@/lib/utils";

type NavItem = {
  href: "/dashboard" | "/jobs" | "/candidates" | "/interviews" | "/reports" | "/team" | "/settings";
  label: string;
  icon: LucideIcon;
};

const navigation: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/jobs", label: "Jobs", icon: BriefcaseBusiness },
  { href: "/candidates", label: "Candidates", icon: Users },
  { href: "/interviews", label: "Interviews", icon: CalendarRange },
  { href: "/reports", label: "Reports", icon: BarChart3 },
  { href: "/team", label: "Team", icon: FileText },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function DashboardShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);
  const sidebarCollapsed = useUiStore((state) => state.sidebarCollapsed);
  const setSidebarCollapsed = useUiStore((state) => state.setSidebarCollapsed);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="grid min-h-screen grid-cols-[auto,1fr]">
        <aside
          className={cn(
            "sticky top-0 flex h-screen flex-col border-r border-white/10 bg-slate-900/90 backdrop-blur-xl transition-all duration-300",
            sidebarCollapsed ? "w-[84px]" : "w-[280px]"
          )}
        >
          <div className="flex items-center gap-3 border-b border-white/10 px-5 py-5">
            <div className="grid h-11 w-11 place-items-center rounded-2xl bg-blue-500/15 text-blue-400">
              <BadgeCheck size={20} />
            </div>
            {!sidebarCollapsed && (
              <div>
                <div className="text-sm font-semibold tracking-wide">UneedWhat I Need U</div>
                <div className="text-xs uppercase tracking-[0.24em] text-slate-400">
                  ATS Platform
                </div>
              </div>
            )}
          </div>

          <nav className="flex-1 px-3 py-4">
            <div className="space-y-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                const active = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition",
                      active
                        ? "bg-blue-500 text-white shadow-soft"
                        : "text-slate-300 hover:bg-white/5 hover:text-white"
                    )}
                  >
                    <Icon size={18} />
                    {!sidebarCollapsed && <span>{item.label}</span>}
                  </Link>
                );
              })}
            </div>
          </nav>

          <div className="border-t border-white/10 p-4">
            <button
              className="mb-3 flex w-full items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200 transition hover:bg-white/10"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            >
              {sidebarCollapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
              {!sidebarCollapsed && <span className="ml-2">Collapse</span>}
            </button>
            <button
              className="flex w-full items-center justify-center rounded-2xl bg-slate-800 px-4 py-3 text-sm font-medium text-white transition hover:bg-slate-700"
              onClick={() => {
                persistUser(null);
                setUser(null);
                router.push("/");
              }}
            >
              <LogOut size={16} />
              {!sidebarCollapsed && <span className="ml-2">Logout</span>}
            </button>
          </div>
        </aside>

        <main className="min-h-screen">
          <header className="sticky top-0 z-20 border-b border-white/10 bg-slate-950/85 backdrop-blur-xl">
            <div className="flex items-center justify-between gap-4 px-6 py-4">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-blue-400">Recruitment OS</p>
                <h1 className="mt-1 text-2xl font-semibold tracking-tight">{title}</h1>
                <p className="mt-1 text-sm text-slate-400">{subtitle}</p>
              </div>
              <div className="flex items-center gap-3">
                <button className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200">
                  <Bell size={16} className="inline" /> Notifications
                </button>
                <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2">
                  <div className="text-sm font-medium">{user?.name ?? "Demo User"}</div>
                  <div className="text-xs text-slate-400">{user?.role ?? "HR"}</div>
                </div>
              </div>
            </div>
          </header>

          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="p-6"
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
