"use client";

import {
  CURRENCY_KEY,
  CURRENCIES,
  formatMoney,
  parseCurrency,
  type Currency,
} from "@/lib/currency";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

interface CurrencyContextValue {
  currency: Currency;
  setCurrency: (next: Currency) => void;
  format: (aed: number) => string;
}

const CurrencyContext = createContext<CurrencyContextValue | null>(null);

function persistCurrency(currency: Currency) {
  window.localStorage.setItem(CURRENCY_KEY, currency);
  document.cookie = `${CURRENCY_KEY}=${currency}; path=/; max-age=31536000; samesite=lax`;
}

export function CurrencyProvider({
  children,
  initialCurrency = "AED",
}: {
  children: React.ReactNode;
  initialCurrency?: Currency;
}) {
  const [currency, setCurrencyState] = useState<Currency>(initialCurrency);

  useEffect(() => {
    persistCurrency(currency);
  }, [currency]);

  const setCurrency = useCallback((next: Currency) => {
    if (!CURRENCIES.includes(next)) return;
    persistCurrency(next);
    setCurrencyState(next);
  }, []);

  const format = useCallback((aed: number) => formatMoney(aed, currency), [currency]);

  const value = useMemo(
    () => ({ currency, setCurrency, format }),
    [currency, setCurrency, format],
  );

  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>;
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (!context) throw new Error("useCurrency must be used within CurrencyProvider");
  return context;
}
