// src/lib/validators/scanSchemas.ts
import { z } from "zod";

export const scanCreateSchema = z.object({
  appId: z.string().min(1),
});

export type ScanCreateInput = z.infer<typeof scanCreateSchema>;