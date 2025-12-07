// src/lib/scan-engine/contentCheck.ts
import type { Finding } from "./scoring";

export function runContentCheck(html: string, url: string) {
  const findings: Finding[] = [];
  let score = 100;

  // Mixed content: look for http:// references on an https page
  if (url.startsWith("https://")) {
    const mixedContent = html.match(/http:\/\/[^\s"']+/gi);
    if (mixedContent && mixedContent.length > 0) {
      findings.push({
        category: "Content",
        name: "mixed-content",
        status: "warning",
        severity: "Medium",
        description:
          "HTTPS page appears to load resources over plain HTTP (mixed content).",
        recommendation:
          "Serve scripts, images and other resources over HTTPS to avoid breaking the secure context and leaking data.",
      });
      score -= 10;
    }
  }

  // Insecure form posts
  const insecureForm = html.match(
    /<form[^>]+action=["']http:\/\/[^"']*["'][^>]*>/i
  );
  if (insecureForm) {
    findings.push({
      category: "Content",
      name: "insecure-form-action",
      status: "fail",
      severity: "High",
      description:
        "A form appears to submit data over HTTP rather than HTTPS.",
      recommendation:
        "Change form actions to HTTPS to prevent credentials or sensitive data from being transmitted in clear text.",
    });
    score -= 20;
  }

  return {
    findings,
    categoryScore: Math.max(0, score),
  };
}