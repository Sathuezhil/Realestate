import { NextResponse } from "next/server";
import { listProperties } from "@/lib/properties";
import { parseFilters } from "@/lib/utils";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const filters = parseFilters(searchParams);
  const properties = await listProperties(filters);
  return NextResponse.json({ properties, count: properties.length });
}
