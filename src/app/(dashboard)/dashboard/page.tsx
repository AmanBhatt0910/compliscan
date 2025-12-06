// src/app/(dashboard)/dashboard/page.tsx
import { PageHeader } from "@/components/common/PageHeader";
import { StatCard } from "@/components/common/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScoreChart } from "@/components/charts/ScoreChart";
import { Globe2, ShieldCheck, Bug, ScanLine } from "lucide-react";

export default function DashboardPage() {
  // later these will come from API
  const totalApps = 4;
  const totalScans = 23;
  const highRiskApps = 1;
  const avgScore = 82;

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
          trend="+1 this week"
        />
        <StatCard
          label="Scans run"
          value={totalScans}
          icon={<ScanLine className="h-4 w-4" />}
          trend="+6 in last 7 days"
        />
        <StatCard
          label="High-risk apps"
          value={highRiskApps}
          icon={<Bug className="h-4 w-4 text-red-400" />}
          trend="Needs attention"
          className="border-red-500/40"
        />
        <StatCard
          label="Average score"
          value={avgScore}
          icon={<ShieldCheck className="h-4 w-4 text-emerald-400" />}
          trend="Stable"
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
            <FindingRow
              label="example.com"
              issue="Missing Content-Security-Policy"
              severity="High"
            />
            <FindingRow
              label="internal.app"
              issue="Cookies not marked HttpOnly"
              severity="Medium"
            />
            <FindingRow
              label="portal.college.in"
              issue="No HSTS configured"
              severity="High"
            />
            <FindingRow
              label="demo.scan"
              issue="Mixed content detected"
              severity="Medium"
            />
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
  severity: "Low" | "Medium" | "High";
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