"use client";

import { readStoredTheme, THEME_KEY, type Theme } from "@/lib/theme";
import { createContext, useCallback, useContext, useLayoutEffect, useMemo, useState } from "react";

interface ThemeContextValue {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

function persistTheme(theme: Theme) {
  document.documentElement.classList.toggle("site-dark", theme === "dark");
  window.localStorage.setItem(THEME_KEY, theme);
  document.cookie = `${THEME_KEY}=${theme}; path=/; max-age=31536000; samesite=lax`;
}

export function ThemeProvider({
  children,
  initialTheme = "light",
}: {
  children: React.ReactNode;
  initialTheme?: Theme;
}) {
  const [theme, setTheme] = useState<Theme>(initialTheme);

  useLayoutEffect(() => {
    const cookie = readStoredTheme(
      document.cookie.match(new RegExp(`(?:^|; )${THEME_KEY}=(dark|light)`))?.[1],
    );
    const local = readStoredTheme(window.localStorage.getItem(THEME_KEY));
    const next = cookie ?? local ?? initialTheme;
    if (next !== initialTheme) setTheme(next);
    persistTheme(next);
  }, [initialTheme]);

  const toggleTheme = useCallback(() => {
    setTheme((current) => {
      const next: Theme = current === "dark" ? "light" : "dark";
      persistTheme(next);
      return next;
    });
  }, []);

  const value = useMemo(() => ({ theme, toggleTheme }), [theme, toggleTheme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within ThemeProvider");
  return context;
}
