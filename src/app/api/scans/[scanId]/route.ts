// src/app/api/scans/[scanId]/route.ts
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { Scan } from "@/lib/models/Scan";
import type { Finding } from "@/lib/scan-engine/scoring";

interface Params {
  params: { scanId: string };
}

interface ScanWithApp {
  _id: string;
  app?: {
    _id?: string;
    name?: string;
    url?: string;
    environment?: string;
  };
  score: number;
  status: "pass" | "warning" | "fail";
  categories: {
    tls: number;
    headers: number;
    cookies: number;
    content: number;
  };
  findings: Finding[];
  createdAt: Date;
}

export async function GET(_req: NextRequest, { params }: Params) {
  try {
    await connectDB();
    const user = await requireUser();

    const scanDoc = (await Scan.findOne({
      _id: params.scanId,
      runBy: user.id,
    })
      .populate("app", "name url environment")
      .lean()) as ScanWithApp | null;

    if (!scanDoc) {
      return NextResponse.json({ error: "Scan not found" }, { status: 404 });
    }

    const app = scanDoc.app;

    return NextResponse.json({
      id: scanDoc._id.toString(),
      score: scanDoc.score,
      status: scanDoc.status,
      categories: scanDoc.categories,
      findings: scanDoc.findings,
      app: {
        id: app?._id?.toString(),
        name: app?.name,
        url: app?.url,
        environment: app?.environment,
      },
      createdAt: scanDoc.createdAt,
    });
  } catch (err) {
    if ((err as Error).message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("GET /api/scans/[scanId] error:", err);
    return NextResponse.json(
      { error: "Failed to fetch scan" },
      { status: 500 }
    );
  }
}