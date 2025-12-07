// src/app/api/apps/[appId]/route.ts
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { App } from "@/lib/models/App";
import { requireUser } from "@/lib/auth";
import { appCreateSchema } from "@/lib/validators/appSchemas";

// Note: in Next 16, `params` is a Promise
type Params = { params: Promise<{ appId: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
  try {
    await connectDB();
    const user = await requireUser();
    const { appId } = await params;

    const app = await App.findOne({ _id: appId, owner: user.id }).lean();

    if (!app) {
      return NextResponse.json({ error: "App not found" }, { status: 404 });
    }

    return NextResponse.json({
      id: app._id.toString(),
      name: app.name,
      url: app.url,
      environment: app.environment,
      description: app.description,
      createdAt: app.createdAt,
    });
  } catch (err) {
    if ((err as Error).message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("GET /api/apps/[appId] error:", err);
    return NextResponse.json(
      { error: "Failed to fetch app" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest, { params }: Params) {
  try {
    await connectDB();
    const user = await requireUser();
    const { appId } = await params;
    const body = await req.json();
    const parsed = appCreateSchema.partial().safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input" },
        { status: 400 }
      );
    }

    const app = await App.findOneAndUpdate(
      { _id: appId, owner: user.id },
      { $set: parsed.data },
      { new: true }
    ).lean();

    if (!app) {
      return NextResponse.json({ error: "App not found" }, { status: 404 });
    }

    return NextResponse.json({
      id: app._id.toString(),
      name: app.name,
      url: app.url,
      environment: app.environment,
      description: app.description,
      createdAt: app.createdAt,
    });
  } catch (err) {
    if ((err as Error).message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("PATCH /api/apps/[appId] error:", err);
    return NextResponse.json(
      { error: "Failed to update app" },
      { status: 500 }
    );
  }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  try {
    await connectDB();
    const user = await requireUser();
    const { appId } = await params;

    const app = await App.findOneAndDelete({
      _id: appId,
      owner: user.id,
    }).lean();

    if (!app) {
      return NextResponse.json({ error: "App not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    if ((err as Error).message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("DELETE /api/apps/[appId] error:", err);
    return NextResponse.json(
      { error: "Failed to delete app" },
      { status: 500 }
    );
  }
}