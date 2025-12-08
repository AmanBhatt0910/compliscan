// src/app/page.tsx
import Link from "next/link";
import { ShieldHalf, ArrowRight, ScanLine } from "lucide-react";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import Image from "next/image";

export default function LandingPage() {
  return (
    <main className="flex min-h-screen flex-col bg-[var(--color-background)] text-[var(--color-foreground)]">
      <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-4 py-6 md:px-6 md:py-10">
        {/* Top nav */}
        <header className="mb-10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="flex items-center gap-2 hover:opacity-90 transition-opacity"
            >
              <div className="relative h-10 w-10 overflow-hidden rounded-[var(--radius-card)] bg-slate-900">
                <Image
                  src="/compliscan-logo.png"
                  alt="CompliScan logo"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              <div>
                <p className="text-sm font-semibold leading-none">
                  {siteConfig.name}
                </p>
                <p className="text-[0.65rem] text-[var(--color-muted-foreground)]">
                  Security Compliance Analyzer
                </p>
              </div>
            </Link>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <Link
              href="/login"
              className="rounded-[var(--radius-card)] px-3 py-1.5 text-[0.7rem] text-slate-300 hover:bg-slate-900/80"
            >
              Login
            </Link>
            <Button size="sm" variant="primary">
              <Link href="/register">Get started</Link>
            </Button>
          </div>
        </header>

        {/* Hero */}
        <section className="flex flex-1 flex-col gap-10 md:flex-row md:items-center">
          <div className="space-y-5 md:flex-1">
            <div className="inline-flex items-center gap-2 rounded-[999px] border border-slate-800/80 bg-slate-950/80 px-3 py-1 text-[0.65rem] text-slate-300">
              <ScanLine className="h-3 w-3 text-[var(--color-accent)]" />
              <span className="font-medium tracking-tight">
                CompliScan · Web Security Posture in one view
              </span>
            </div>

            <h1 className="text-3xl font-semibold leading-tight md:text-4xl">
              Scan your web apps for{" "}
              <span className="bg-gradient-to-r from-[var(--color-brand)] to-[var(--color-accent)] bg-clip-text text-transparent">
                security & compliance risks
              </span>{" "}
              in seconds.
            </h1>

            <p className="max-w-xl text-sm text-[var(--color-muted-foreground)]">
              CompliScan inspects TLS, security headers, cookies and more to
              give you a simple security score, detailed findings and a history
              of scans suitable for security audits and reports.
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <Button size="lg" variant="primary">
                <Link href="/dashboard" className="flex items-center gap-2">
                  Open CompliScan
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline">
                <Link href="/about">View project overview</Link>
              </Button>
            </div>

            <div className="mt-4 grid gap-3 text-[0.7rem] text-slate-400 md:grid-cols-3">
              <div>
                <p className="font-semibold text-slate-200">TLS & HTTPS</p>
                <p>Detect missing HTTPS, weak redirects and certificate issues.</p>
              </div>
              <div>
                <p className="font-semibold text-slate-200">Security headers</p>
                <p>HSTS, CSP, X-Frame-Options, Referrer-Policy and more.</p>
              </div>
              <div>
                <p className="font-semibold text-slate-200">Audit-friendly</p>
                <p>Scan history and scores for your reports and case studies.</p>
              </div>
            </div>
          </div>

          {/* Right: Fake dashboard preview */}
          <div className="mt-8 flex flex-1 justify-center md:mt-0">
            <div className="compliscan-gradient-border w-full max-w-md">
              <div className="compliscan-gradient-border-inner rounded-[var(--radius-card)] p-4">
                <p className="mb-3 text-[0.7rem] text-slate-400">
                  Sample CompliScan dashboard
                </p>
                <div className="grid gap-3 md:grid-cols-2">
                  <div className="rounded-[var(--radius-card)] bg-slate-950/70 p-3">
                    <p className="text-[0.7rem] text-slate-400">
                      Overall score
                    </p>
                    <p className="mt-2 text-2xl font-semibold text-emerald-400">
                      87
                    </p>
                    <p className="mt-1 text-[0.7rem] text-emerald-300">
                      Low risk
                    </p>
                  </div>
                  <div className="rounded-[var(--radius-card)] bg-slate-950/70 p-3">
                    <p className="text-[0.7rem] text-slate-400">
                      Critical findings
                    </p>
                    <p className="mt-2 text-2xl font-semibold text-red-400">
                      3
                    </p>
                    <p className="mt-1 text-[0.7rem] text-red-300">
                      Fix HSTS, CSP & cookies
                    </p>
                  </div>
                </div>
                <div className="mt-4 space-y-1 text-[0.7rem]">
                  <div className="flex items-center justify-between rounded-[var(--radius-card)] bg-slate-950/70 px-3 py-2">
                    <span className="text-slate-300">
                      content-security-policy
                    </span>
                    <span className="rounded-[999px] bg-amber-500/10 px-2 py-0.5 text-[0.65rem] text-amber-200">
                      Warning
                    </span>
                  </div>
                  <div className="flex items-center justify-between rounded-[var(--radius-card)] bg-slate-950/70 px-3 py-2">
                    <span className="text-slate-300">
                      strict-transport-security
                    </span>
                    <span className="rounded-[999px] bg-emerald-500/10 px-2 py-0.5 text-[0.65rem] text-emerald-200">
                      Pass
                    </span>
                  </div>
                  <div className="flex items-center justify-between rounded-[var(--radius-card)] bg-slate-950/70 px-3 py-2">
                    <span className="text-slate-300">x-frame-options</span>
                    <span className="rounded-[999px] bg-red-500/10 px-2 py-0.5 text-[0.65rem] text-red-200">
                      Fail
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-8 border-t border-slate-900/70 pt-4 text-[0.65rem] text-slate-500">
          Built for Security Audit & Compliance · Project: CompliScan
        </footer>
      </div>
    </main>
  );
}