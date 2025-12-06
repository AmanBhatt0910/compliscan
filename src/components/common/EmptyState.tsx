"use client";

import { ReactNode } from "react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: ReactNode;
}

export function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
  icon,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-[var(--radius-card)] border border-dashed border-slate-800/80 bg-slate-950/60 px-6 py-10 text-center">
      {icon && <div className="mb-1 text-slate-500">{icon}</div>}
      <h3 className="text-sm font-semibold">{title}</h3>
      {description && (
        <p className="max-w-xs text-xs text-[var(--color-muted-foreground)]">
          {description}
        </p>
      )}
      {actionLabel && onAction && (
        <Button variant="outline" size="sm" onClick={onAction} className="mt-2">
          {actionLabel}
        </Button>
      )}
    </div>
  );
}