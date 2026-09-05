"use client";

import { PRICE_RANGES } from "@/lib/utils";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

type PriceLabel = (typeof PRICE_RANGES)[number]["label"];

export function HeroSearch() {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [price, setPrice] = useState<PriceLabel>(PRICE_RANGES[0].label);
  const [type, setType] = useState("");

  function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    const params = new URLSearchParams();
    if (q.trim()) params.set("q", q.trim());
    if (type) params.set("type", type);
    const range = PRICE_RANGES.find((item) => item.label === price) ?? PRICE_RANGES[0];
    if (range.min != null) params.set("minPrice", String(range.min));
    if (range.max != null) params.set("maxPrice", String(range.max));
    router.push(`/listings${params.toString() ? `?${params}` : ""}`);
  }

  return (
    <form
      onSubmit={onSubmit}
      className="search-glow grid w-full gap-3 rounded-2xl bg-ivory p-3 md:grid-cols-[1.4fr_1fr_1fr_auto]"
    >
      <label className="block px-3 py-2">
        <span className="text-[11px] uppercase tracking-[0.18em] text-muted">Location</span>
        <input
          value={q}
          onChange={(event) => setQ(event.target.value)}
          placeholder="Community, area, or keyword"
          className="mt-1 w-full bg-transparent text-ink outline-none placeholder:text-muted/70"
        />
      </label>
      <label className="block border-line px-3 py-2 md:border-l">
        <span className="text-[11px] uppercase tracking-[0.18em] text-muted">Price range</span>
        <select
          value={price}
          onChange={(event) => {
            const next = PRICE_RANGES.find((range) => range.label === event.target.value);
            if (next) setPrice(next.label);
          }}
          className="mt-1 w-full bg-transparent text-ink outline-none"
        >
          {PRICE_RANGES.map((range) => (
            <option key={range.label} value={range.label}>
              {range.label}
            </option>
          ))}
        </select>
      </label>
      <label className="block border-line px-3 py-2 md:border-l">
        <span className="text-[11px] uppercase tracking-[0.18em] text-muted">Property type</span>
        <select
          value={type}
          onChange={(event) => setType(event.target.value)}
          className="mt-1 w-full bg-transparent text-ink outline-none"
        >
          <option value="">Any type</option>
          <option value="apartment">Apartment</option>
          <option value="villa">Villa</option>
          <option value="office">Office</option>
        </select>
      </label>
      <button
        type="submit"
        className="btn-shine inline-flex items-center justify-center gap-2 rounded-xl bg-ink px-6 py-4 text-sm font-medium text-ivory transition hover:bg-ink-soft"
      >
        <Search className="h-4 w-4" />
        Search
      </button>
    </form>
  );
}
