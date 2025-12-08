// src/app/(dashboard)/scans/[scanId]/page.tsx
"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatusPill } from "@/components/common/StatusPill";
import { ScoreChart } from "@/components/charts/ScoreChart";
import { Button } from "@/components/ui/button";
import { Globe2, ArrowLeft } from "lucide-react";

interface CategoryScores {
  tls: number;
  headers: number;
  cookies: number;
  content: number;
}

interface Finding {
  category: string;
  name: string;
  status: "pass" | "warning" | "fail";
  severity: "Low" | "Medium" | "High";
  description: string;
  recommendation: string;
}

interface ScanDetail {
  id: string;
  score: number;
  status: "pass" | "warning" | "fail";
  categories: CategoryScores;
  findings: Finding[];
  app: {
    id?: string;
    name?: string;
    url?: string;
    environment?: string;
  };
  createdAt: string;
}

export default function ScanDetailPage() {
  const params = useParams<{ scanId: string }>();
  const router = useRouter();
  const scanId = params.scanId;

  const [scan, setScan] = useState<ScanDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadScan() {
      try {
        const res = await fetch(`/api/scans/${scanId}`);
        if (res.status === 401) {
          router.push("/login");
          return;
        }
        if (!res.ok) {
          setError("Failed to load scan details");
          return;
        }
        const data: ScanDetail = await res.json();
        setScan(data);
      } catch (err) {
        console.error(err);
        setError("Unexpected error while loading scan");
      } finally {
        setLoading(false);
      }
    }
    loadScan();
  }, [scanId, router]);

  if (loading) {
    return (
      <p className="text-xs text-[var(--color-muted-foreground)]">
        Loading scan…
      </p>
    );
  }

  if (error || !scan) {
    return (
      <p className="text-xs text-red-400">
        {error || "Scan not found"}
      </p>
    );
  }

  const { app } = scan;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Scan details"
        description={`Scan ID: ${scan.id}`}
        actions={
          <Button
            size="sm"
            variant="ghost"
            className="flex items-center gap-1.5"
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back
          </Button>
        }
      />

      {/* Top summary: app + score */}
      <section className="grid gap-4 lg:grid-cols-[minmax(0,2.2fr)_minmax(0,2fr)]">
        {/* App summary */}
        <Card className="border border-slate-800/80 bg-slate-950/80">
          <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-[var(--radius-card)] bg-[var(--color-brand-soft)]">
                <Globe2 className="h-4 w-4 text-white" />
              </div>
              <div className="min-w-0">
                <CardTitle className="text-sm font-semibold truncate max-w-[200px] sm:max-w-xs">
                  {app.name || "Unknown application"}
                </CardTitle>
                <p className="mt-0.5 text-[0.7rem] text-[var(--color-muted-foreground)] truncate max-w-[220px] sm:max-w-md">
                  {app.url || "URL not available"}
                </p>
              </div>
            </div>
            {app.environment && (
              <Badge variant="outline" className="w-fit text-[0.65rem]">
                {app.environment}
              </Badge>
            )}
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-[var(--radius-card)] bg-slate-950/80 px-3 py-2">
              <p className="text-[0.65rem] text-slate-400">Overall score</p>
              <p
                className={
                  "mt-1 text-lg font-semibold " +
                  (scan.score >= 80
                    ? "text-emerald-400"
                    : scan.score >= 60
                    ? "text-amber-300"
                    : "text-red-300")
                }
              >
                {scan.score}
              </p>
              <p className="mt-0.5 text-[0.65rem]">
                <StatusPill status={scan.status} />
              </p>
            </div>
            <div className="rounded-[var(--radius-card)] bg-slate-950/80 px-3 py-2">
              <p className="text-[0.65rem] text-slate-400">Run at</p>
              <p className="mt-1 text-[0.8rem] text-slate-200">
                {new Date(scan.createdAt).toLocaleString()}
              </p>
            </div>
            <div className="rounded-[var(--radius-card)] bg-slate-950/80 px-3 py-2">
              <p className="text-[0.65rem] text-slate-400">App ID</p>
              <p className="mt-1 text-[0.7rem] text-slate-300 truncate">
                {app.id || "N/A"}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Score donut / distribution */}
        <Card className="border border-slate-800/80 bg-slate-950/80">
          <CardHeader>
            <CardTitle className="text-xs font-medium uppercase tracking-wide text-slate-400">
              Security score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScoreChart score={scan.score} />
          </CardContent>
        </Card>
      </section>

      {/* Category scores + findings */}
      <section className="grid gap-4 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,2fr)]">
        {/* Category breakdown */}
        <Card className="border border-slate-800/80 bg-slate-950/80">
          <CardHeader>
            <CardTitle className="text-xs font-medium uppercase tracking-wide text-slate-400">
              Category breakdown
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2">
            {[
              { label: "TLS / HTTPS", key: "tls" as const },
              { label: "Security headers", key: "headers" as const },
              { label: "Cookies", key: "cookies" as const },
              { label: "Content & mixed", key: "content" as const },
            ].map((cat) => (
              <div
                key={cat.key}
                className="rounded-[var(--radius-card)] bg-slate-950/80 px-3 py-2"
              >
                <p className="text-[0.65rem] text-slate-400">{cat.label}</p>
                <p className="mt-1 text-lg font-semibold text-slate-100">
                  {scan.categories[cat.key]} / 100
                </p>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Findings list */}
        <Card className="border border-slate-800/80 bg-slate-950/80">
          <CardHeader>
            <CardTitle className="text-xs font-medium uppercase tracking-wide text-slate-400">
              Findings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {scan.findings.length === 0 ? (
              <p className="text-xs text-[var(--color-muted-foreground)]">
                No issues detected for this scan.
              </p>
            ) : (
              <div className="space-y-2">
                {scan.findings.map((f, idx) => {
                  const severityColor =
                    f.severity === "High"
                      ? "bg-red-500/10 text-red-200 border-red-500/40"
                      : f.severity === "Medium"
                      ? "bg-amber-500/10 text-amber-200 border-amber-500/40"
                      : "bg-emerald-500/10 text-emerald-200 border-emerald-500/40";

                  return (
                    <div
                      key={idx}
                      className="rounded-[var(--radius-card)] border border-slate-800/80 bg-slate-950/80 px-3 py-2.5"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div>
                          <p className="text-[0.75rem] font-semibold text-slate-100">
                            {f.name}
                          </p>
                          <p className="text-[0.65rem] text-slate-400">
                            {f.category}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span
                            className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[0.6rem] font-medium ${severityColor}`}
                          >
                            {f.severity}
                          </span>
                          <StatusPill status={f.status} />
                        </div>
                      </div>
                      <p className="mt-1.5 text-[0.7rem] text-[var(--color-muted-foreground)]">
                        {f.description}
                      </p>
                      <p className="mt-1 text-[0.7rem] text-slate-300">
                        <span className="font-medium text-slate-200">
                          Recommendation:
                        </span>{" "}
                        {f.recommendation}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}