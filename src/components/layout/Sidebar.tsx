// src/components/layout/Sidebar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShieldHalf } from "lucide-react";
import { sidebarNav } from "@/config/nav";
import { cn } from "@/lib/utils";

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden h-screen w-60 flex-col border-r border-slate-900/80 bg-[color-mix(in_srgb,var(--color-background) 90%,black)] px-4 py-4 md:flex">
      {/* Logo */}
      <div className="mb-6 flex items-center gap-2 px-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-[var(--radius-card)] bg-[var(--color-brand-soft)]">
          <ShieldHalf className="h-4 w-4 text-white" />
        </div>
        <div>
          <p className="text-sm font-semibold leading-none">CompliScan</p>
          <p className="text-[0.6rem] text-[var(--color-muted-foreground)]">
            Security Compliance Analyzer
          </p>
        </div>
      </div>

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
                "flex items-center gap-2 rounded-[var(--radius-card)] px-2.5 py-2 text-xs font-medium transition-colors",
                "text-slate-400 hover:bg-slate-900/80 hover:text-slate-100",
                active &&
                  "bg-[color-mix(in_srgb,var(--color-background) 80%,var(--color-brand))] text-slate-50"
              )}
            >
              <Icon className="h-4 w-4" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer / user mini */}
      <div className="mt-4 border-t border-slate-900/80 pt-4 text-[0.7rem] text-slate-500">
        <p>Logged in as</p>
        <p className="font-medium text-slate-200">you@example.com</p>
      </div>
    </aside>
  );
}