// src/app/(dashboard)/apps/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/common/PageHeader";
import { EmptyState } from "@/components/common/EmptyState";
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
import { Plus, Globe2 } from "lucide-react";

interface AppListItem {
  id: string;
  name: string;
  url: string;
  environment: string;
  createdAt: string;
}

export default function AppsPage() {
  const router = useRouter();
  const [apps, setApps] = useState<AppListItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadApps() {
      try {
        const res = await fetch("/api/apps");
        if (res.status === 401) {
          router.push("/login");
          return;
        }
        if (!res.ok) return;
        const data: AppListItem[] = await res.json();
        setApps(data);
      } finally {
        setLoading(false);
      }
    }
    loadApps();
  }, [router]);

  return (
    <div className="space-y-4">
      <PageHeader
        title="Applications"
        description="Manage the web applications monitored by CompliScan."
        actions={
          <Button
            size="sm"
            className="flex items-center gap-1.5"
            onClick={() => router.push("/apps/new")}
          >
            <Plus className="h-3.5 w-3.5" />
            Add application
          </Button>
        }
      />

      {/* Content card */}
      <section className="compliscan-card p-0">
        <div className="flex flex-col gap-2 border-b border-slate-900/80 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[0.7rem] font-medium uppercase tracking-wide text-slate-400">
            Monitored apps
          </p>
          <p className="text-[0.65rem] text-[var(--color-muted-foreground)]">
            {apps.length} application{apps.length !== 1 && "s"} connected to
            CompliScan.
          </p>
        </div>

        {loading ? (
          <p className="px-4 py-4 text-xs text-[var(--color-muted-foreground)]">
            Loading applications…
          </p>
        ) : apps.length === 0 ? (
          <div className="px-4 py-4">
            <EmptyState
              title="No applications yet"
              description="Start by adding a web application to monitor its security posture."
              actionLabel="Add application"
              onAction={() => router.push("/apps/new")}
            />
          </div>
        ) : (
          <div className="w-full overflow-x-auto">
            <Table className="min-w-[640px]">
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[40%]">Application</TableHead>
                  <TableHead className="hidden sm:table-cell">
                    Environment
                  </TableHead>
                  <TableHead className="hidden md:table-cell">
                    Added on
                  </TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {apps.map((app) => (
                  <TableRow
                    key={app.id}
                    className="cursor-pointer"
                    onClick={() => router.push(`/apps/${app.id}`)}
                  >
                    <TableCell className="align-middle">
                      <div className="flex items-start gap-2">
                        <div className="mt-0.5 hidden h-7 w-7 items-center justify-center rounded-[var(--radius-card)] bg-slate-900/80 sm:flex">
                          <Globe2 className="h-3.5 w-3.5 text-slate-300" />
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-[0.8rem] font-medium text-slate-100">
                            {app.name}
                          </p>
                          <p className="truncate text-[0.7rem] text-[var(--color-muted-foreground)]">
                            {app.url}
                          </p>
                          {/* Environment badge visible on mobile here */}
                          <div className="mt-1 flex items-center gap-2 sm:hidden">
                            <Badge variant="outline" className="text-[0.6rem]">
                              {app.environment}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell align-middle">
                      <Badge variant="outline" className="text-[0.65rem]">
                        {app.environment}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden align-middle text-[0.7rem] text-slate-400 md:table-cell">
                      {new Date(app.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="align-middle text-right">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-[0.7rem]"
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/apps/${app.id}`);
                        }}
                      >
                        View
                      </Button>
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