import { seedProperties } from "@/data/properties";
import { connectDB, isMongoReady } from "@/lib/db";
import { PropertyModel } from "@/models/Property";
import { type Property, type PropertyFilters } from "@/types";

function applyFilters(properties: Property[], filters: PropertyFilters): Property[] {
  let result = properties.filter((property) => property.status === "available");

  if (filters.q) {
    const q = filters.q.toLowerCase();
    result = result.filter((property) => {
      const haystack = [
        property.title,
        property.description,
        property.location.area,
        property.location.city,
        property.location.address,
        property.propertyType,
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
  }

  if (filters.minPrice != null) {
    result = result.filter((property) => property.price >= filters.minPrice!);
  }
  if (filters.maxPrice != null) {
    result = result.filter((property) => property.price <= filters.maxPrice!);
  }
  if (filters.propertyType) {
    result = result.filter((property) => property.propertyType === filters.propertyType);
  }
  if (filters.bedrooms != null) {
    result = result.filter((property) => property.bedrooms >= filters.bedrooms!);
  }
  if (filters.minArea != null) {
    result = result.filter((property) => property.areaSqft >= filters.minArea!);
  }
  if (filters.maxArea != null) {
    result = result.filter((property) => property.areaSqft <= filters.maxArea!);
  }
  if (filters.furnished != null) {
    result = result.filter((property) => property.furnished === filters.furnished);
  }

  const sort = filters.sort ?? "newest";
  result = [...result].sort((a, b) => {
    if (sort === "price-asc") return a.price - b.price;
    if (sort === "price-desc") return b.price - a.price;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return result;
}

function fromMongoDoc(doc: {
  _id: { toString(): string };
  title: string;
  description: string;
  price: number;
  propertyType: Property["propertyType"];
  bedrooms: number;
  bathrooms: number;
  areaSqft: number;
  furnished: boolean;
  location: Property["location"];
  images: string[];
  amenities: string[];
  status: Property["status"];
  agent: Property["agent"];
  createdAt: Date;
}): Property {
  return {
    id: doc._id.toString(),
    title: doc.title,
    description: doc.description,
    price: doc.price,
    propertyType: doc.propertyType,
    bedrooms: doc.bedrooms,
    bathrooms: doc.bathrooms,
    areaSqft: doc.areaSqft,
    furnished: doc.furnished,
    location: doc.location,
    images: doc.images,
    amenities: doc.amenities,
    status: doc.status,
    agent: doc.agent,
    createdAt: doc.createdAt.toISOString(),
  };
}

export async function listProperties(filters: PropertyFilters = {}): Promise<Property[]> {
  await connectDB();
  if (isMongoReady()) {
    const count = await PropertyModel.countDocuments();
    if (count > 0) {
      const query: Record<string, unknown> = { status: "available" };
      if (filters.q) {
        query.$or = [
          { title: { $regex: filters.q, $options: "i" } },
          { description: { $regex: filters.q, $options: "i" } },
          { "location.area": { $regex: filters.q, $options: "i" } },
          { "location.city": { $regex: filters.q, $options: "i" } },
          { "location.address": { $regex: filters.q, $options: "i" } },
        ];
      }
      if (filters.minPrice != null || filters.maxPrice != null) {
        query.price = {
          ...(filters.minPrice != null ? { $gte: filters.minPrice } : {}),
          ...(filters.maxPrice != null ? { $lte: filters.maxPrice } : {}),
        };
      }
      if (filters.propertyType) query.propertyType = filters.propertyType;
      if (filters.bedrooms != null) query.bedrooms = { $gte: filters.bedrooms };
      if (filters.minArea != null || filters.maxArea != null) {
        query.areaSqft = {
          ...(filters.minArea != null ? { $gte: filters.minArea } : {}),
          ...(filters.maxArea != null ? { $lte: filters.maxArea } : {}),
        };
      }
      if (filters.furnished != null) query.furnished = filters.furnished;

      const sort =
        filters.sort === "price-asc"
          ? { price: 1 as const }
          : filters.sort === "price-desc"
            ? { price: -1 as const }
            : { createdAt: -1 as const };

      const docs = await PropertyModel.find(query).sort(sort).lean();
      return docs.map(fromMongoDoc);
    }
  }

  return applyFilters(seedProperties, filters);
}

export async function getPropertyById(id: string): Promise<Property | null> {
  await connectDB();
  if (isMongoReady()) {
    const doc = await PropertyModel.findById(id).lean().catch(() => null);
    if (doc) return fromMongoDoc(doc);
  }
  return seedProperties.find((property) => property.id === id) ?? null;
}

export async function getFeaturedProperties(): Promise<Property[]> {
  const { featuredPropertyIds } = await import("@/data/properties");
  const featured = featuredPropertyIds
    .map((id) => seedProperties.find((property) => property.id === id))
    .filter((property): property is Property => Boolean(property && property.status === "available"));

  await connectDB();
  if (isMongoReady()) {
    const count = await PropertyModel.countDocuments({ status: "available" });
    if (count > 0) {
      const docs = await PropertyModel.find({ status: "available" }).sort({ createdAt: -1 }).limit(6).lean();
      return docs.map(fromMongoDoc);
    }
  }

  return featured;
}

export async function getPropertiesByIds(ids: string[]): Promise<Property[]> {
  const unique = [...new Set(ids)];
  const results = await Promise.all(unique.map((id) => getPropertyById(id)));
  return results.filter((property): property is Property => Boolean(property));
}
