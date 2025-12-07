// src/lib/scan-engine/headerCheck.ts
import type { Finding } from "./scoring";

export function runHeaderCheck(headers: Headers) {
  const findings: Finding[] = [];
  let score = 100;

  const hsts = headers.get("strict-transport-security");
  if (!hsts) {
    findings.push({
      category: "Headers",
      name: "strict-transport-security",
      status: "warning",
      severity: "Medium",
      description: "HSTS header is missing.",
      recommendation:
        "Add the Strict-Transport-Security header to enforce HTTPS and protect against protocol downgrade attacks.",
    });
    score -= 8;
  }

  const csp = headers.get("content-security-policy");
  if (!csp) {
    findings.push({
      category: "Headers",
      name: "content-security-policy",
      status: "warning",
      severity: "Medium",
      description: "Content-Security-Policy header is missing.",
      recommendation:
        "Define a Content-Security-Policy to restrict sources of scripts, styles and other resources to reduce XSS risk.",
    });
    score -= 8;
  }

  const xfo = headers.get("x-frame-options");
  if (!xfo) {
    findings.push({
      category: "Headers",
      name: "x-frame-options",
      status: "warning",
      severity: "Medium",
      description: "X-Frame-Options header is missing.",
      recommendation:
        "Add X-Frame-Options or an equivalent frame-ancestors directive in CSP to mitigate clickjacking attacks.",
    });
    score -= 6;
  }

  const xcto = headers.get("x-content-type-options");
  if (!xcto) {
    findings.push({
      category: "Headers",
      name: "x-content-type-options",
      status: "warning",
      severity: "Low",
      description: "X-Content-Type-Options header is missing.",
      recommendation:
        "Set X-Content-Type-Options: nosniff to prevent MIME-sniffing related issues.",
    });
    score -= 4;
  }

  const referrerPolicy = headers.get("referrer-policy");
  if (!referrerPolicy) {
    findings.push({
      category: "Headers",
      name: "referrer-policy",
      status: "warning",
      severity: "Low",
      description: "Referrer-Policy header is missing.",
      recommendation:
        "Configure Referrer-Policy to control how much referrer information is sent to external sites.",
    });
    score -= 4;
  }

  return {
    findings,
    categoryScore: Math.max(0, score),
  };
}