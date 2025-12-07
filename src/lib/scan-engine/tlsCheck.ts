// src/lib/scan-engine/tlsCheck.ts
import type { Finding } from "./scoring";

export async function runTlsCheck(url: string) {
  const findings: Finding[] = [];
  let score = 100;

  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    findings.push({
      category: "TLS",
      name: "url-format",
      status: "fail",
      severity: "High",
      description: "The URL is not a valid URL.",
      recommendation: "Provide a valid, absolute URL (e.g., https://example.com).",
    });
    return { findings, categoryScore: 0 };
  }

  if (parsed.protocol !== "https:") {
    findings.push({
      category: "TLS",
      name: "https-enforcement",
      status: "fail",
      severity: "High",
      description: "The URL does not use HTTPS.",
      recommendation:
        "Serve the application over HTTPS with a valid TLS certificate and redirect all HTTP traffic to HTTPS.",
    });
    score -= 40;
  }

  // Basic: we could try to fetch HTTP version and see if it redirects, but keep it simple now.

  return {
    findings,
    categoryScore: Math.max(0, score),
  };
}