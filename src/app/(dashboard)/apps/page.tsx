// src/app/(dashboard)/apps/page.tsx
import Link from "next/link";
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

const mockApps = [
  {
    id: "1",
    name: "Example Web",
    url: "https://example.com",
    environment: "Production",
    lastScore: 88,
    lastScanned: "2 hours ago",
  },
  {
    id: "2",
    name: "College Portal",
    url: "https://portal.college.in",
    environment: "Production",
    lastScore: 73,
    lastScanned: "1 day ago",
  },
];

export default function AppsPage() {
  const hasApps = mockApps.length > 0;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Monitored applications"
        description="Add and manage web applications that CompliScan will analyze for security and compliance."
        actions={
          <Button asChild size="sm">
            <Link href="/apps/new" className="flex items-center gap-1.5">
              <PlusCircle className="h-3.5 w-3.5" />
              Add application
            </Link>
          </Button>
        }
      />

      {!hasApps ? (
        <EmptyState
          title="No applications added yet"
          description="Start by registering a web application URL. CompliScan will analyze its HTTPS, headers, cookies and more."
          actionLabel="Add your first application"
          onAction={() => {
            // In real app, use router.push("/apps/new")
            window.location.href = "/apps/new";
          }}
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
                <TableHead className="text-right">Last score</TableHead>
                <TableHead className="text-right">Last scanned</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockApps.map((app) => (
                <TableRow
                  key={app.id}
                  className="cursor-pointer"
                  onClick={() => (window.location.href = `/apps/${app.id}`)}
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
                  <TableCell className="text-right text-xs">
                    <span
                      className={
                        app.lastScore >= 80
                          ? "text-emerald-400"
                          : app.lastScore >= 60
                          ? "text-amber-300"
                          : "text-red-300"
                      }
                    >
                      {app.lastScore}
                    </span>
                  </TableCell>
                  <TableCell className="text-right text-xs text-slate-400">
                    {app.lastScanned}
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