"use client";

import { cn } from "@/lib/utils";

type Status = "pass" | "warning" | "fail";

interface StatusPillProps {
  status: Status;
}

const map: Record<Status, { label: string; className: string }> = {
  pass: {
    label: "Pass",
    className: "bg-emerald-500/10 text-emerald-300 border border-emerald-500/40",
  },
  warning: {
    label: "Warning",
    className: "bg-amber-500/10 text-amber-200 border border-amber-500/40",
  },
  fail: {
    label: "Fail",
    className: "bg-red-500/10 text-red-200 border border-red-500/40",
  },
};

export function StatusPill({ status }: StatusPillProps) {
  const cfg = map[status];

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-[999px] px-2.5 py-0.5 text-[0.7rem] font-medium",
        cfg.className
      )}
    >
      <span className="mr-1 h-1.5 w-1.5 rounded-full bg-current" />
      {cfg.label}
    </span>
  );
}