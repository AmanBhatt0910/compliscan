"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: ReactNode;
  className?: string;
}

export function PageHeader({ title, description, actions, className }: PageHeaderProps) {
  return (
    <motion.div
      className={cn(
        "mb-6 flex flex-col gap-3 border-b border-slate-900/60 pb-4 sm:flex-row sm:items-center sm:justify-between",
        className
      )}
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      <div>
        <h1 className="text-base font-semibold tracking-tight sm:text-lg">
          {title}
        </h1>
        {description && (
          <p className="mt-1 text-xs text-[var(--color-muted-foreground)]">
            {description}
          </p>
        )}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </motion.div>
  );
}