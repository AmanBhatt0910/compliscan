// src/app/(dashboard)/dashboard/page.tsx
import { redirect } from "next/navigation";
import { PageHeader } from "@/components/common/PageHeader";
import { StatCard } from "@/components/common/StatCard";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScoreChart } from "@/components/charts/ScoreChart";
import { Globe2, ShieldCheck, Bug, ScanLine } from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { App } from "@/lib/models/App";
import { Scan } from "@/lib/models/Scan";

type FindingStatus = "pass" | "warning" | "fail";
type Severity = "Low" | "Medium" | "High";

interface DashboardFindingRow {
  label: string; // app name
  issue: string; // description / check
  severity: Severity;
}

// Shape of populated scans we care about
interface ScanWithAppAndFindings {
  app?: {
    name?: string;
    url?: string;
  };
  score: number;
  status: FindingStatus;
  createdAt: Date;
  findings: {
    category: string;
    name: string;
    status: FindingStatus;
    severity: Severity;
    description: string;
    recommendation: string;
  }[];
}

export default async function DashboardPage() {
  // Secure the route
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  await connectDB();

  // 1) Basic counts
  const [totalApps, scansForUser] = await Promise.all([
    App.countDocuments({ owner: user.id }),
    Scan.find({ runBy: user.id }).select("score status app createdAt findings").lean(),
  ]);

  const totalScans = scansForUser.length;

  // 2) Average score
  let avgScore = 0;
  if (totalScans > 0) {
    const sum = scansForUser.reduce(
      (acc, s: ScanWithAppAndFindings) => acc + (s.score ?? 0),
      0
    );
    avgScore = Math.round(sum / totalScans);
  }

  // 3) High-risk apps = distinct apps with at least one failing scan
  const highRiskAppIds = await Scan.distinct("app", {
    runBy: user.id,
    status: "fail",
  });
  const highRiskApps = highRiskAppIds.length;

  // 4) Latest findings: look at most recent scans (with app populated)
  const recentScansDocs = (await Scan.find({ runBy: user.id })
    .sort({ createdAt: -1 })
    .limit(5)
    .populate("app", "name url")
    .lean()) as ScanWithAppAndFindings[];

  const latestFindings: DashboardFindingRow[] = [];

  for (const scan of recentScansDocs) {
    const appName = scan.app?.name ?? "Unknown application";

    for (const f of scan.findings) {
      if (f.status === "pass") continue;

      latestFindings.push({
        label: appName,
        issue: f.description || f.name,
        severity: f.severity,
      });

      if (latestFindings.length >= 4) break;
    }
    if (latestFindings.length >= 4) break;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="CompliScan Overview"
        description="Monitor the security and compliance posture of your web applications at a glance."
      />

      {/* Stats */}
      <section className="grid gap-4 md:grid-cols-4">
        <StatCard
          label="Monitored apps"
          value={totalApps}
          icon={<Globe2 className="h-4 w-4" />}
          trend={totalApps > 0 ? "Active coverage" : "Add your first app"}
        />
        <StatCard
          label="Scans run"
          value={totalScans}
          icon={<ScanLine className="h-4 w-4" />}
          trend={totalScans > 0 ? "Historical data available" : "Run your first scan"}
        />
        <StatCard
          label="High-risk apps"
          value={highRiskApps}
          icon={<Bug className="h-4 w-4 text-red-400" />}
          trend={
            highRiskApps > 0 ? "Needs attention" : "No high-risk apps detected"
          }
          className={highRiskApps > 0 ? "border-red-500/40" : undefined}
        />
        <StatCard
          label="Average score"
          value={avgScore}
          icon={<ShieldCheck className="h-4 w-4 text-emerald-400" />}
          trend={totalScans > 0 ? "Based on recent scans" : "No data yet"}
        />
      </section>

      {/* Middle row: Score chart + quick summary */}
      <section className="grid gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
        <Card className="flex flex-col items-center justify-center border border-slate-800/80 bg-slate-950/70">
          <CardHeader className="w-full text-center">
            <CardTitle className="text-xs font-medium uppercase tracking-wide text-slate-400">
              Current environment posture
            </CardTitle>
          </CardHeader>
          <CardContent className="w-full flex-1">
            <ScoreChart score={avgScore} />
          </CardContent>
        </Card>

        <Card className="border border-slate-800/80 bg-slate-950/70">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-slate-400">
              Latest findings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-xs">
            {latestFindings.length === 0 ? (
              <p className="text-[0.7rem] text-[var(--color-muted-foreground)]">
                No recent issues detected. Run scans on your applications to view
                security findings here.
              </p>
            ) : (
              latestFindings.map((f, idx) => (
                <FindingRow
                  key={`${f.label}-${idx}`}
                  label={f.label}
                  issue={f.issue}
                  severity={f.severity}
                />
              ))
            )}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

function FindingRow({
  label,
  issue,
  severity,
}: {
  label: string;
  issue: string;
  severity: Severity;
}) {
  const severityClasses =
    severity === "High"
      ? "bg-red-500/10 text-red-200 border-red-500/40"
      : severity === "Medium"
      ? "bg-amber-500/10 text-amber-200 border-amber-500/40"
      : "bg-emerald-500/10 text-emerald-200 border-emerald-500/40";

  return (
    <div className="flex items-center justify-between rounded-[var(--radius-card)] bg-slate-950/60 px-3 py-2">
      <div>
        <p className="text-[0.7rem] font-medium text-slate-200">{label}</p>
        <p className="text-[0.65rem] text-[var(--color-muted-foreground)]">
          {issue}
        </p>
      </div>
      <span
        className={`inline-flex items-center rounded-[999px] border px-2 py-0.5 text-[0.6rem] font-medium ${severityClasses}`}
      >
        {severity}
      </span>
    </div>
  );
}