// src/app/(marketing)/about/page.tsx
import { ShieldHalf, ListChecks, ScanLine, Globe2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function AboutPage() {
  return (
    <main className="flex min-h-screen flex-col bg-[var(--color-background)] text-[var(--color-foreground)]">
      <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col px-4 py-6 md:px-6 md:py-10">
        <header className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-[var(--radius-card)] bg-[var(--color-brand-soft)]">
              <ShieldHalf className="h-4 w-4 text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold leading-none">
                CompliScan
              </p>
              <p className="text-[0.65rem] text-[var(--color-muted-foreground)]">
                Security Compliance Analyzer
              </p>
            </div>
          </div>
          <Button asChild size="sm" variant="outline">
            <Link href="/">Back to home</Link>
          </Button>
        </header>

        <section className="space-y-6">
          <div>
            <h1 className="text-2xl font-semibold md:text-3xl">
              About CompliScan
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-[var(--color-muted-foreground)]">
              CompliScan is a web-based tool built as a project for the{" "}
              <span className="font-semibold">
                Security Audit and Compliance
              </span>{" "}
              subject. It helps security auditors and developers quickly assess
              the security posture of web applications by running automated
              checks on a given URL.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <AboutCard
              icon={<Globe2 className="h-4 w-4" />}
              title="Scope"
              description="CompliScan focuses on externally visible security controls like TLS configuration, HTTP security headers, cookie security and content-level checks."
            />
            <AboutCard
              icon={<ScanLine className="h-4 w-4" />}
              title="Core features"
              description="Register applications, run scans, view scores, analyze detailed findings and maintain a history of scans for audit reporting."
            />
            <AboutCard
              icon={<ListChecks className="h-4 w-4" />}
              title="Compliance angle"
              description="Maps technical checks to security best practices and supports auditability via logs, scores and historical reports."
            />
          </div>

          <section className="compliscan-card border border-slate-800/80 bg-slate-950/80 px-5 py-4 text-xs">
            <h2 className="mb-2 text-sm font-semibold text-slate-100">
              What CompliScan checks (high level)
            </h2>
            <div className="grid gap-3 md:grid-cols-2">
              <ul className="space-y-1 list-disc pl-4 text-[0.7rem] text-[var(--color-muted-foreground)]">
                <li>
                  <span className="font-medium text-slate-200">
                    HTTPS & TLS:
                  </span>{" "}
                  whether the URL uses HTTPS and how it redirects from HTTP.
                </li>
                <li>
                  <span className="font-medium text-slate-200">
                    Security headers:
                  </span>{" "}
                  presence and basic validation of headers like
                  <code className="mx-1 rounded bg-slate-900 px-1">
                    strict-transport-security
                  </code>
                  ,
                  <code className="mx-1 rounded bg-slate-900 px-1">
                    content-security-policy
                  </code>
                  ,
                  <code className="mx-1 rounded bg-slate-900 px-1">
                    x-frame-options
                  </code>{" "}
                  and more.
                </li>
                <li>
                  <span className="font-medium text-slate-200">
                    Cookie security:
                  </span>{" "}
                  whether cookies use <code>Secure</code>, <code>HttpOnly</code>{" "}
                  and <code>SameSite</code> flags where appropriate.
                </li>
              </ul>
              <ul className="space-y-1 list-disc pl-4 text-[0.7rem] text-[var(--color-muted-foreground)]">
                <li>
                  <span className="font-medium text-slate-200">
                    Information leakage:
                  </span>{" "}
                  server banners, X-Powered-By headers and verbose error
                  messages revealing internal details.
                </li>
                <li>
                  <span className="font-medium text-slate-200">
                    Content & forms:
                  </span>{" "}
                  mixed content (HTTPS pages loading HTTP resources) and forms
                  posting over insecure protocols.
                </li>
                <li>
                  <span className="font-medium text-slate-200">
                    Scoring & reports:
                  </span>{" "}
                  overall security score plus category-wise scores, suitable for
                  including in security audit documentation.
                </li>
              </ul>
            </div>
          </section>

          <section className="compliscan-card border border-slate-800/80 bg-slate-950/80 px-5 py-4 text-xs">
            <h2 className="mb-2 text-sm font-semibold text-slate-100">
              Project modules (for evaluation)
            </h2>
            <ul className="space-y-1 list-disc pl-4 text-[0.7rem] text-[var(--color-muted-foreground)]">
              <li>
                <span className="font-medium text-slate-200">
                  User & workspace module:
                </span>{" "}
                login, registration and basic role separation (user / admin).
              </li>
              <li>
                <span className="font-medium text-slate-200">
                  Application registry:
                </span>{" "}
                add, edit, delete monitored web applications (URL + metadata).
              </li>
              <li>
                <span className="font-medium text-slate-200">
                  Scan engine:
                </span>{" "}
                backend logic to fetch the URL, inspect headers/body and
                generate findings.
              </li>
              <li>
                <span className="font-medium text-slate-200">
                  Reporting & history:
                </span>{" "}
                dashboards, scan history pages and detailed scan reports that
                can be used in audit/compliance documentation.
              </li>
            </ul>
          </section>

          <div className="mt-2 flex flex-wrap items-center justify-between gap-3 text-[0.7rem] text-[var(--color-muted-foreground)]">
            <p>
              <span className="font-medium text-slate-200">Tech stack:</span>{" "}
              Next.js (App Router), Tailwind CSS (dark theme), Framer Motion,
              MongoDB, TypeScript.
            </p>
            <Button asChild size="sm">
              <Link href="/dashboard">Open CompliScan dashboard</Link>
            </Button>
          </div>
        </section>
      </div>
    </main>
  );
}

function AboutCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-[var(--radius-card)] border border-slate-800/80 bg-slate-950/80 p-4 text-xs">
      <div className="mb-2 flex items-center gap-2">
        <div className="flex h-7 w-7 items-center justify-center rounded-[var(--radius-card)] bg-[var(--color-brand-soft)]/60">
          {icon}
        </div>
        <h3 className="text-[0.8rem] font-semibold text-slate-100">
          {title}
        </h3>
      </div>
      <p className="text-[0.7rem] text-[var(--color-muted-foreground)]">
        {description}
      </p>
    </div>
  );
}