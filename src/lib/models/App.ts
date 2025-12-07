// src/lib/models/App.ts
import { Schema, model, models, Types } from "mongoose";

const AppSchema = new Schema(
  {
    owner: { type: Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true, trim: true },
    url: { type: String, required: true, trim: true },
    environment: {
      type: String,
      enum: ["Production", "Staging", "Development"],
      default: "Production",
    },
    description: { type: String, default: "" },
  },
  { timestamps: true }
);

export const App = models.App || model("App", AppSchema);