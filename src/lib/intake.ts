export const INTAKE_COMMUNITIES = [
  "Palm Jumeirah",
  "Downtown Dubai",
  "Dubai Marina",
  "Emirates Hills",
  "Dubai Hills",
  "Arabian Ranches",
  "Open — advise me",
] as const;

export const INTAKE_BUDGETS = [
  "Under AED 2M",
  "AED 2M – 5M",
  "AED 5M – 10M",
  "AED 10M – 20M",
  "AED 20M+",
  "Open — advise me",
] as const;

export const INTAKE_BEDS = ["Any", "1+", "2+", "3+", "4+", "5+"] as const;

export const INTAKE_TIMELINES = [
  "This week",
  "This month",
  "1–3 months",
  "3–6 months",
  "Just looking",
] as const;

export type IntakeCommunity = (typeof INTAKE_COMMUNITIES)[number];
export type IntakeBudget = (typeof INTAKE_BUDGETS)[number];
export type IntakeBeds = (typeof INTAKE_BEDS)[number];
export type IntakeTimeline = (typeof INTAKE_TIMELINES)[number];

export interface IntakeBrief {
  community: string;
  budget: string;
  bedrooms: string;
  timeline: string;
}

export function isAllowed<T extends string>(list: readonly T[], value: string): value is T {
  return (list as readonly string[]).includes(value);
}

export function formatIntakeSummary(brief: Partial<IntakeBrief>) {
  return [brief.community, brief.budget, brief.bedrooms ? `${brief.bedrooms} beds` : "", brief.timeline]
    .filter(Boolean)
    .join(" · ");
}

export function intakeMessage(brief: IntakeBrief, note?: string) {
  const line = `Buyer brief — ${brief.community}, ${brief.budget}, ${brief.bedrooms} beds, ${brief.timeline}.`;
  return note ? `${line} ${note}` : `${line} Please send 3 matching homes.`;
}
