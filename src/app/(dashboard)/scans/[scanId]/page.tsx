// src/app/(dashboard)/scans/[scanId]/page.tsx
"use client";

import { useParams } from "next/navigation";
import { PageHeader } from "@/components/common/PageHeader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ScoreChart } from "@/components/charts/ScoreChart";
import { Badge } from "@/components/ui/badge";
import { StatusPill } from "@/components/common/StatusPill";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ShieldCheck, Download, Globe2 } from "lucide-react";

const mockScan = {
  id: "scan-1",
  appName: "Example Web",
  appUrl: "https://example.com",
  score: 88,
  status: "pass" as const,
  createdAt: "2 hours ago",
  environment: "Production",
  categories: {
    tls: 90,
    headers: 80,
    cookies: 85,
    content: 95,
  },
};

const mockFindings = [
  {
    id: "f1",
    category: "Headers",
    name: "strict-transport-security",
    status: "pass" as const,
    severity: "Low",
    description: "HSTS header is present with a reasonable max-age.",
    recommendation: "Consider adding includeSubDomains and preload if appropriate.",
  },
  {
    id: "f2",
    category: "Headers",
    name: "content-security-policy",
    status: "warning" as const,
    severity: "Medium",
    description: "CSP header is present but too permissive (allows unsafe-inline).",
    recommendation: "Remove unsafe-inline and define explicit script-src directives.",
  },
  {
    id: "f3",
    category: "Cookies",
    name: "session cookie security",
    status: "fail" as const,
    severity: "High",
    description: "Session cookie is missing HttpOnly flag.",
    recommendation:
      "Mark session cookies with HttpOnly and Secure flags to prevent access from client-side scripts.",
  },
];

export default function ScanDetailsPage() {
  const params = useParams();
  const scanId = params.scanId;
  const scan = mockScan; // later: fetch by scanId

  function handleDownloadReport() {
    // TODO: generate PDF or JSON
    alert(`Downloading report for scan ${scanId} (mock).`);
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Scan details · ${scan.appName}`}
        description={`Scan ID: ${scan.id} · Run ${scan.createdAt}`}
        actions={
          <Button size="sm" variant="outline" onClick={handleDownloadReport}>
            <Download className="mr-1.5 h-3.5 w-3.5" />
            Download report
          </Button>
        }
      />

      {/* Summary row */}
      <section className="grid gap-4 lg:grid-cols-[minmax(0,2.3fr)_minmax(0,2fr)]">
        <Card className="border border-slate-800/80 bg-slate-950/80">
          <CardHeader className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-[var(--radius-card)] bg-[var(--color-brand-soft)]">
                <ShieldCheck className="h-4 w-4 text-white" />
              </div>
              <div>
                <CardTitle className="text-sm font-semibold">
                  {scan.appName}
                </CardTitle>
                <CardDescription className="flex items-center gap-2">
                  <Globe2 className="h-3 w-3" />
                  <span className="truncate">{scan.appUrl}</span>
                </CardDescription>
              </div>
            </div>
            <Badge variant="outline">{scan.environment}</Badge>
          </CardHeader>
          <CardContent className="grid gap-3 md:grid-cols-3 text-xs">
            <div className="rounded-[var(--radius-card)] bg-slate-950/80 px-3 py-2">
              <p className="text-[0.65rem] text-slate-400">Overall score</p>
              <p
                className={
                  "mt-1 text-xl font-semibold " +
                  (scan.score >= 80
                    ? "text-emerald-400"
                    : scan.score >= 60
                    ? "text-amber-300"
                    : "text-red-300")
                }
              >
                {scan.score}
              </p>
              <div className="mt-1">
                <StatusPill status={scan.status} />
              </div>
            </div>
            <div className="rounded-[var(--radius-card)] bg-slate-950/80 px-3 py-2">
              <p className="text-[0.65rem] text-slate-400">Scan time</p>
              <p className="mt-1 text-[0.8rem] text-slate-200">
                {scan.createdAt}
              </p>
              <p className="mt-0.5 text-[0.65rem] text-[var(--color-muted-foreground)]">
                Single-page CompliScan run using public endpoint.
              </p>
            </div>
            <div className="rounded-[var(--radius-card)] bg-slate-950/80 px-3 py-2">
              <p className="text-[0.65rem] text-slate-400">
                Category scores
              </p>
              <div className="mt-1 grid grid-cols-2 gap-1 text-[0.65rem]">
                <CategoryChip label="TLS" value={scan.categories.tls} />
                <CategoryChip label="Headers" value={scan.categories.headers} />
                <CategoryChip label="Cookies" value={scan.categories.cookies} />
                <CategoryChip label="Content" value={scan.categories.content} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-slate-800/80 bg-slate-950/80">
          <CardHeader>
            <CardTitle className="text-xs font-medium uppercase tracking-wide text-slate-400">
              Overall posture
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScoreChart score={scan.score} />
          </CardContent>
        </Card>
      </section>

      {/* Findings table */}
      <section className="compliscan-card p-0">
        <div className="border-b border-slate-900/80 px-4 py-3 text-[0.7rem] font-medium uppercase tracking-wide text-slate-400">
          Detailed findings
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Category</TableHead>
              <TableHead>Check</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Severity</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Recommendation</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockFindings.map((f) => (
              <TableRow key={f.id}>
                <TableCell className="text-xs text-slate-300">
                  {f.category}
                </TableCell>
                <TableCell className="text-xs font-medium text-slate-100">
                  {f.name}
                </TableCell>
                <TableCell className="text-xs">
                  <StatusPill status={f.status} />
                </TableCell>
                <TableCell className="text-xs">
                  <Badge
                    variant={
                      f.severity === "High"
                        ? "danger"
                        : f.severity === "Medium"
                        ? "warning"
                        : "success"
                    }
                  >
                    {f.severity}
                  </Badge>
                </TableCell>
                <TableCell className="text-[0.7rem] text-slate-300">
                  {f.description}
                </TableCell>
                <TableCell className="text-[0.7rem] text-[var(--color-muted-foreground)]">
                  {f.recommendation}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </section>
    </div>
  );
}

function CategoryChip({ label, value }: { label: string; value: number }) {
  const color =
    value >= 80 ? "text-emerald-300" : value >= 60 ? "text-amber-200" : "text-red-200";

  return (
    <div className="flex items-center justify-between rounded-[999px] bg-slate-950/80 px-2 py-0.5">
      <span className="text-[0.65rem] text-slate-300">{label}</span>
      <span className={`text-[0.65rem] font-semibold ${color}`}>{value}</span>
    </div>
  );
}