"use client";

import { ReactNode } from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string | number;
  icon?: ReactNode;
  trend?: string;
  className?: string;
}

export function StatCard({ label, value, icon, trend, className }: StatCardProps) {
  return (
    <Card
      className={cn(
        "flex flex-col justify-between gap-3 border border-slate-800/80 bg-gradient-to-br from-slate-950/80 via-slate-950/60 to-slate-900/60",
        className
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <p className="text-[0.7rem] font-medium uppercase tracking-wide text-slate-400">
          {label}
        </p>
        {icon && <div className="text-slate-400">{icon}</div>}
      </div>
      <div className="flex items-end justify-between">
        <p className="text-2xl font-semibold leading-none">{value}</p>
        {trend && (
          <p className="text-[0.7rem] text-emerald-400/90">
            {trend}
          </p>
        )}
      </div>
    </Card>
  );
}