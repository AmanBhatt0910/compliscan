// src/app/(auth)/register/page.tsx
"use client";

import Link from "next/link";
import { useState, FormEvent } from "react";
import { ShieldHalf, UserPlus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to create account");
        return;
      }

      // Cookie set by API; redirect to dashboard
      window.location.href = "/dashboard";
    } catch (err) {
      console.error(err);
      setError("Unexpected error while creating account");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[var(--color-background)] px-4">
      <div className="w-full max-w-md">
        <div className="mb-6 flex items-center justify-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-[var(--radius-card)] bg-[var(--color-brand-soft)] shadow-lg">
            <ShieldHalf className="h-4 w-4 text-white" />
          </div>
          <div className="text-center">
            <p className="text-sm font-semibold leading-none">CompliScan</p>
            <p className="text-[0.65rem] text-[var(--color-muted-foreground)]">
              Security Compliance Analyzer
            </p>
          </div>
        </div>

        <div className="compliscan-card bg-slate-950/80 px-5 py-6">
          <div className="mb-4">
            <h1 className="flex items-center gap-2 text-sm font-semibold">
              <UserPlus className="h-3.5 w-3.5 text-[var(--color-brand)]" />
              Create a CompliScan account
            </h1>
            <p className="mt-1 text-[0.7rem] text-[var(--color-muted-foreground)]">
              Set up your workspace to monitor web applications and scan results.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3 text-xs">
            <div className="space-y-1">
              <label className="text-[0.7rem] font-medium text-slate-200">
                Full name
              </label>
              <Input
                placeholder="Your name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <label className="text-[0.7rem] font-medium text-slate-200">
                Email
              </label>
              <Input
                type="email"
                placeholder="you@example.com"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <label className="text-[0.7rem] font-medium text-slate-200">
                Password
              </label>
              <Input
                type="password"
                placeholder="••••••••"
                required
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <p className="text-[0.65rem] text-[var(--color-muted-foreground)]">
                Use at least 8 characters, including a mix of letters, numbers,
                and symbols — CompliScan is about good security habits too.
              </p>
            </div>

            {error && (
              <p className="text-[0.7rem] text-red-400">{error}</p>
            )}

            <Button
              type="submit"
              loading={loading}
              className="mt-2 w-full"
              size="md"
            >
              Create account
            </Button>
          </form>

          <p className="mt-4 text-center text-[0.7rem] text-[var(--color-muted-foreground)]">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-medium text-[var(--color-brand)] hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>

        <p className="mt-4 text-center text-[0.65rem] text-slate-500">
          CompliScan is a student project for Security Audit &amp; Compliance.
        </p>
      </div>
    </main>
  );
}