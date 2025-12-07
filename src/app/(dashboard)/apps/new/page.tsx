// src/app/(dashboard)/apps/new/page.tsx
"use client";

import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/common/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { AppForm, AppFormValues } from "@/components/forms/AppForm";
import { useState } from "react";

export default function NewAppPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(values: AppFormValues) {
    setError(null);
    try {
      const res = await fetch("/api/apps", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to create application");
        return;
      }

      router.push("/apps");
    } catch (err) {
      console.error(err);
      setError("Unexpected error while creating app");
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Register a new application"
        description="Add a web application that CompliScan will analyze for security and compliance."
      />

      <Card className="border border-slate-800/80 bg-slate-950/80">
        <CardContent>
          {error && (
            <p className="mb-3 text-xs text-red-400">{error}</p>
          )}
          <AppForm onSubmit={handleSubmit} />
        </CardContent>
      </Card>
    </div>
  );
}