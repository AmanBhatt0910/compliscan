"use client";

import { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type BadgeVariant = "default" | "outline" | "success" | "warning" | "danger";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

const variantStyles: Record<BadgeVariant, string> = {
  default:
    "bg-[var(--color-brand-soft)] text-xs text-[var(--color-foreground)] border border-[var(--color-border-subtle)]",
  outline:
    "text-xs text-[var(--color-muted-foreground)] border border-[var(--color-border-subtle)]",
  success:
    "text-xs border border-emerald-500/40 bg-emerald-500/10 text-emerald-300",
  warning:
    "text-xs border border-amber-500/40 bg-amber-500/10 text-amber-200",
  danger:
    "text-xs border border-red-500/40 bg-red-500/10 text-red-200",
};

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-[999px] px-2.5 py-0.5 font-medium",
        variantStyles[variant],
        className
      )}
      {...props}
    />
  );
}