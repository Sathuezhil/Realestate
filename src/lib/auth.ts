import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { type AuthUser } from "@/types";
import { findUserById } from "@/lib/store";

const COOKIE = "re_token";
const secret = new TextEncoder().encode(process.env.JWT_SECRET || "aurelia-dev-secret-change-me");

export async function signUserToken(user: Pick<AuthUser, "id" | "email" | "role" | "name">) {
  return new SignJWT({
    sub: user.id,
    email: user.email,
    role: user.role,
    name: user.name,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret);
}

export async function setAuthCookie(token: string) {
  const jar = await cookies();
  jar.set(COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function clearAuthCookie() {
  const jar = await cookies();
  jar.delete(COOKIE);
}

export async function getTokenPayload() {
  const jar = await cookies();
  const token = jar.get(COOKIE)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload;
  } catch {
    return null;
  }
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  const payload = await getTokenPayload();
  if (!payload?.sub) return null;
  const user = await findUserById(String(payload.sub));
  if (!user) return null;
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    favoriteIds: user.favoriteIds,
  };
}

export async function requireAdmin() {
  const user = await getCurrentUser();
  if (!user) return { user: null, error: "Unauthorized", status: 401 as const };
  if (user.role !== "admin") return { user, error: "Forbidden", status: 403 as const };
  return { user, error: null, status: 200 as const };
}
