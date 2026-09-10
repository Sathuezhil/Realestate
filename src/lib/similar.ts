import { type Property } from "@/types";

function scoreSimilar(current: Property, other: Property) {
  let score = 0;
  if (other.location.area === current.location.area) score += 4;
  else if (other.location.city === current.location.city) score += 1;
  if (other.propertyType === current.propertyType) score += 3;
  const bedDiff = Math.abs(other.bedrooms - current.bedrooms);
  if (bedDiff === 0) score += 2;
  else if (bedDiff === 1) score += 1;
  const ratio = current.price === 0 ? 1 : other.price / current.price;
  if (ratio >= 0.7 && ratio <= 1.3) score += 2;
  else if (ratio >= 0.5 && ratio <= 1.5) score += 1;
  if (other.furnished === current.furnished) score += 1;
  return score;
}

export function rankSimilar(current: Property, pool: Property[], limit = 3): Property[] {
  return pool
    .filter((item) => item.id !== current.id && item.status === "available")
    .map((item) => ({ item, score: scoreSimilar(current, item) }))
    .sort((a, b) => b.score - a.score || a.item.price - b.item.price)
    .slice(0, limit)
    .map((entry) => entry.item);
}
