// src/app/(dashboard)/apps/[appId]/page.tsx
"use client";

import { useParams } from "next/navigation";
import { PageHeader } from "@/components/common/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { StatusPill } from "@/components/common/StatusPill";
import { ScoreChart } from "@/components/charts/ScoreChart";
import { Globe2, ScanLine } from "lucide-react";

const mockApp = {
  id: "1",
  name: "Example Web",
  url: "https://example.com",
  environment: "Production",
  description: "Public marketing site used in demos.",
  latestScore: 88,
  riskLevel: "Low",
};

const mockScans = [
  {
    id: "scan-1",
    score: 88,
    riskLevel: "Low",
    createdAt: "2 hours ago",
    findingsSummary: "1 warning, 0 fails",
    status: "pass" as const,
  },
  {
    id: "scan-2",
    score: 79,
    riskLevel: "Medium",
    createdAt: "1 day ago",
    findingsSummary: "2 warnings, 1 fail",
    status: "warning" as const,
  },
  {
    id: "scan-3",
    score: 61,
    riskLevel: "Medium",
    createdAt: "3 days ago",
    findingsSummary: "3 warnings, 2 fails",
    status: "fail" as const,
  },
];

export default function AppDetailsPage() {
  const params = useParams();
  const appId = params.appId;

  const app = mockApp; // later: fetch by appId

  function handleRunScan() {
    // TODO: call /api/scans with appId and then redirect to scan page
    alert(`Triggering scan for app ${appId} (mock).`);
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={app.name}
        description={app.url}
        actions={
          <Button size="sm" onClick={handleRunScan} className="flex items-center gap-1.5">
            <ScanLine className="h-3.5 w-3.5" />
            Run new scan
          </Button>
        }
      />

      {/* App summary row */}
      <section className="grid gap-4 lg:grid-cols-[minmax(0,2.2fr)_minmax(0,2fr)]">
        <Card className="border border-slate-800/80 bg-slate-950/80">
          <CardHeader className="flex flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-[var(--radius-card)] bg-[var(--color-brand-soft)]">
                <Globe2 className="h-4 w-4 text-white" />
              </div>
              <div>
                <CardTitle className="text-sm font-semibold">
                  {app.name}
                </CardTitle>
                <p className="text-[0.7rem] text-[var(--color-muted-foreground)]">
                  {app.url}
                </p>
              </div>
            </div>
            <Badge variant="outline">{app.environment}</Badge>
          </CardHeader>
          <CardContent className="space-y-3 text-xs">
            <div>
              <p className="text-[0.7rem] font-medium text-slate-300">
                Description
              </p>
              <p className="mt-1 text-[0.7rem] text-[var(--color-muted-foreground)]">
                {app.description || "No description provided."}
              </p>
            </div>

            <div className="grid gap-3 md:grid-cols-3">
              <div className="rounded-[var(--radius-card)] bg-slate-950/80 px-3 py-2">
                <p className="text-[0.65rem] text-slate-400">Latest score</p>
                <p className="mt-1 text-xl font-semibold text-emerald-400">
                  {app.latestScore}
                </p>
                <p className="mt-0.5 text-[0.65rem] text-emerald-300">
                  {app.riskLevel} risk
                </p>
              </div>
              <div className="rounded-[var(--radius-card)] bg-slate-950/80 px-3 py-2">
                <p className="text-[0.65rem] text-slate-400">
                  Last scanned
                </p>
                <p className="mt-1 text-[0.8rem] text-slate-200">
                  2 hours ago
                </p>
                <p className="mt-0.5 text-[0.65rem] text-[var(--color-muted-foreground)]">
                  Based on the latest CompliScan run
                </p>
              </div>
              <div className="rounded-[var(--radius-card)] bg-slate-950/80 px-3 py-2">
                <p className="text-[0.65rem] text-slate-400">
                  Scan history
                </p>
                <p className="mt-1 text-[0.8rem] text-slate-200">
                  {mockScans.length} scans
                </p>
                <p className="mt-0.5 text-[0.65rem] text-[var(--color-muted-foreground)]">
                  View detailed findings for each run.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-slate-800/80 bg-slate-950/80">
          <CardHeader>
            <CardTitle className="text-xs font-medium uppercase tracking-wide text-slate-400">
              Posture for this application
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScoreChart score={app.latestScore} />
          </CardContent>
        </Card>
      </section>

      {/* Scan history */}
      <section className="compliscan-card p-0">
        <div className="border-b border-slate-900/80 px-4 py-3 text-[0.7rem] font-medium uppercase tracking-wide text-slate-400">
          Scan history
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Scan ID</TableHead>
              <TableHead>Score</TableHead>
              <TableHead>Risk</TableHead>
              <TableHead>Summary</TableHead>
              <TableHead className="text-right">Run at</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockScans.map((scan) => (
              <TableRow
                key={scan.id}
                className="cursor-pointer"
                onClick={() => (window.location.href = `/scans/${scan.id}`)}
              >
                <TableCell className="text-xs text-slate-300">
                  {scan.id}
                </TableCell>
                <TableCell className="text-xs">
                  <span
                    className={
                      scan.score >= 80
                        ? "text-emerald-400"
                        : scan.score >= 60
                        ? "text-amber-300"
                        : "text-red-300"
                    }
                  >
                    {scan.score}
                  </span>
                </TableCell>
                <TableCell className="text-xs">
                  <StatusPill status={scan.status} />
                </TableCell>
                <TableCell className="text-xs text-slate-300">
                  {scan.findingsSummary}
                </TableCell>
                <TableCell className="text-right text-xs text-slate-400">
                  {scan.createdAt}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </section>
    </div>
  );
}