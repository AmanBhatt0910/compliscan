// src/app/(dashboard)/scans/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/common/PageHeader";
import { EmptyState } from "@/components/common/EmptyState";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StatusPill } from "@/components/common/StatusPill";
import { Badge } from "@/components/ui/badge";
import type { ScanListItem } from "@/types/api";

export default function ScansPage() {
  const router = useRouter();
  const [scans, setScans] = useState<ScanListItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadScans() {
      try {
        const res = await fetch("/api/scans");
        if (res.status === 401) {
          router.push("/login");
          return;
        }
        if (!res.ok) return;
        const data: ScanListItem[] = await res.json();
        setScans(data);
      } finally {
        setLoading(false);
      }
    }
    loadScans();
  }, [router]);

  return (
    <div className="space-y-4">
      <PageHeader
        title="Scans"
        description="View all security scans run across your monitored applications."
      />

      <section className="compliscan-card p-0">
        <div className="flex flex-col gap-2 border-b border-slate-900/80 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[0.7rem] font-medium uppercase tracking-wide text-slate-400">
            Scan activity
          </p>
          <p className="text-[0.65rem] text-[var(--color-muted-foreground)]">
            {scans.length} scan{scans.length !== 1 && "s"} recorded.
          </p>
        </div>

        {loading ? (
          <p className="px-4 py-4 text-xs text-[var(--color-muted-foreground)]">
            Loading scans…
          </p>
        ) : scans.length === 0 ? (
          <div className="px-4 py-4">
            <EmptyState
              title="No scans yet"
              description="Run a scan from an application&apos;s details page to see activity here."
            />
          </div>
        ) : (
          <div className="w-full overflow-x-auto">
            <Table className="min-w-[720px]">
              <TableHeader>
                <TableRow>
                  <TableHead>Application</TableHead>
                  <TableHead className="hidden sm:table-cell">
                    URL
                  </TableHead>
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
                    <TableCell className="align-middle">
                      <p className="truncate text-[0.8rem] font-medium text-slate-100">
                        {scan.appName || "Unknown"}
                      </p>
                      <p className="truncate text-[0.7rem] text-[var(--color-muted-foreground)] sm:hidden">
                        {scan.appUrl}
                      </p>
                    </TableCell>
                    <TableCell className="hidden align-middle text-[0.7rem] text-[var(--color-muted-foreground)] sm:table-cell">
                      <span className="block max-w-[220px] truncate">
                        {scan.appUrl}
                      </span>
                    </TableCell>
                    <TableCell className="align-middle text-xs">
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
                    <TableCell className="align-middle">
                      <StatusPill status={scan.status} />
                    </TableCell>
                    <TableCell className="align-middle text-right text-[0.7rem] text-slate-400">
                      {new Date(scan.createdAt).toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </section>
    </div>
  );
}