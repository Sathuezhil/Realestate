export const CURRENCY_KEY = "aurelia-currency";

export const CURRENCIES = ["AED", "USD", "GBP", "INR"] as const;
export type Currency = (typeof CURRENCIES)[number];

/** Listing prices are stored in AED. These are indicative display rates. */
export const AED_TO: Record<Currency, number> = {
  AED: 1,
  USD: 1 / 3.6725,
  GBP: 1 / 4.68,
  INR: 23.5,
};

export function parseCurrency(value: string | undefined | null): Currency {
  return CURRENCIES.includes(value as Currency) ? (value as Currency) : "AED";
}

export function convertFromAed(aed: number, currency: Currency) {
  return aed * AED_TO[currency];
}

function compactMillions(value: number, prefix: string, locale: string) {
  if (value >= 1_000_000) {
    const millions = value / 1_000_000;
    const n = millions % 1 === 0 ? millions.toFixed(0) : millions.toFixed(2);
    return `${prefix}${n}M`;
  }
  return `${prefix}${Math.round(value).toLocaleString(locale)}`;
}

export function formatMoney(aed: number, currency: Currency = "AED") {
  const value = convertFromAed(aed, currency);
  if (currency === "AED") {
    return compactMillions(value, "AED ", "en-AE");
  }
  if (currency === "USD") {
    return compactMillions(value, "$", "en-US");
  }
  if (currency === "GBP") {
    return compactMillions(value, "£", "en-GB");
  }
  if (value >= 10_000_000) {
    const crores = value / 10_000_000;
    const n = crores % 1 === 0 ? crores.toFixed(0) : crores.toFixed(2);
    return `₹${n} Cr`;
  }
  if (value >= 100_000) {
    const lakhs = value / 100_000;
    const n = lakhs % 1 === 0 ? lakhs.toFixed(0) : lakhs.toFixed(1);
    return `₹${n} L`;
  }
  return `₹${Math.round(value).toLocaleString("en-IN")}`;
}
