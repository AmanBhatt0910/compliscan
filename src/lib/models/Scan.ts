// src/lib/models/Scan.ts
import { Schema, model, models, Types } from "mongoose";

const FindingSchema = new Schema(
  {
    category: { type: String, required: true }, // e.g. "Headers"
    name: { type: String, required: true }, // e.g. "strict-transport-security"
    status: { type: String, enum: ["pass", "warning", "fail"], required: true },
    severity: { type: String, enum: ["Low", "Medium", "High"], required: true },
    description: { type: String, required: true },
    recommendation: { type: String, required: true },
  },
  { _id: false }
);

const ScanSchema = new Schema(
  {
    app: { type: Types.ObjectId, ref: "App", required: true },
    runBy: { type: Types.ObjectId, ref: "User", required: true },
    score: { type: Number, required: true },
    status: { type: String, enum: ["pass", "warning", "fail"], required: true },
    categories: {
      tls: { type: Number, default: 0 },
      headers: { type: Number, default: 0 },
      cookies: { type: Number, default: 0 },
      content: { type: Number, default: 0 },
    },
    findings: [FindingSchema],
  },
  { timestamps: true }
);

export const Scan = models.Scan || model("Scan", ScanSchema);