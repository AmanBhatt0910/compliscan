// src/app/(dashboard)/scans/page.tsx
"use client";

import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StatusPill } from "@/components/common/StatusPill";
import { ScanLine, Filter } from "lucide-react";

const mockScans = [
  {
    id: "scan-1",
    appName: "Example Web",
    appUrl: "https://example.com",
    score: 88,
    status: "pass" as const,
    createdAt: "2 hours ago",
  },
  {
    id: "scan-2",
    appName: "College Portal",
    appUrl: "https://portal.college.in",
    score: 73,
    status: "warning" as const,
    createdAt: "1 day ago",
  },
  {
    id: "scan-3",
    appName: "Internal Dashboard",
    appUrl: "https://internal.app",
    score: 59,
    status: "fail" as const,
    createdAt: "3 days ago",
  },
];

export default function ScansPage() {
  const hasScans = mockScans.length > 0;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Scan history"
        description="View all CompliScan runs across your monitored applications."
        actions={
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Filter className="mr-1.5 h-3.5 w-3.5" />
              Filter
            </Button>
            <Button size="sm">
              <ScanLine className="mr-1.5 h-3.5 w-3.5" />
              Run scan
            </Button>
          </div>
        }
      />

      {!hasScans ? (
        <div className="rounded-[var(--radius-card)] border border-dashed border-slate-800/80 bg-slate-950/60 px-6 py-10 text-center text-xs text-[var(--color-muted-foreground)]">
          No scans have been run yet. Start by adding an application and running
          your first CompliScan.
        </div>
      ) : (
        <section className="compliscan-card p-0">
          <div className="border-b border-slate-900/80 px-4 py-3 text-[0.7rem] font-medium uppercase tracking-wide text-slate-400">
            All scans
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Scan ID</TableHead>
                <TableHead>Application</TableHead>
                <TableHead>URL</TableHead>
                <TableHead>Score</TableHead>
                <TableHead>Status</TableHead>
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
                  <TableCell className="text-xs font-medium text-slate-100">
                    {scan.appName}
                  </TableCell>
                  <TableCell className="text-xs text-slate-400">
                    {scan.appUrl}
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
                  <TableCell className="text-right text-xs text-slate-400">
                    {scan.createdAt}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </section>
      )}
    </div>
  );
}