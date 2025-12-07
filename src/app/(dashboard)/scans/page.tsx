// src/app/(dashboard)/scans/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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

interface ScanListItem {
  id: string;
  appName: string;
  appUrl: string;
  score: number;
  status: "pass" | "warning" | "fail";
  createdAt: string;
}

export default function ScansPage() {
  const router = useRouter();
  const [scans, setScans] = useState<ScanListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchScans() {
      try {
        const res = await fetch("/api/scans");
        if (res.status === 401) {
          router.push("/login");
          return;
        }
        const data = await res.json();
        setScans(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load scans");
      } finally {
        setLoading(false);
      }
    }
    fetchScans();
  }, [router]);

  const hasScans = scans.length > 0;

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
            <Button size="sm" onClick={() => router.push("/apps")}>
              <ScanLine className="mr-1.5 h-3.5 w-3.5" />
              Run scan
            </Button>
          </div>
        }
      />

      {loading ? (
        <p className="text-xs text-[var(--color-muted-foreground)]">
          Loading scans...
        </p>
      ) : error ? (
        <p className="text-xs text-red-400">{error}</p>
      ) : !hasScans ? (
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
              {scans.map((scan) => (
                <TableRow
                  key={scan.id}
                  className="cursor-pointer"
                  onClick={() => router.push(`/scans/${scan.id}`)}
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
                    {new Date(scan.createdAt).toLocaleString()}
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