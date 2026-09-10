"use client";

import { useCurrency } from "@/components/providers/CurrencyProvider";

export function PriceText({
  aed,
  className,
}: {
  aed: number;
  className?: string;
}) {
  const { format } = useCurrency();
  return <span className={className}>{format(aed)}</span>;
}
