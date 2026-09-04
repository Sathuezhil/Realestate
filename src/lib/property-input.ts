import { type ListingStatus, type PropertyInput, type PropertyType } from "@/types";

function asString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function asNumber(value: unknown) {
  const parsed = typeof value === "number" ? value : Number(value);
  return Number.isFinite(parsed) ? parsed : NaN;
}

function asStringList(value: unknown) {
  if (Array.isArray(value)) {
    return value.map((item) => String(item).trim()).filter(Boolean);
  }
  if (typeof value === "string") {
    return value
      .split(/[\n,]/)
      .map((item) => item.trim())
      .filter(Boolean);
  }
  return [];
}

export function parsePropertyInput(body: Record<string, unknown>): { data?: PropertyInput; error?: string } {
  const title = asString(body.title);
  const description = asString(body.description);
  const price = asNumber(body.price);
  const propertyType = asString(body.propertyType) as PropertyType;
  const bedrooms = asNumber(body.bedrooms);
  const bathrooms = asNumber(body.bathrooms);
  const areaSqft = asNumber(body.areaSqft);
  const status = (asString(body.status) || "available") as ListingStatus;
  const images = asStringList(body.images);
  const amenities = asStringList(body.amenities);
  const location = (body.location ?? {}) as Record<string, unknown>;
  const agent = (body.agent ?? {}) as Record<string, unknown>;
  const area = asString(location.area);
  const city = asString(location.city) || "Dubai";
  const address = asString(location.address);
  const lat = asNumber(location.lat);
  const lng = asNumber(location.lng);
  const agentName = asString(agent.name);
  const agentPhone = asString(agent.phone);
  const agentEmail = asString(agent.email);

  if (!title || !description) return { error: "Title and description are required." };
  if (!Number.isFinite(price) || price <= 0) return { error: "Enter a valid price in AED." };
  if (propertyType !== "apartment" && propertyType !== "villa" && propertyType !== "office") {
    return { error: "Choose a property type." };
  }
  if (!Number.isFinite(areaSqft) || areaSqft <= 0) return { error: "Enter a valid size in sqft." };
  if (images.length === 0) return { error: "Add at least one image URL." };
  if (!area || !address || !Number.isFinite(lat) || !Number.isFinite(lng)) {
    return { error: "Community, address, and map coordinates are required." };
  }
  if (!agentName || !agentPhone || !agentEmail) return { error: "Agent contact is required." };
  if (status !== "available" && status !== "sold" && status !== "rented") {
    return { error: "Choose a listing status." };
  }

  return {
    data: {
      title,
      description,
      price,
      propertyType,
      bedrooms: Number.isFinite(bedrooms) ? bedrooms : 0,
      bathrooms: Number.isFinite(bathrooms) ? bathrooms : 0,
      areaSqft,
      furnished: Boolean(body.furnished),
      location: { area, city, address, lat, lng },
      images,
      amenities,
      status,
      agent: { name: agentName, phone: agentPhone, email: agentEmail },
    },
  };
}
