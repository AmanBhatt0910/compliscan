// src/app/(dashboard)/apps/[appId]/page.tsx
"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
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

interface AppDetails {
  id: string;
  name: string;
  url: string;
  environment: string;
  description?: string;
  createdAt: string;
}

interface ScanHistoryItem {
  id: string;
  score: number;
  status: "pass" | "warning" | "fail";
  createdAt: string;
}

// Shape returned from /api/scans
interface ScanApiItem {
  id: string;
  appName: string;
  appUrl: string;
  score: number;
  status: "pass" | "warning" | "fail";
  createdAt: string;
}

export default function AppDetailsPage() {
  const params = useParams<{ appId: string }>();
  const router = useRouter();
  const appId = params.appId;

  const [app, setApp] = useState<AppDetails | null>(null);
  const [scans, setScans] = useState<ScanHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [scanLoading, setScanLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        // Fetch app
        const resApp = await fetch(`/api/apps/${appId}`);
        if (resApp.status === 401) {
          router.push("/login");
          return;
        }
        if (!resApp.ok) {
          setError("Failed to load application details");
          setLoading(false);
          return;
        }
        const appData: AppDetails = await resApp.json();
        setApp(appData);

        // Fetch scans for this app
        const resScans = await fetch(`/api/scans?appId=${appId}`);
        if (resScans.ok) {
          const scanData: ScanApiItem[] = await resScans.json();
          setScans(
            scanData.map((s) => ({
              id: s.id,
              score: s.score,
              status: s.status,
              createdAt: s.createdAt,
            }))
          );
        }
      } catch (err) {
        console.error(err);
        setError("Unexpected error while loading data");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [appId, router]);

  async function handleRunScan() {
    if (!app) return;
    setScanLoading(true);
    try {
      const res = await fetch("/api/scans", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ appId: app.id }),
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Failed to run scan");
        return;
      }
      // After scan, refresh scan list
      const resScans = await fetch(`/api/scans?appId=${app.id}`);
      if (resScans.ok) {
        const scanData: ScanApiItem[] = await resScans.json();
        setScans(
          scanData.map((s) => ({
            id: s.id,
            score: s.score,
            status: s.status,
            createdAt: s.createdAt,
          }))
        );
      }
    } catch (err) {
      console.error(err);
      alert("Unexpected error while running scan");
    } finally {
      setScanLoading(false);
    }
  }

  if (loading) {
    return (
      <p className="text-xs text-[var(--color-muted-foreground)]">
        Loading application…
      </p>
    );
  }

  if (error || !app) {
    return (
      <p className="text-xs text-red-400">
        {error || "Application not found"}
      </p>
    );
  }

  const latestScore = scans.length > 0 ? scans[0].score : 0;
  const riskLabel =
    latestScore >= 80 ? "Low" : latestScore >= 60 ? "Medium" : "High";

  return (
    <div className="space-y-6">
      <PageHeader
        title={app.name}
        description={app.url}
        actions={
          <Button
            size="sm"
            onClick={handleRunScan}
            loading={scanLoading}
            className="flex items-center gap-1.5"
          >
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
                <p
                  className={
                    "mt-1 text-xl font-semibold " +
                    (latestScore >= 80
                      ? "text-emerald-400"
                      : latestScore >= 60
                      ? "text-amber-300"
                      : "text-red-300")
                  }
                >
                  {scans.length > 0 ? latestScore : "—"}
                </p>
                <p className="mt-0.5 text-[0.65rem] text-emerald-300">
                  {scans.length > 0 ? `${riskLabel} risk` : "No scans yet"}
                </p>
              </div>
              <div className="rounded-[var(--radius-card)] bg-slate-950/80 px-3 py-2">
                <p className="text-[0.65rem] text-slate-400">
                  Last scanned
                </p>
                <p className="mt-1 text-[0.8rem] text-slate-200">
                  {scans.length > 0
                    ? new Date(scans[0].createdAt).toLocaleString()
                    : "No scans yet"}
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
                  {scans.length} scans
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
            <ScoreChart score={latestScore} />
          </CardContent>
        </Card>
      </section>

      {/* Scan history */}
      <section className="compliscan-card p-0">
        <div className="border-b border-slate-900/80 px-4 py-3 text-[0.7rem] font-medium uppercase tracking-wide text-slate-400">
          Scan history
        </div>
        {scans.length === 0 ? (
          <p className="px-4 py-3 text-xs text-[var(--color-muted-foreground)]">
            No scans have been run yet. Click &quot;Run new scan&quot; to start.
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Scan ID</TableHead>
                <TableHead>Score</TableHead>
                <TableHead>Risk</TableHead>
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
        )}
      </section>
    </div>
  );
}