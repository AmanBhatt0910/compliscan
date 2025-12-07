// src/app/api/scans/route.ts
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { scanCreateSchema } from "@/lib/validators/scanSchemas";
import { App } from "@/lib/models/App";
import { Scan } from "@/lib/models/Scan";
import { runScan } from "@/lib/scan-engine";
import type { Finding } from "@/lib/scan-engine/scoring";

interface ScanWithApp {
  _id: string;
  app?: {
    _id?: string;
    name?: string;
    url?: string;
  };
  score: number;
  status: "pass" | "warning" | "fail";
  createdAt: Date;
  categories: {
    tls: number;
    headers: number;
    cookies: number;
    content: number;
  };
  findings: Finding[];
}

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const user = await requireUser();

    const appId = req.nextUrl.searchParams.get("appId") || undefined;

    const query: Record<string, unknown> = { runBy: user.id };
    if (appId) {
      query.app = appId;
    }

    const scanDocs = (await Scan.find(query)
      .populate("app", "name url")
      .sort({ createdAt: -1 })
      .lean()) as ScanWithApp[];

    const result = scanDocs.map((s) => ({
      id: s._id.toString(),
      appName: s.app?.name ?? "Unknown",
      appUrl: s.app?.url ?? "",
      score: s.score,
      status: s.status,
      createdAt: s.createdAt,
    }));

    return NextResponse.json(result);
  } catch (err) {
    if ((err as Error).message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("GET /api/scans error:", err);
    return NextResponse.json(
      { error: "Failed to fetch scans" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const user = await requireUser();
    const body = await req.json();
    const parsed = scanCreateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input" },
        { status: 400 }
      );
    }

    const { appId } = parsed.data;

    const app = await App.findOne({ _id: appId, owner: user.id }).lean();
    if (!app) {
      return NextResponse.json({ error: "App not found" }, { status: 404 });
    }

    const result = await runScan(app.url);

    const scanDoc = await Scan.create({
      app: appId,
      runBy: user.id,
      score: result.score,
      status: result.status,
      categories: result.categories,
      findings: result.findings,
    });

    return NextResponse.json(
      {
        id: scanDoc._id.toString(),
        ...result,
      },
      { status: 201 }
    );
  } catch (err) {
    if ((err as Error).message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("POST /api/scans error:", err);
    return NextResponse.json(
      { error: "Failed to run scan" },
      { status: 500 }
    );
  }
}