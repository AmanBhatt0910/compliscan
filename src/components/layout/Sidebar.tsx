// src/components/layout/Sidebar.tsx
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ShieldHalf, LogOut } from "lucide-react";
import { sidebarNav } from "@/config/nav";
import { cn } from "@/lib/utils";

interface CurrentUser {
  id: string;
  name?: string;
  email: string;
  role?: string;
}

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const [user, setUser] = useState<CurrentUser | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function fetchUser() {
      try {
        const res = await fetch("/api/auth/me");
        if (!res.ok) return;

        const data: { user: CurrentUser | null } = await res.json();
        if (isMounted) {
          setUser(data.user);
        }
      } catch (err) {
        console.error("Failed to load current user", err);
      } finally {
        if (isMounted) setLoadingUser(false);
      }
    }

    fetchUser();

    return () => {
      isMounted = false;
    };
  }, []);

  async function handleLogout() {
    try {
      setLoggingOut(true);
      await fetch("/api/auth/logout", {
        method: "POST",
      });
      // Refresh and go to login
      router.push("/login");
      router.refresh();
    } catch (err) {
      console.error("Logout failed", err);
    } finally {
      setLoggingOut(false);
    }
  }

  return (
    <aside className="hidden h-screen w-64 flex-col border-r border-slate-900/80 bg-[radial-gradient(circle_at_top,_#020617_0,_#020617_40%,_#020617_70%,_#000_100%)]/95 px-4 py-4 md:flex">
      {/* Logo + workspace */}
      <div className="mb-6 flex items-center justify-between gap-2 px-1">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-[conic-gradient(at_top_left,_#4f46e5,_#0ea5e9,_#22c55e,_#4f46e5)] shadow-lg shadow-indigo-500/30">
            <div className="flex h-7 w-7 items-center justify-center rounded-2xl bg-slate-950/90">
              <ShieldHalf className="h-4 w-4 text-indigo-300" />
            </div>
          </div>
          <div>
            <p className="text-sm font-semibold leading-tight tracking-tight text-slate-50">
              CompliScan
            </p>
            <p className="text-[0.65rem] text-slate-400">
              Security Compliance Analyzer
            </p>
          </div>
        </div>
        <span className="rounded-full bg-slate-900/80 px-2 py-0.5 text-[0.6rem] font-medium uppercase tracking-wide text-slate-400 border border-slate-800/80">
          Workspace
        </span>
      </div>

      {/* Section label */}
      <p className="mb-2 px-1 text-[0.65rem] font-medium uppercase tracking-wide text-slate-500">
        Navigation
      </p>

      {/* Nav */}
      <nav className="flex-1 space-y-1">
        {sidebarNav.map((item) => {
          const Icon = item.icon;
          const active =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname.startsWith(item.href));

          return (
            <Link
              href={item.href}
              key={item.href}
              className={cn(
                "group relative flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium transition-all",
                "text-slate-400 hover:text-slate-50 hover:bg-slate-900/70",
                active &&
                  "text-slate-50 bg-slate-900/90 shadow-[0_0_0_1px_rgba(129,140,248,0.5)]"
              )}
            >
              {/* Left accent bar when active */}
              <span
                className={cn(
                  "absolute left-0 top-1/2 h-6 w-0.5 -translate-y-1/2 rounded-full bg-indigo-400/80 opacity-0 transition-opacity",
                  active && "opacity-100"
                )}
              />
              <div
                className={cn(
                  "flex h-7 w-7 items-center justify-center rounded-xl border border-slate-800/80 bg-slate-950/60 transition-all group-hover:border-slate-700 group-hover:bg-slate-900/80",
                  active && "border-indigo-400/70 bg-indigo-500/10"
                )}
              >
                <Icon className="h-4 w-4" />
              </div>
              <span className="truncate">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer / user mini */}
      <div className="mt-4 border-t border-slate-900/80 pt-4">
        <div className="flex items-center justify-between gap-2">
          <div className="min-w-0">
            <p className="text-[0.65rem] text-slate-500">Signed in as</p>
            <p className="text-[0.7rem] font-medium text-slate-200 truncate">
              {loadingUser
                ? "Loading..."
                : user?.name || user?.email || "Unknown user"}
            </p>
            {user?.email && (
              <p className="text-[0.65rem] text-slate-400 truncate">
                {user.email}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={handleLogout}
            disabled={loggingOut}
            className={cn(
              "inline-flex items-center justify-center rounded-full border border-slate-800/80 bg-slate-950/70 px-2.5 py-1 text-[0.6rem] font-medium text-slate-400 transition-colors hover:border-red-500/60 hover:bg-red-500/10 hover:text-red-200",
              loggingOut && "opacity-60 cursor-not-allowed"
            )}
          >
            <LogOut className="mr-1 h-3 w-3" />
            {loggingOut ? "Signing out…" : "Sign out"}
          </button>
        </div>
      </div>
    </aside>
  );
}