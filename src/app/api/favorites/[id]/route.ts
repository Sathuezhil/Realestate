import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { toggleFavorite } from "@/lib/store";

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Please log in." }, { status: 401 });
  }
  const { id } = await params;
  const result = await toggleFavorite(user.id, id);
  return NextResponse.json(result);
}
