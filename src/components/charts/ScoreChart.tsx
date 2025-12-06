// src/components/charts/ScoreChart.tsx
"use client";

import { cn } from "@/lib/utils";

interface ScoreChartProps {
  score: number; // 0–100
}

export function ScoreChart({ score }: ScoreChartProps) {
  const clamped = Math.min(100, Math.max(0, score));
  const angle = (clamped / 100) * 180; // semicircle

  let color = "text-emerald-400";
  if (clamped < 40) color = "text-red-400";
  else if (clamped < 75) color = "text-amber-300";

  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <div className="relative h-28 w-56 overflow-hidden">
        <div className="absolute inset-x-0 bottom-0 h-28 rounded-full bg-slate-950/90" />
        <div className="absolute inset-0 flex items-end justify-center">
          <div className="relative h-24 w-48 rounded-full border-[10px] border-slate-800/80">
            <div
              className="absolute inset-[-10px] origin-bottom bg-gradient-to-r from-[var(--color-brand)] via-emerald-400 to-[var(--color-accent)]"
              style={{
                clipPath: "polygon(0% 100%, 50% 0%, 100% 100%)",
                transform: `rotate(${angle - 90}deg)`,
                transition: "transform 0.4s ease-out",
              }}
            />
          </div>
        </div>
      </div>
      <div className="text-center">
        <p className={cn("text-3xl font-semibold leading-none", color)}>
          {clamped}
        </p>
        <p className="mt-1 text-[0.7rem] text-[var(--color-muted-foreground)]">
          Overall security score
        </p>
      </div>
    </div>
  );
}