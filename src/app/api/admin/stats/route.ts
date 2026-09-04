import { requireAdmin } from "@/lib/auth";
import { listEnquiries, listStoredProperties, listUsers } from "@/lib/store";
import { NextResponse } from "next/server";

export async function GET() {
  const auth = await requireAdmin();
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });
  const [properties, enquiries, users] = await Promise.all([
    listStoredProperties(),
    listEnquiries(),
    listUsers(),
  ]);
  return NextResponse.json({
    listings: properties.length,
    available: properties.filter((item) => item.status === "available").length,
    sold: properties.filter((item) => item.status === "sold").length,
    rented: properties.filter((item) => item.status === "rented").length,
    enquiries: enquiries.length,
    newEnquiries: enquiries.filter((item) => item.status === "new").length,
    users: users.filter((item) => item.role === "user").length,
    recentEnquiries: enquiries.slice(0, 6),
    recentListings: properties.slice(0, 5),
  });
}
