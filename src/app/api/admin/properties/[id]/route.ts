import { requireAdmin } from "@/lib/auth";
import { parsePropertyInput } from "@/lib/property-input";
import { deleteProperty, getStoredPropertyById, updateProperty } from "@/lib/store";
import { NextResponse } from "next/server";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await requireAdmin();
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });
  const { id } = await params;
  const property = await getStoredPropertyById(id);
  if (!property) return NextResponse.json({ error: "Listing not found." }, { status: 404 });
  return NextResponse.json({ property });
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await requireAdmin();
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });
  const { id } = await params;
  const body = (await request.json()) as Record<string, unknown>;
  const parsed = parsePropertyInput(body);
  if (parsed.error || !parsed.data) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }
  const property = await updateProperty(id, parsed.data);
  if (!property) return NextResponse.json({ error: "Listing not found." }, { status: 404 });
  return NextResponse.json({ property });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await requireAdmin();
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });
  const { id } = await params;
  const ok = await deleteProperty(id);
  if (!ok) return NextResponse.json({ error: "Listing not found." }, { status: 404 });
  return NextResponse.json({ ok: true });
}
