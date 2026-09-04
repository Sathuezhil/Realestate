import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { getPropertiesByIds } from "@/lib/properties";
import { toggleFavorite } from "@/lib/store";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Please log in to view favorites." }, { status: 401 });
  }
  const properties = await getPropertiesByIds(user.favoriteIds);
  return NextResponse.json({ properties, favoriteIds: user.favoriteIds });
}

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Please log in to save listings." }, { status: 401 });
  }
  const body = (await request.json()) as { propertyId?: string };
  if (!body.propertyId) {
    return NextResponse.json({ error: "propertyId is required." }, { status: 400 });
  }
  const result = await toggleFavorite(user.id, body.propertyId);
  return NextResponse.json(result);
}
