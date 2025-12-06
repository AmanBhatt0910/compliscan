// src/components/forms/AppForm.tsx
"use client";

import { useState, FormEvent } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Environment = "Production" | "Staging" | "Development";

export interface AppFormValues {
  name: string;
  url: string;
  environment: Environment;
  description?: string;
}

interface AppFormProps {
  defaultValues?: Partial<AppFormValues>;
  onSubmit?: (values: AppFormValues) => Promise<void> | void;
}

export function AppForm({ defaultValues, onSubmit }: AppFormProps) {
  const [values, setValues] = useState<AppFormValues>({
    name: defaultValues?.name ?? "",
    url: defaultValues?.url ?? "",
    environment: (defaultValues?.environment as Environment) ?? "Production",
    description: defaultValues?.description ?? "",
  });
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!onSubmit) return;

    try {
      setSubmitting(true);
      await onSubmit(values);
    } finally {
      setSubmitting(false);
    }
  }

  function update<K extends keyof AppFormValues>(key: K, value: AppFormValues[K]) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-xs">
      <div className="grid gap-3 md:grid-cols-2">
        <div className="space-y-1">
          <label className="text-[0.7rem] font-medium text-slate-200">
            Application name
          </label>
          <Input
            placeholder="e.g. College Portal"
            value={values.name}
            onChange={(e) => update("name", e.target.value)}
            required
          />
          <p className="text-[0.65rem] text-[var(--color-muted-foreground)]">
            A friendly name to identify this web application in CompliScan.
          </p>
        </div>
        <div className="space-y-1">
          <label className="text-[0.7rem] font-medium text-slate-200">
            URL
          </label>
          <Input
            placeholder="https://portal.college.in"
            type="url"
            value={values.url}
            onChange={(e) => update("url", e.target.value)}
            required
          />
          <p className="text-[0.65rem] text-[var(--color-muted-foreground)]">
            Full URL that CompliScan will scan (HTTPS recommended).
          </p>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-[1.2fr_2fr]">
        <div className="space-y-1">
          <label className="text-[0.7rem] font-medium text-slate-200">
            Environment
          </label>
          <div className="flex gap-2">
            {(["Production", "Staging", "Development"] as Environment[]).map(
              (env) => {
                const active = values.environment === env;
                return (
                  <button
                    key={env}
                    type="button"
                    onClick={() => update("environment", env)}
                    className={cn(
                      "flex-1 rounded-[999px] border px-2 py-1 text-[0.7rem] font-medium transition-colors",
                      active
                        ? "border-[var(--color-brand)] bg-[var(--color-brand-soft)] text-slate-50"
                        : "border-slate-800 bg-slate-950/80 text-slate-400 hover:bg-slate-900/80 hover:text-slate-100"
                    )}
                  >
                    {env}
                  </button>
                );
              }
            )}
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-[0.7rem] font-medium text-slate-200">
            Notes (optional)
          </label>
          <Textarea
            placeholder="Describe the purpose, owner or any security notes about this application..."
            rows={3}
            value={values.description}
            onChange={(e) => update("description", e.target.value)}
          />
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-3">
        <Button type="submit" loading={submitting} size="md">
          Save application
        </Button>
      </div>
    </form>
  );
}