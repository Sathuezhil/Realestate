"use client";

import { useCurrency } from "@/components/providers/CurrencyProvider";
import { CURRENCIES, type Currency } from "@/lib/currency";
import { cn } from "@/lib/utils";

export function CurrencySwitch({ compact = false }: { compact?: boolean }) {
  const { currency, setCurrency } = useCurrency();

  return (
    <label className={cn("currency-switch", compact && "currency-switch-compact")}>
      <span className="sr-only">Display currency</span>
      <select
        value={currency}
        onChange={(event) => setCurrency(event.target.value as Currency)}
        className="currency-select"
        title="Prices are listed in AED. Other currencies are indicative."
        suppressHydrationWarning
      >
        {CURRENCIES.map((item) => (
          <option key={item} value={item}>
            {item}
          </option>
        ))}
      </select>
    </label>
  );
}
