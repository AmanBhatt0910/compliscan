// src/lib/validators/appSchemas.ts
import { z } from "zod";

export const appCreateSchema = z.object({
  name: z.string().min(2).max(120),
  url: z.string().url(),
  environment: z.enum(["Production", "Staging", "Development"]),
  description: z.string().max(500).optional(),
});

export type AppCreateInput = z.infer<typeof appCreateSchema>;