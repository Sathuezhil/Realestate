import { requireAdmin } from "@/lib/auth";
import { parsePropertyInput } from "@/lib/property-input";
import { createProperty, listStoredProperties } from "@/lib/store";
import { NextResponse } from "next/server";

export async function GET() {
  const auth = await requireAdmin();
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });
  const properties = await listStoredProperties();
  return NextResponse.json({ properties });
}

export async function POST(request: Request) {
  const auth = await requireAdmin();
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });
  const body = (await request.json()) as Record<string, unknown>;
  const parsed = parsePropertyInput(body);
  if (parsed.error || !parsed.data) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }
  const property = await createProperty(parsed.data);
  return NextResponse.json({ property }, { status: 201 });
}
