// src/lib/scan-engine/scoring.ts
type FindingStatus = "pass" | "warning" | "fail";

export interface Finding {
  category: string;
  name: string;
  status: "pass" | "warning" | "fail";
  severity: "Low" | "Medium" | "High";
  description: string;
  recommendation: string;
}

export function computeScore(findings: Finding[]): number {
  let score = 100;

  for (const f of findings) {
    if (f.status === "pass") continue;

    if (f.severity === "High") score -= 15;
    else if (f.severity === "Medium") score -= 8;
    else score -= 4;
  }

  return Math.max(0, Math.min(100, score));
}

export function statusFromScore(score: number): FindingStatus {
  if (score >= 80) return "pass";
  if (score >= 60) return "warning";
  return "fail";
}