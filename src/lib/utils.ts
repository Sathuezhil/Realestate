import { formatMoney } from "@/lib/currency";
import { type PropertyFilters, type PropertyType, type SortOption } from "@/types";

export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function formatPrice(price: number) {
  return formatMoney(price, "AED");
}

export function formatNumber(value: number) {
  return value.toLocaleString("en-AE");
}

export function propertyTypeLabel(type: PropertyType) {
  return type.charAt(0).toUpperCase() + type.slice(1);
}

export function statusLabel(status: string) {
  return status.charAt(0).toUpperCase() + status.slice(1);
}

export function parseFilters(
  params: URLSearchParams | Record<string, string | string[] | undefined>,
): PropertyFilters {
  const get = (key: string) => {
    if (params instanceof URLSearchParams) return params.get(key) ?? undefined;
    const value = params[key];
    return Array.isArray(value) ? value[0] : value;
  };

  const num = (key: string) => {
    const raw = get(key);
    if (!raw) return undefined;
    const parsed = Number(raw);
    return Number.isFinite(parsed) ? parsed : undefined;
  };

  const propertyType = get("type");
  const sort = get("sort");
  const furnished = get("furnished");

  return {
    q: get("q")?.trim() || undefined,
    minPrice: num("minPrice"),
    maxPrice: num("maxPrice"),
    propertyType:
      propertyType === "apartment" || propertyType === "villa" || propertyType === "office"
        ? propertyType
        : undefined,
    bedrooms: num("bedrooms"),
    minArea: num("minArea"),
    maxArea: num("maxArea"),
    furnished: furnished === "yes" ? true : furnished === "no" ? false : undefined,
    sort:
      sort === "price-asc" || sort === "price-desc" || sort === "newest"
        ? (sort as SortOption)
        : "newest",
  };
}

export function filtersToSearchParams(filters: PropertyFilters, extra?: Record<string, string>) {
  const params = new URLSearchParams();
  if (filters.q) params.set("q", filters.q);
  if (filters.minPrice != null) params.set("minPrice", String(filters.minPrice));
  if (filters.maxPrice != null) params.set("maxPrice", String(filters.maxPrice));
  if (filters.propertyType) params.set("type", filters.propertyType);
  if (filters.bedrooms != null) params.set("bedrooms", String(filters.bedrooms));
  if (filters.minArea != null) params.set("minArea", String(filters.minArea));
  if (filters.maxArea != null) params.set("maxArea", String(filters.maxArea));
  if (filters.furnished === true) params.set("furnished", "yes");
  if (filters.furnished === false) params.set("furnished", "no");
  if (filters.sort && filters.sort !== "newest") params.set("sort", filters.sort);
  if (extra) {
    for (const [key, value] of Object.entries(extra)) {
      if (value) params.set(key, value);
    }
  }
  return params;
}

export const VIEWING_TIMES = ["10:00", "11:30", "13:00", "15:00", "16:30", "18:00"] as const;

export function viewingAtIso(date: string, time: string) {
  return `${date}T${time}:00+04:00`;
}

export function formatViewingAt(iso?: string) {
  if (!iso) return "";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleString("en-AE", {
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
    timeZone: "Asia/Dubai",
  });
}

export function dubaiYmd(offsetDays = 0) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Dubai",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
  const [year, month, day] = parts.split("-").map(Number);
  const next = new Date(Date.UTC(year, month - 1, day + offsetDays));
  return next.toISOString().slice(0, 10);
}

export function viewingDayParts(ymd: string) {
  const date = new Date(`${ymd}T12:00:00+04:00`);
  const top =
    ymd === dubaiYmd() ? "Today" : ymd === dubaiYmd(1) ? "Tomorrow" : date.toLocaleDateString("en-AE", {
      weekday: "short",
      timeZone: "Asia/Dubai",
    });
  const bottom = date.toLocaleDateString("en-AE", {
    day: "numeric",
    month: "short",
    timeZone: "Asia/Dubai",
  });
  return { top, bottom };
}

export function isViewingSlotOpen(date: string, time: string) {
  return new Date(viewingAtIso(date, time)).getTime() > Date.now() + 30 * 60 * 1000;
}

export const PRICE_RANGES = [
  { label: "Any price", min: undefined, max: undefined },
  { label: "Under AED 2M", min: undefined, max: 2_000_000 },
  { label: "AED 2M – 5M", min: 2_000_000, max: 5_000_000 },
  { label: "AED 5M – 10M", min: 5_000_000, max: 10_000_000 },
  { label: "AED 10M – 20M", min: 10_000_000, max: 20_000_000 },
  { label: "AED 20M+", min: 20_000_000, max: undefined },
] as const;
