"use client";

import { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

export type ButtonVariant =
  | "primary"
  | "outline"
  | "ghost"
  | "subtle"
  | "destructive";

export type ButtonSize = "sm" | "md" | "lg" | "icon";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
}

const baseStyles =
  "inline-flex items-center justify-center gap-2 rounded-[var(--radius-card)] font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand)] disabled:opacity-50 disabled:cursor-not-allowed";

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-[var(--color-brand)] text-white hover:bg-[color-mix(in_srgb,var(--color-brand) 80%,black)]",
  outline:
    "border border-[var(--color-border-subtle)] bg-transparent text-[var(--color-foreground)] hover:bg-[color-mix(in_srgb,var(--color-background) 80%,black)]",
  ghost:
    "bg-transparent text-[var(--color-foreground)] hover:bg-[color-mix(in_srgb,var(--color-background) 80%,black)]",
  subtle:
    "bg-[var(--color-brand-soft)] text-[var(--color-foreground)] hover:bg-[color-mix(in_srgb,var(--color-brand-soft) 70%,black)]",
  destructive: "bg-[#ef4444] text-white hover:bg-[#b91c1c]",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "h-8 px-3 text-xs",
  md: "h-10 px-4 text-sm",
  lg: "h-11 px-5 text-base",
  icon: "h-9 w-9 p-0",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", loading, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          baseStyles,
          variantStyles[variant],
          sizeStyles[size],
          loading && "cursor-wait",
          className
        )}
        disabled={loading || props.disabled}
        {...props}
      >
        {loading && (
          <span className="h-3 w-3 animate-spin rounded-full border-2 border-white/40 border-t-white" />
        )}
        <span className={cn(loading && "opacity-80")}>{children}</span>
      </button>
    );
  }
);

Button.displayName = "Button";