// src/app/(dashboard)/apps/new/page.tsx
"use client";

import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/common/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { AppForm, AppFormValues } from "@/components/forms/AppForm";

export default function NewAppPage() {
  const router = useRouter();

  async function handleSubmit(values: AppFormValues) {
    // TODO: call /api/apps with POST
    console.log("New app:", values);
    // For now, fake redirect
    router.push("/apps");
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Register a new application"
        description="Add a web application that CompliScan will analyze for security and compliance."
      />

      <Card className="border border-slate-800/80 bg-slate-950/80">
        <CardContent>
          <AppForm onSubmit={handleSubmit} />
        </CardContent>
      </Card>
    </div>
  );
}