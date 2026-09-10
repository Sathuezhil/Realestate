import { NextResponse } from "next/server";
import { createEnquiry } from "@/lib/store";
import {
  INTAKE_BEDS,
  INTAKE_BUDGETS,
  INTAKE_COMMUNITIES,
  INTAKE_TIMELINES,
  intakeMessage,
  isAllowed,
} from "@/lib/intake";
import { formatViewingAt, isViewingSlotOpen, VIEWING_TIMES, viewingAtIso } from "@/lib/utils";
import { type EnquirySource, type ViewingType } from "@/types";

const TIMES = new Set<string>(VIEWING_TIMES);

function parseViewingAt(value?: string) {
  if (!value) return undefined;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return undefined;
  return value;
}

export async function POST(request: Request) {
  const body = (await request.json()) as {
    propertyId?: string;
    name?: string;
    email?: string;
    phone?: string;
    message?: string;
    source?: EnquirySource;
    viewingAt?: string;
    viewingDate?: string;
    viewingTime?: string;
    viewingType?: ViewingType;
    community?: string;
    budget?: string;
    bedrooms?: string;
    timeline?: string;
  };

  const name = body.name?.trim();
  const email = body.email?.trim();
  const phone = body.phone?.trim();
  const source: EnquirySource = body.source ?? (body.propertyId ? "property" : "contact");
  const viewingType = body.viewingType === "video" ? "video" : body.propertyId ? "in-person" : undefined;

  let viewingAt = parseViewingAt(body.viewingAt);
  if (!viewingAt && body.viewingDate && body.viewingTime && TIMES.has(body.viewingTime)) {
    viewingAt = viewingAtIso(body.viewingDate, body.viewingTime);
  }

  const community = body.community?.trim();
  const budget = body.budget?.trim();
  const bedrooms = body.bedrooms?.trim();
  const timeline = body.timeline?.trim();

  if (source === "property") {
    if (!viewingAt) {
      return NextResponse.json({ error: "Pick a day and time for the viewing." }, { status: 400 });
    }
    const time = viewingAt.slice(11, 16);
    const date = viewingAt.slice(0, 10);
    if (!TIMES.has(time) || !isViewingSlotOpen(date, time)) {
      return NextResponse.json({ error: "That viewing slot is no longer available." }, { status: 400 });
    }
  }

  if (source === "intake") {
    if (
      !community ||
      !budget ||
      !bedrooms ||
      !timeline ||
      !isAllowed(INTAKE_COMMUNITIES, community) ||
      !isAllowed(INTAKE_BUDGETS, budget) ||
      !isAllowed(INTAKE_BEDS, bedrooms) ||
      !isAllowed(INTAKE_TIMELINES, timeline)
    ) {
      return NextResponse.json({ error: "Choose a community, budget, beds, and timeline." }, { status: 400 });
    }
  }

  const note = body.message?.trim() ?? "";
  const slot = formatViewingAt(viewingAt);
  const kind = viewingType === "video" ? "video tour" : "private viewing";
  const message =
    source === "intake" && community && budget && bedrooms && timeline
      ? intakeMessage({ community, budget, bedrooms, timeline }, note || undefined)
      : note || (slot ? `Requested a ${kind} on ${slot} (Dubai time).` : "How can we help?");

  if (!name || !email || !phone || !message) {
    return NextResponse.json({ error: "All fields are required." }, { status: 400 });
  }

  const enquiry = await createEnquiry({
    propertyId: body.propertyId,
    name,
    email,
    phone,
    message,
    source,
    viewingAt,
    viewingType,
    community: source === "intake" ? community : undefined,
    budget: source === "intake" ? budget : undefined,
    bedrooms: source === "intake" ? bedrooms : undefined,
    timeline: source === "intake" ? timeline : undefined,
  });

  return NextResponse.json({ enquiry });
}
