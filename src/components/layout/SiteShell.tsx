"use client";

import { CompareBar } from "@/components/listings/CompareBar";
import { BrowseProvider } from "@/components/providers/BrowseProvider";
import { CurrencyProvider } from "@/components/providers/CurrencyProvider";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import type { Currency } from "@/lib/currency";
import type { Theme } from "@/lib/theme";

export function SiteShell({
  children,
  initialTheme,
  initialCurrency,
}: {
  children: React.ReactNode;
  initialTheme: Theme;
  initialCurrency: Currency;
}) {
  return (
    <ThemeProvider initialTheme={initialTheme}>
      <CurrencyProvider initialCurrency={initialCurrency}>
        <BrowseProvider>
          <div className="site-app flex min-h-dvh flex-1 flex-col">
            {children}
            <CompareBar />
          </div>
        </BrowseProvider>
      </CurrencyProvider>
    </ThemeProvider>
  );
}
