export interface CommunityProfile {
  slug: string;
  name: string;
  short: string;
  tagline: string;
  copy: string;
  highlights: string[];
  image?: string;
}

const shot = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1600&q=80`;

export const COMMUNITIES: CommunityProfile[] = [
  {
    slug: "palm-jumeirah",
    name: "Palm Jumeirah",
    short: "Palm",
    tagline: "Private beach, frond villas, and a skyline that still stops people.",
    copy: "The Palm is why a lot of our clients move to Dubai. Garden Homes on the fronds, signature beach villas, and a handful of apartments that actually sit on the water. Atlantis, Nakheel Mall, and the monorail are close; the quiet is on the outer fronds.\n\nWe arrange beach access, viewing slots that miss the weekend traffic, and the NOC conversation with the developer.",
    highlights: ["Private beach & sea walls", "Frond villas and Garden Homes", "Atlantis and Nakheel Mall nearby"],
  },
  {
    slug: "downtown-dubai",
    name: "Downtown Dubai",
    short: "Downtown",
    tagline: "Burj views, the Boulevard, and a lock-up-and-leave city home.",
    copy: "Downtown is for people who want the opera, the mall, and the fountains on foot. High-floor apartments and penthouses with Burj Khalifa or fountain views, concierge buildings, and a rental market that stays tight.\n\nWe walk the stack, check service charges, and get you on a terrace at the right hour — sunset over the Burj is not a brochure line here.",
    highlights: ["Burj and fountain views", "Dubai Mall and Opera District", "Strong end-user and rental demand"],
  },
  {
    slug: "dubai-hills",
    name: "Dubai Hills",
    short: "Hills",
    tagline: "Park-backed villas, the golf club, and the school run that actually works.",
    copy: "Dubai Hills is the family answer to Emirates Hills money with newer stock. Maple, Sidra, and park-facing villas, a mall you can actually use, and GEMS campuses minutes away.\n\nClients ask for a garden, a pool, and a drive to school that does not cross the city. This is that list.",
    highlights: ["Gated villas on parks and fairways", "Dubai Hills Mall and golf club", "School run to GEMS campuses"],
  },
  {
    slug: "dubai-marina",
    name: "Dubai Marina",
    short: "Marina",
    tagline: "Water, walkability, and a skyline you can live inside.",
    copy: "Marina Walk, the tram, JBR in ten minutes on foot. Two- and three-bedroom apartments with marina or sea views, buildings with pools that people actually use, and a lock-and-leave story that works for pieds-à-terre.\n\nWe filter for parking, service charge, and whether the view is water or the next tower.",
    highlights: ["Marina Walk and tram", "JBR and the Beach next door", "Pied-à-terre and rental stock"],
  },
  {
    slug: "emirates-hills",
    name: "Emirates Hills",
    short: "Emirates Hills",
    tagline: "Gated golf-course villas. Quiet cul-de-sacs, serious plots.",
    copy: "Emirates Hills remains the address people name when they mean a villa with a fairway. Larger plots, established landscaping, and a resident mix that does not turn over every season.\n\nViewings here are appointment-only. We handle the gate, the files, and the conversation with the other side.",
    highlights: ["Golf-course and lake plots", "Gated, low-turnover streets", "Media City and schools nearby"],
  },
  {
    slug: "arabian-ranches",
    name: "Arabian Ranches",
    short: "Ranches",
    tagline: "Low-rise villas, the souk, and a desert edge that still feels like a neighbourhood.",
    copy: "Arabian Ranches is for buyers who want a garden, a community pool, and a school bus that stops on the street. Refurbished three- and four-bed villas, the golf course, and the equestrian centre.\n\nWe show the plot, the upgrade history, and whether the kitchen has already been done — so you are not paying twice.",
    highlights: ["Family villas on quiet streets", "Community souk and golf", "School-bus neighbourhood"],
  },
  {
    slug: "jbr",
    name: "JBR",
    short: "JBR",
    tagline: "The Beach, the Walk, and a one-bed that behaves like a holiday home.",
    copy: "Jumeirah Beach Residence is sand, the Walk, and buildings that face the water. One- and two-beds that work as a pied-à-terre or a short-stay hold. Bluewaters is a bridge away.\n\nWe are honest about weekend noise and which stacks actually see the sea.",
    highlights: ["The Beach and The Walk", "Sea-facing stacks", "Bluewaters next door"],
  },
  {
    slug: "difc",
    name: "DIFC",
    short: "DIFC",
    tagline: "Fitted offices and a walk to Gate Avenue.",
    copy: "DIFC is the office conversation: fitted floors, parking, and a district that still pulls the banks. We show the floor plate, the fit-out, and the service charge before you sit with the landlord.",
    highlights: ["Fitted office floors", "Gate Avenue and the Gate", "Parking and district access"],
  },
  {
    slug: "business-bay",
    name: "Business Bay",
    short: "Business Bay",
    tagline: "Canal apartments a short hop from Downtown, without Downtown pricing.",
    copy: "Business Bay sits against the canal with a walk or a short drive to Downtown. Three-bed apartments that work for end-users who want space and a view of water, without paying Boulevard prices.",
    highlights: ["Canal views", "Next to Downtown", "Larger apartments for the money"],
  },
  {
    slug: "bluewaters",
    name: "Bluewaters",
    short: "Bluewaters",
    tagline: "Island living, Ain Dubai, and a pedestrian bridge to JBR.",
    copy: "Bluewaters is a small island with hotel-managed buildings, a podium of cafés, and a walk to JBR. Two-beds that feel furnished and looked-after — useful if you want lock-and-leave without a villa staff plan.",
    highlights: ["Island and Ain Dubai", "Hotel-style amenities", "Bridge to JBR"],
  },
  {
    slug: "al-barari",
    name: "Al Barari",
    short: "Al Barari",
    tagline: "Lush plots, ghaf trees, and villas that sit in a garden first.",
    copy: "Al Barari is the green exception inside the city. Villas organised around courtyards and water, unfurnished shells ready for a family who want landscape more than a skyline.\n\nMeydan and Dubai Hills are a short drive. Viewings take time — the plots are the point.",
    highlights: ["Landscaped, low-density villas", "Private pools and courtyards", "Quiet drive to Hills and Meydan"],
  },
  {
    slug: "jlt",
    name: "JLT",
    short: "JLT",
    tagline: "Lakes, clusters, and a practical city apartment.",
    copy: "Jumeirah Lakes Towers is lakes, the metro, and apartments that still make sense as a first Dubai home or a rental hold. We pick the cluster for the view and the walk to the station.",
    highlights: ["Lake and cluster living", "Metro access", "Practical rental stock"],
    image: shot("photo-1486406146926-c627a92ad1ab"),
  },
  {
    slug: "city-walk",
    name: "City Walk",
    short: "City Walk",
    tagline: "Low-rise, retail on the podium, and Jumeirah a few minutes away.",
    copy: "City Walk is a walkable pocket between Jumeirah and Downtown — apartments with terraces, dining downstairs, La Mer a short drive. Furnished two-beds that work as a city pied-à-terre.",
    highlights: ["Podium dining and retail", "Near La Mer and Jumeirah", "Furnished lock-up-and-leave"],
    image: shot("photo-1600585154526-990dced4db0d"),
  },
];

export function communitySlug(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function getCommunityBySlug(slug: string) {
  return COMMUNITIES.find((item) => item.slug === slug) ?? null;
}

export function getCommunityByArea(area: string) {
  const slug = communitySlug(area);
  return getCommunityBySlug(slug) ?? COMMUNITIES.find((item) => item.name === area) ?? null;
}
