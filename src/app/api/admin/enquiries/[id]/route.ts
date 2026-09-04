import { requireAdmin } from "@/lib/auth";
import { updateEnquiryStatus } from "@/lib/store";
import { type EnquiryStatus } from "@/types";
import { NextResponse } from "next/server";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await requireAdmin();
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });
  const { id } = await params;
  const body = (await request.json()) as { status?: EnquiryStatus };
  if (body.status !== "new" && body.status !== "contacted" && body.status !== "closed") {
    return NextResponse.json({ error: "Invalid status." }, { status: 400 });
  }
  const enquiry = await updateEnquiryStatus(id, body.status);
  if (!enquiry) return NextResponse.json({ error: "Enquiry not found." }, { status: 404 });
  return NextResponse.json({ enquiry });
}
