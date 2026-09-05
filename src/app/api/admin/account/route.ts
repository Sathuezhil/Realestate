import { requireAdmin } from "@/lib/auth";
import { findUserById, updateUserPassword } from "@/lib/store";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function PATCH(request: Request) {
  const auth = await requireAdmin();
  if (auth.error || !auth.user) {
    return NextResponse.json({ error: auth.error ?? "Unauthorized" }, { status: auth.status });
  }

  const body = (await request.json()) as { currentPassword?: string; newPassword?: string };
  const currentPassword = body.currentPassword ?? "";
  const newPassword = body.newPassword ?? "";

  if (!currentPassword || !newPassword) {
    return NextResponse.json({ error: "Current and new password are required." }, { status: 400 });
  }
  if (newPassword.length < 8) {
    return NextResponse.json({ error: "New password must be at least 8 characters." }, { status: 400 });
  }

  const stored = await findUserById(auth.user.id);
  if (!stored) return NextResponse.json({ error: "Account not found." }, { status: 404 });

  const ok = await bcrypt.compare(currentPassword, stored.passwordHash);
  if (!ok) {
    return NextResponse.json({ error: "Current password is incorrect." }, { status: 401 });
  }

  const passwordHash = await bcrypt.hash(newPassword, 10);
  const updated = await updateUserPassword(stored.id, passwordHash);
  if (!updated) return NextResponse.json({ error: "Could not update password." }, { status: 500 });

  return NextResponse.json({ ok: true });
}
