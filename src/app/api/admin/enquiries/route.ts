import { requireAdmin } from "@/lib/auth";
import { listEnquiries } from "@/lib/store";
import { NextResponse } from "next/server";

export async function GET() {
  const auth = await requireAdmin();
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });
  const enquiries = await listEnquiries();
  return NextResponse.json({ enquiries });
}
