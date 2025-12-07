// src/app/api/apps/route.ts
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { App } from "@/lib/models/App";
import { appCreateSchema } from "@/lib/validators/appSchemas";
import { requireUser } from "@/lib/auth";

export async function GET() {
  try {
    await connectDB();
    const user = await requireUser();

    const apps = await App.find({ owner: user.id })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(
      apps.map((a) => ({
        id: a._id.toString(),
        name: a.name,
        url: a.url,
        environment: a.environment,
        description: a.description,
        createdAt: a.createdAt,
      }))
    );
  } catch (err) {
    if ((err as Error).message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("GET /api/apps error:", err);
    return NextResponse.json(
      { error: "Failed to fetch apps" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const user = await requireUser();
    const body = await req.json();
    const parsed = appCreateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const app = await App.create({
      ...parsed.data,
      owner: user.id,
    });

    return NextResponse.json(
      {
        id: app._id.toString(),
        name: app.name,
        url: app.url,
        environment: app.environment,
        description: app.description,
        createdAt: app.createdAt,
      },
      { status: 201 }
    );
  } catch (err) {
    if ((err as Error).message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("POST /api/apps error:", err);
    return NextResponse.json(
      { error: "Failed to create app" },
      { status: 500 }
    );
  }
}