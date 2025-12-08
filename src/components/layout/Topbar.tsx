"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Search, Bell, Globe2, ScanLine, Menu } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { Input } from "@/components/ui/input";
import type { ScanListItem } from "@/types/api";

interface ActivityItem {
  type: "scan_run";
  title: string;
  createdAt: string;
}

interface TopbarProps {
  onToggleSidebar?: () => void;
}

export default function Topbar({ onToggleSidebar }: TopbarProps) {
  const router = useRouter();
  const [showNotif, setShowNotif] = useState(false);
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [hasNew, setHasNew] = useState(false);

  useEffect(() => {
    async function loadLatest() {
      try {
        const res = await fetch("/api/scans");
        if (!res.ok) return;

        const raw = (await res.json()) as ScanListItem[];
        const formatted: ActivityItem[] = raw.slice(0, 5).map((s) => ({
          type: "scan_run",
          title: `Scan completed on ${s.appName || "Unknown"}`,
          createdAt: new Date(s.createdAt).toLocaleString(),
        }));

        setActivities(formatted);
        setHasNew(formatted.length > 0);
      } catch (err) {
        console.error("Notifications fetch failed:", err);
      }
    }

    loadLatest();
  }, []);

  return (
    <header className="flex items-center justify-between gap-3 border-b border-slate-900/80 bg-[color-mix(in_srgb,var(--color-background) 90%,black)] px-4 py-3">
      {/* Left section: mobile menu + search */}
      <div className="flex flex-1 items-center gap-2">
        {/* Mobile menu */}
        <button
          type="button"
          onClick={onToggleSidebar}
          className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-800/80 bg-slate-950/80 text-slate-400 hover:bg-slate-900/80 hover:text-slate-100 md:hidden"
          aria-label="Open navigation"
        >
          <Menu className="h-4 w-4" />
        </button>

        {/* Search */}
        <div className="relative hidden flex-1 max-w-md md:block">
          <Search className="pointer-events-none absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-500" />
          <Input
            className="h-9 w-full rounded-[999px] bg-slate-950/80 pl-8 text-xs"
            placeholder="Search apps, scans, findings..."
          />
        </div>
      </div>

      {/* Right section: notifications, theme, user chip */}
      <div className="relative flex items-center gap-2">
        {/* Notifications */}
        <button
          onClick={() => {
            setShowNotif((prev) => !prev);
            setHasNew(false);
          }}
          className="relative inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-800/80 bg-slate-950/80 text-slate-400 hover:bg-slate-900/80 hover:text-slate-100"
          aria-label="Notifications"
        >
          <Bell className="h-4 w-4" />
          {hasNew && (
            <span className="absolute right-1 top-1 h-2.5 w-2.5 rounded-full bg-sky-400 animate-pulse" />
          )}
        </button>

        {/* Notifications dropdown */}
        {showNotif && (
          <div className="absolute right-12 top-12 z-50 w-64 rounded-lg border border-slate-700/50 bg-slate-900/95 shadow-xl backdrop-blur-md">
            <div className="p-3 text-xs font-semibold uppercase text-slate-400 tracking-wide">
              Notifications
            </div>

            {activities.length === 0 ? (
              <p className="px-4 pb-3 text-[0.7rem] text-slate-500">
                No recent activity
              </p>
            ) : (
              <ul className="max-h-56 overflow-y-auto px-1">
                {activities.map((a, idx) => (
                  <li
                    key={idx}
                    className="flex items-center gap-3 rounded-md px-3 py-2 hover:bg-slate-800/60 transition-colors"
                  >
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-800/80">
                      {a.type === "scan_run" ? (
                        <ScanLine className="h-3.5 w-3.5 text-indigo-300" />
                      ) : (
                        <Globe2 className="h-3.5 w-3.5 text-emerald-300" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="truncate text-[0.7rem] text-slate-100">
                        {a.title}
                      </p>
                      <p className="text-[0.6rem] text-slate-500">
                        {a.createdAt}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            )}

            <button
              className="w-full rounded-b-lg border-t border-slate-700/50 px-3 py-2 text-[0.7rem] text-slate-300 hover:text-slate-100 hover:bg-slate-800/60 transition-colors"
              onClick={() => {
                setShowNotif(false);
                router.push("/dashboard/activities");
              }}
            >
              View all activities →
            </button>
          </div>
        )}

        <ThemeToggle />
        <div className="hidden h-8 w-px bg-slate-800 md:block" />

        {/* User chip (kept generic – detailed user is in sidebar) */}
        <div className="hidden items-center gap-2 sm:flex">
          <div className="h-7 w-7 rounded-full bg-gradient-to-tr from-[var(--color-brand)] to-[var(--color-accent)]" />
          <div className="hidden text-xs leading-tight md:block">
            <p className="font-medium text-slate-100">Security Analyst</p>
            <p className="text-[0.6rem] text-slate-500">CompliScan</p>
          </div>
        </div>
      </div>
    </header>
  );
}