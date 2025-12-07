// src/lib/auth.ts
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { User } from "./models/User";
import { connectDB } from "./db";

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET must be set in .env.local");
}

// Password helpers
export async function hashPassword(password: string) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

// JWT payload type
interface JWTPayload {
  userId: string;
  email: string;
  role: string;
}

// Create JWT
export function signAuthToken(payload: JWTPayload) {
  return jwt.sign(payload, JWT_SECRET!, { expiresIn: "7d" });
}

// Verify JWT
export function verifyAuthToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET!) as JWTPayload;
  } catch {
    return null;
  }
}

// Get current user from cookie
export async function getCurrentUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get("compliscan_token")?.value;
  if (!token) return null;

  const payload = verifyAuthToken(token);
  if (!payload) return null;

  await connectDB();
  const user = await User.findById(payload.userId).lean();
  if (!user) return null;

  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    role: user.role,
  };
}

// Require auth inside route handlers
export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("UNAUTHORIZED");
  }
  return user;
}

// Set auth cookie in a NextResponse
export function attachAuthCookie(res: Response, token: string) {
  const cookieHeader = `compliscan_token=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${
    7 * 24 * 60 * 60
  }; Secure`;
  res.headers.append("Set-Cookie", cookieHeader);
  return res;
}