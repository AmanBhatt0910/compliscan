"use client";

import { Search, Bell } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { Input } from "@/components/ui/input";

export default function Topbar() {
  return (
    <header className="flex items-center justify-between gap-3 border-b border-slate-900/80 bg-[color-mix(in_srgb,var(--color-background) 90%,black)] px-4 py-3">
      {/* Search (for future) */}
      <div className="flex flex-1 items-center gap-2 max-w-md">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-500" />
          <Input
            className="h-9 rounded-[999px] bg-slate-950/80 pl-8 text-xs"
            placeholder="Search apps, scans, findings..."
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <button
          className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-800/80 bg-slate-950/80 text-slate-400 hover:bg-slate-900/80 hover:text-slate-100"
          aria-label="Notifications"
        >
          <Bell className="h-4 w-4" />
        </button>
        <ThemeToggle />
        <div className="h-8 w-px bg-slate-800" />
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-full bg-gradient-to-tr from-[var(--color-brand)] to-[var(--color-accent)]" />
          <div className="hidden text-xs leading-tight sm:block">
            <p className="font-medium text-slate-100">Security Analyst</p>
            <p className="text-[0.6rem] text-slate-500">CompliScan</p>
          </div>
        </div>
      </div>
    </header>
  );
}