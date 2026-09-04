import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { setAuthCookie, signUserToken } from "@/lib/auth";
import { findUserByEmail } from "@/lib/store";

export async function POST(request: Request) {
  const body = (await request.json()) as { email?: string; password?: string };
  const email = body.email?.trim().toLowerCase();
  const password = body.password;

  if (!email || !password) {
    return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
  }

  const stored = await findUserByEmail(email);
  if (!stored) {
    return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
  }

  const ok = await bcrypt.compare(password, stored.passwordHash);
  if (!ok) {
    return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
  }

  const user = {
    id: stored.id,
    name: stored.name,
    email: stored.email,
    role: stored.role,
    favoriteIds: stored.favoriteIds,
  };
  const token = await signUserToken(user);
  await setAuthCookie(token);
  return NextResponse.json({ user });
}
