// src/lib/scan-engine/index.ts
import { runTlsCheck } from "./tlsCheck";
import { runHeaderCheck } from "./headerCheck";
import { runCookieCheck } from "./cookieCheck";
import { runContentCheck } from "./contentCheck";
import { computeScore, statusFromScore, type Finding } from "./scoring";

export async function runScan(targetUrl: string) {
  const response = await fetch(targetUrl, {
    method: "GET",
    redirect: "follow",
  });

  const html = await response.text();
  const headers = response.headers;

  const tlsResult = await runTlsCheck(targetUrl);
  const headerResult = runHeaderCheck(headers);
  const cookieResult = runCookieCheck(headers);
  const contentResult = runContentCheck(html, targetUrl);

  const allFindings: Finding[] = [
    ...tlsResult.findings,
    ...headerResult.findings,
    ...cookieResult.findings,
    ...contentResult.findings,
  ];

  const score = computeScore(allFindings);
  const status = statusFromScore(score);

  return {
    url: targetUrl,
    score,
    status,
    findings: allFindings,
    categories: {
      tls: tlsResult.categoryScore,
      headers: headerResult.categoryScore,
      cookies: cookieResult.categoryScore,
      content: contentResult.categoryScore,
    },
  };
}