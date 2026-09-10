export type PropertyType = "apartment" | "villa" | "office";
export type ListingStatus = "available" | "sold" | "rented";
export type UserRole = "user" | "admin";
export type SortOption = "newest" | "price-asc" | "price-desc";

export interface PropertyLocation {
  area: string;
  city: string;
  address: string;
  lat: number;
  lng: number;
}

export interface AgentContact {
  name: string;
  phone: string;
  email: string;
}

export interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  propertyType: PropertyType;
  bedrooms: number;
  bathrooms: number;
  areaSqft: number;
  furnished: boolean;
  location: PropertyLocation;
  images: string[];
  amenities: string[];
  status: ListingStatus;
  agent: AgentContact;
  createdAt: string;
}

export interface PropertyFilters {
  q?: string;
  minPrice?: number;
  maxPrice?: number;
  propertyType?: PropertyType;
  bedrooms?: number;
  minArea?: number;
  maxArea?: number;
  furnished?: boolean;
  sort?: SortOption;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  favoriteIds: string[];
}

export type EnquiryStatus = "new" | "contacted" | "closed";
export type ViewingType = "in-person" | "video";
export type EnquirySource = "property" | "contact" | "intake";

export interface Enquiry {
  id: string;
  propertyId?: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  source: EnquirySource;
  status: EnquiryStatus;
  viewingAt?: string;
  viewingType?: ViewingType;
  community?: string;
  budget?: string;
  bedrooms?: string;
  timeline?: string;
  createdAt: string;
}

export type PropertyInput = Omit<Property, "id" | "createdAt">;
