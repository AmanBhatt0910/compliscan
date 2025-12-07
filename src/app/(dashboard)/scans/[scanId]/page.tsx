// src/app/(dashboard)/scans/[scanId]/page.tsx
"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
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

type FindingStatus = "pass" | "warning" | "fail";
type Severity = "Low" | "Medium" | "High";

interface Finding {
  category: string;
  name: string;
  status: FindingStatus;
  severity: Severity;
  description: string;
  recommendation: string;
}

interface ScanDetails {
  id: string;
  score: number;
  status: FindingStatus;
  categories: {
    tls: number;
    headers: number;
    cookies: number;
    content: number;
  };
  app: {
    id?: string;
    name?: string;
    url?: string;
    environment?: string;
  };
  findings: Finding[];
  createdAt: string;
}

export default function ScanDetailsPage() {
  const params = useParams<{ scanId: string }>();
  const router = useRouter();
  const scanId = params.scanId;

  const [scan, setScan] = useState<ScanDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchScan() {
      try {
        const res = await fetch(`/api/scans/${scanId}`);
        if (res.status === 401) {
          router.push("/login");
          return;
        }
        const data = await res.json();
        if (!res.ok) {
          setError(data.error || "Failed to load scan");
          setLoading(false);
          return;
        }
        setScan(data);
      } catch (err) {
        console.error(err);
        setError("Unexpected error while loading scan");
      } finally {
        setLoading(false);
      }
    }
    fetchScan();
  }, [scanId, router]);

  function handleDownloadReport() {
    // later: generate PDF; for now, just log JSON
    if (!scan) return;
    console.log("Scan report:", scan);
    alert("Report generation can be implemented here (PDF/JSON).");
  }

  if (loading) {
    return (
      <p className="text-xs text-[var(--color-muted-foreground)]">
        Loading scan…
      </p>
    );
  }

  if (error || !scan) {
    return (
      <p className="text-xs text-red-400">{error || "Scan not found"}</p>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Scan details · ${scan.app.name ?? "Unknown app"}`}
        description={`Scan ID: ${scan.id} · Run ${new Date(
          scan.createdAt
        ).toLocaleString()}`}
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
                  {scan.app.name ?? "Unknown application"}
                </CardTitle>
                <CardDescription className="flex items-center gap-2">
                  <Globe2 className="h-3 w-3" />
                  <span className="truncate">
                    {scan.app.url ?? "URL not available"}
                  </span>
                </CardDescription>
              </div>
            </div>
            {scan.app.environment && (
              <Badge variant="outline">{scan.app.environment}</Badge>
            )}
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
                {new Date(scan.createdAt).toLocaleString()}
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
                <CategoryChip
                  label="Headers"
                  value={scan.categories.headers}
                />
                <CategoryChip
                  label="Cookies"
                  value={scan.categories.cookies}
                />
                <CategoryChip
                  label="Content"
                  value={scan.categories.content}
                />
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
        {scan.findings.length === 0 ? (
          <p className="px-4 py-3 text-xs text-[var(--color-muted-foreground)]">
            No findings were recorded for this scan.
          </p>
        ) : (
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
              {scan.findings.map((f, idx) => (
                <TableRow key={`${f.name}-${idx}`}>
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
        )}
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