import { NextResponse } from "next/server";
import { getPropertiesByIds, listProperties } from "@/lib/properties";
import { parseFilters } from "@/lib/utils";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const ids = searchParams.get("ids");
  if (ids) {
    const list = ids
      .split(",")
      .map((id) => id.trim())
      .filter(Boolean)
      .slice(0, 12);
    const properties = await getPropertiesByIds(list);
    return NextResponse.json({ properties, count: properties.length });
  }
  const filters = parseFilters(searchParams);
  const properties = await listProperties(filters);
  return NextResponse.json({ properties, count: properties.length });
}
