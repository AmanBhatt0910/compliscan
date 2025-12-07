// src/app/(dashboard)/apps/page.tsx
"use client";

import Link from "next/link";
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
import { Globe2, PlusCircle } from "lucide-react";

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
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchApps() {
      try {
        const res = await fetch("/api/apps");
        if (res.status === 401) {
          router.push("/login");
          return;
        }
        const data = await res.json();
        setApps(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load applications");
      } finally {
        setLoading(false);
      }
    }
    fetchApps();
  }, [router]);

  const hasApps = apps.length > 0;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Monitored applications"
        description="Add and manage web applications that CompliScan will analyze for security and compliance."
        actions={
          <Button size="sm">
            <Link href="/apps/new" className="flex items-center gap-1.5">
              <PlusCircle className="h-3.5 w-3.5" />
              Add application
            </Link>
          </Button>
        }
      />

      {loading ? (
        <p className="text-xs text-[var(--color-muted-foreground)]">
          Loading applications...
        </p>
      ) : error ? (
        <p className="text-xs text-red-400">{error}</p>
      ) : !hasApps ? (
        <EmptyState
          title="No applications added yet"
          description="Start by registering a web application URL. CompliScan will analyze its HTTPS, headers, cookies and more."
          actionLabel="Add your first application"
          onAction={() => router.push("/apps/new")}
          icon={<Globe2 className="h-6 w-6" />}
        />
      ) : (
        <section className="compliscan-card p-0">
          <div className="border-b border-slate-900/80 px-4 py-3 text-[0.7rem] font-medium uppercase tracking-wide text-slate-400">
            Applications
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Application</TableHead>
                <TableHead>URL</TableHead>
                <TableHead>Environment</TableHead>
                <TableHead className="text-right">Created</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {apps.map((app) => (
                <TableRow
                  key={app.id}
                  className="cursor-pointer"
                  onClick={() => router.push(`/apps/${app.id}`)}
                >
                  <TableCell className="text-xs font-medium text-slate-100">
                    {app.name}
                  </TableCell>
                  <TableCell className="text-xs text-slate-400">
                    {app.url}
                  </TableCell>
                  <TableCell className="text-xs">
                    <span className="inline-flex rounded-[999px] bg-slate-900/90 px-2 py-0.5 text-[0.65rem] text-slate-300">
                      {app.environment}
                    </span>
                  </TableCell>
                  <TableCell className="text-right text-xs text-slate-400">
                    {new Date(app.createdAt).toLocaleString()}
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