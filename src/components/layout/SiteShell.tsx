"use client";

import { ThemeProvider } from "@/components/providers/ThemeProvider";
import type { Theme } from "@/lib/theme";

export function SiteShell({
  children,
  initialTheme,
}: {
  children: React.ReactNode;
  initialTheme: Theme;
}) {
  return (
    <ThemeProvider initialTheme={initialTheme}>
      <div className="site-app flex min-h-dvh flex-1 flex-col">{children}</div>
    </ThemeProvider>
  );
}
