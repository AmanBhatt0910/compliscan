"use client";

import { ReactNode, useEffect } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children?: ReactNode;
}

export function Modal({ open, onClose, title, description, children }: ModalProps) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (open) window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  if (!open || typeof document === "undefined") return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div
        className={cn(
          "compliscan-card relative w-full max-w-lg p-6",
          "bg-[color-mix(in_srgb,var(--color-background) 95%,black)]"
        )}
      >
        <button
          className="absolute right-3 top-3 rounded-full p-1 text-slate-400 hover:bg-slate-800/70 hover:text-slate-100"
          onClick={onClose}
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>
        {title && (
          <h2 className="mb-1 text-sm font-semibold tracking-tight">{title}</h2>
        )}
        {description && (
          <p className="mb-4 text-xs text-[var(--color-muted-foreground)]">
            {description}
          </p>
        )}
        <div>{children}</div>
      </div>
    </div>,
    document.body
  );
}