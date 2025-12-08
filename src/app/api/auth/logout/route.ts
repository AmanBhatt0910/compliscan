// src/app/api/auth/logout/route.ts
import { NextResponse } from "next/server";

export async function POST() {
  // Clear the auth cookie by setting Max-Age=0
  const res = NextResponse.json({ success: true }, { status: 200 });

  res.headers.append(
    "Set-Cookie",
    [
      "compliscan_token=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0; Secure",
    ].join("")
  );

  return res;
}