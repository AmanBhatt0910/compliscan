// src/lib/scan-engine/cookieCheck.ts
import type { Finding } from "./scoring";

export function runCookieCheck(headers: Headers) {
  const findings: Finding[] = [];
  let score = 100;

  const setCookieHeaders = headers.get("set-cookie");
  if (!setCookieHeaders) {
    return { findings, categoryScore: score };
  }

  // VERY simple: just check if we see a session-like cookie without HttpOnly/Secure
  const cookies = setCookieHeaders.split(/,(?=[^;]+=)/); // naive split
  for (const raw of cookies) {
    const trimmed = raw.trim();
    const name = trimmed.split("=")[0];

    const lower = trimmed.toLowerCase();
    const isSession =
      name.toLowerCase().includes("session") ||
      name.toLowerCase().includes("auth");

    if (isSession) {
      const hasSecure = lower.includes("secure");
      const hasHttpOnly = lower.includes("httponly");

      if (!hasSecure || !hasHttpOnly) {
        findings.push({
          category: "Cookies",
          name: `cookie:${name}`,
          status: "fail",
          severity: "High",
          description:
            "Session-related cookie is missing Secure and/or HttpOnly flags.",
          recommendation:
            "Ensure session cookies are marked as Secure and HttpOnly to prevent theft via network sniffing or client-side scripts.",
        });
        score -= 20;
      }
    }
  }

  return {
    findings,
    categoryScore: Math.max(0, score),
  };
}