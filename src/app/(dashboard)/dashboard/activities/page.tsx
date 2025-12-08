// src/app/(dashboard)/dashboard/activities/page.tsx
import { redirect } from "next/navigation";
import { PageHeader } from "@/components/common/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatusPill } from "@/components/common/StatusPill";
import { getCurrentUser } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { App } from "@/lib/models/App";
import { Scan } from "@/lib/models/Scan";
import { Activity, Globe2, ScanLine } from "lucide-react";

type FindingStatus = "pass" | "warning" | "fail";

interface AppDoc {
  _id: string;
  name: string;
  url: string;
  createdAt: Date;
}

interface ScanDoc {
  _id: string;
  app?: {
    name?: string;
    url?: string;
  };
  score: number;
  status: FindingStatus;
  createdAt: Date;
}

type ActivityType = "app_created" | "scan_run";

interface ActivityItem {
  type: ActivityType;
  title: string;
  description: string;
  createdAt: Date;
  meta?: {
    score?: number;
    status?: FindingStatus;
  };
}

export default async function ActivitiesPage() {
  // 🔐 Protect route
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  await connectDB();

  // Fetch recent apps and scans for this user
  const [apps, scans] = await Promise.all([
    App.find({ owner: user.id })
      .sort({ createdAt: -1 })
      .limit(20)
      .lean() as Promise<AppDoc[]>,
    Scan.find({ runBy: user.id })
      .sort({ createdAt: -1 })
      .limit(20)
      .populate("app", "name url")
      .lean() as Promise<ScanDoc[]>,
  ]);

  const appActivities: ActivityItem[] = apps.map((app) => ({
    type: "app_created",
    title: `Application registered: ${app.name}`,
    description: app.url,
    createdAt: app.createdAt,
  }));

  const scanActivities: ActivityItem[] = scans.map((scan) => ({
    type: "scan_run",
    title: `Scan run on ${scan.app?.name ?? "Unknown application"}`,
    description: scan.app?.url ?? "URL not available",
    createdAt: scan.createdAt,
    meta: {
      score: scan.score,
      status: scan.status,
    },
  }));

  // Merge and sort by time (desc)
  const activities = [...appActivities, ...scanActivities].sort(
    (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Activity log"
        description="Track recent changes, scans, and updates across your CompliScan workspace."
      />

      <Card className="border border-slate-800/80 bg-slate-950/80">
        <CardContent className="pt-4">
          {activities.length === 0 ? (
            <p className="text-xs text-[var(--color-muted-foreground)]">
              No activity recorded yet. Add an application and run a scan to see
              activity here.
            </p>
          ) : (
            <ul className="space-y-3">
              {activities.map((item, index) => (
                <ActivityRow key={index} item={item} />
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function ActivityRow({ item }: { item: ActivityItem }) {
  const isScan = item.type === "scan_run";

  const iconBg =
    item.type === "scan_run"
      ? "bg-[var(--color-brand-soft)]"
      : "bg-slate-800/80";

  const Icon = isScan ? ScanLine : Globe2;

  return (
    <li className="flex gap-3">
      {/* Timeline marker */}
      <div className="relative flex flex-col items-center">
        <div
          className={`flex h-7 w-7 items-center justify-center rounded-full ${iconBg}`}
        >
          <Icon className="h-3.5 w-3.5 text-white" />
        </div>
        <div className="mt-1 h-full w-px flex-1 bg-slate-800/70 last:hidden" />
      </div>

      {/* Content */}
      <div className="flex-1 rounded-[var(--radius-card)] bg-slate-950/70 px-3 py-2.5">
        <div className="flex items-center justify-between gap-2">
          <p className="text-[0.75rem] font-semibold text-slate-100">
            {item.title}
          </p>
          <span className="text-[0.6rem] text-[var(--color-muted-foreground)]">
            {item.createdAt.toLocaleString()}
          </span>
        </div>
        <div className="mt-1 flex flex-wrap items-center gap-2">
          <p className="text-[0.7rem] text-[var(--color-muted-foreground)]">
            {item.description}
          </p>
          {item.type === "scan_run" && item.meta && (
            <div className="ml-auto flex items-center gap-2">
              {typeof item.meta.score === "number" && (
                <Badge variant="outline" className="text-[0.65rem]">
                  Score:{" "}
                  <span
                    className={
                      item.meta.score >= 80
                        ? "ml-1 text-emerald-300"
                        : item.meta.score >= 60
                        ? "ml-1 text-amber-300"
                        : "ml-1 text-red-300"
                    }
                  >
                    {item.meta.score}
                  </span>
                </Badge>
              )}
              {item.meta.status && (
                <StatusPill status={item.meta.status} />
              )}
            </div>
          )}
        </div>
      </div>
    </li>
  );
}