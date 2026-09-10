export const RECENT_KEY = "aurelia-recent";
export const COMPARE_KEY = "aurelia-compare";
export const MAX_RECENT = 8;
export const MAX_COMPARE = 3;

export function parseIdList(raw: string | null | undefined, max: number): string[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((id): id is string => typeof id === "string" && id.length > 0).slice(0, max);
  } catch {
    return [];
  }
}

export function pushRecentId(ids: string[], id: string) {
  return [id, ...ids.filter((item) => item !== id)].slice(0, MAX_RECENT);
}
