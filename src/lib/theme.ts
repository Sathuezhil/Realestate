export const THEME_KEY = "aurelia-theme";

export type Theme = "light" | "dark";

export function parseTheme(value: string | undefined | null): Theme {
  return value === "dark" ? "dark" : "light";
}

export function readStoredTheme(value: string | undefined | null): Theme | null {
  return value === "dark" || value === "light" ? value : null;
}
