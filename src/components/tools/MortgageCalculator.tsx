"use client";

import { PriceText } from "@/components/currency/PriceText";
import { WhatsAppIcon } from "@/components/media/WhatsAppIcon";
import { whatsappHref } from "@/lib/contact";
import { calculateMortgage, MORTGAGE_DEFAULTS } from "@/lib/mortgage";
import { formatNumber } from "@/lib/utils";
import { useMemo, useState } from "react";

const inputClass =
  "w-full rounded-xl border border-line bg-ivory px-3 py-2.5 text-sm outline-none focus:border-gold";

export function MortgageCalculator({
  defaultPrice = MORTGAGE_DEFAULTS.price,
  propertyTitle,
  variant = "card",
}: {
  defaultPrice?: number;
  propertyTitle?: string;
  variant?: "card" | "page";
}) {
  const [price, setPrice] = useState(Math.round(defaultPrice));
  const [downPercent, setDownPercent] = useState(MORTGAGE_DEFAULTS.downPercent);
  const [annualRate, setAnnualRate] = useState(MORTGAGE_DEFAULTS.annualRate);
  const [years, setYears] = useState(MORTGAGE_DEFAULTS.years);

  const result = useMemo(
    () => calculateMortgage({ price, downPercent, annualRate, years }),
    [price, downPercent, annualRate, years],
  );

  const wa = whatsappHref(
    propertyTitle
      ? `Hello Aurelia — I ran the calculator on ${propertyTitle}. About a ${downPercent}% down payment over ${years} years. Can we talk banks?`
      : `Hello Aurelia — I used the mortgage calculator (price around AED ${formatNumber(price)}). Can we talk banks?`,
  );

  return (
    <div className={variant === "page" ? "grid gap-8 lg:grid-cols-[1.1fr_0.9fr]" : "space-y-5"}>
      <form className="space-y-4" onSubmit={(event) => event.preventDefault()}>
        <label className="block">
          <span className="mb-1.5 block text-[11px] uppercase tracking-[0.16em] text-muted">Price (AED)</span>
          <input
            type="number"
            min={100000}
            step={50000}
            value={price}
            onChange={(event) => setPrice(Number(event.target.value) || 0)}
            className={inputClass}
          />
        </label>
        <label className="block">
          <span className="mb-1.5 flex justify-between text-[11px] uppercase tracking-[0.16em] text-muted">
            Down payment <span>{downPercent}%</span>
          </span>
          <input
            type="range"
            min={20}
            max={70}
            step={1}
            value={downPercent}
            onChange={(event) => setDownPercent(Number(event.target.value))}
            className="w-full accent-[#c4a574]"
          />
        </label>
        <label className="block">
          <span className="mb-1.5 flex justify-between text-[11px] uppercase tracking-[0.16em] text-muted">
            Interest <span>{annualRate.toFixed(2)}%</span>
          </span>
          <input
            type="range"
            min={2.5}
            max={8}
            step={0.01}
            value={annualRate}
            onChange={(event) => setAnnualRate(Number(event.target.value))}
            className="w-full accent-[#c4a574]"
          />
        </label>
        <label className="block">
          <span className="mb-1.5 flex justify-between text-[11px] uppercase tracking-[0.16em] text-muted">
            Term <span>{years} years</span>
          </span>
          <input
            type="range"
            min={5}
            max={25}
            step={1}
            value={years}
            onChange={(event) => setYears(Number(event.target.value))}
            className="w-full accent-[#c4a574]"
          />
        </label>
      </form>

      <div className="rounded-2xl border border-line bg-ivory p-5">
        <p className="text-[11px] uppercase tracking-[0.16em] text-gold-hover">Indicative monthly</p>
        <p className="mt-2 font-serif text-3xl text-ink sm:text-4xl">
          <PriceText aed={result.monthly} />
        </p>
        <p className="mt-1 text-sm text-muted">per month · {result.months} payments</p>
        <dl className="mt-5 space-y-2 text-sm">
          <Row label="Loan" aed={result.loan} />
          <Row label="Down payment" aed={result.downPayment} />
          <Row label="DLD 4%" aed={result.dldFee} />
          <Row label="Cash at transfer" aed={result.cashToComplete} />
          <Row label="Interest over term" aed={result.totalInterest} />
        </dl>
        <p className="mt-4 text-xs leading-5 text-muted">
          Banks set the final rate. DLD is 4% of the price, paid in cash. This is a guide, not an offer.
        </p>
        <a
          href={wa}
          className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#25D366] px-4 py-2 text-sm font-medium text-white"
        >
          <WhatsAppIcon className="h-4 w-4" />
          WhatsApp a specialist
        </a>
      </div>
    </div>
  );
}

function Row({ label, aed }: { label: string; aed: number }) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <dt className="text-muted">{label}</dt>
      <dd className="font-medium text-ink">
        <PriceText aed={aed} />
      </dd>
    </div>
  );
}
