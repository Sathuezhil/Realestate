import { NextResponse } from "next/server";
import { createEnquiry } from "@/lib/store";

export async function POST(request: Request) {
  const body = (await request.json()) as {
    propertyId?: string;
    name?: string;
    email?: string;
    phone?: string;
    message?: string;
    source?: "property" | "contact";
  };

  const name = body.name?.trim();
  const email = body.email?.trim();
  const phone = body.phone?.trim();
  const message = body.message?.trim();

  if (!name || !email || !phone || !message) {
    return NextResponse.json({ error: "All fields are required." }, { status: 400 });
  }

  const enquiry = await createEnquiry({
    propertyId: body.propertyId,
    name,
    email,
    phone,
    message,
    source: body.source ?? (body.propertyId ? "property" : "contact"),
  });

  return NextResponse.json({ enquiry });
}
