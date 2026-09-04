"use client";

import { type PropertyFilters, type PropertyType, type SortOption } from "@/types";
import { SlidersHorizontal } from "lucide-react";

interface FilterSidebarProps {
  filters: PropertyFilters;
  qInput: string;
  onQInput: (value: string) => void;
  onChange: (patch: Partial<PropertyFilters>) => void;
  onReset: () => void;
}

const types: Array<{ value: "" | PropertyType; label: string }> = [
  { value: "", label: "Any" },
  { value: "apartment", label: "Apartment" },
  { value: "villa", label: "Villa" },
  { value: "office", label: "Office" },
];

export function FilterSidebar({ filters, qInput, onQInput, onChange, onReset }: FilterSidebarProps) {
  return (
    <aside className="filter-enter rounded-2xl border border-line bg-white p-5">
      <div className="mb-5 flex items-center justify-between">
        <p className="inline-flex items-center gap-2 text-sm font-medium text-ink">
          <SlidersHorizontal className="h-4 w-4" />
          Filters
        </p>
        <button type="button" onClick={onReset} className="text-xs uppercase tracking-wide text-muted hover:text-ink">
          Reset
        </button>
      </div>

      <div className="space-y-5">
        <label className="block">
          <span className="mb-1.5 block text-[11px] uppercase tracking-[0.16em] text-muted">
            Location or keyword
          </span>
          <input
            value={qInput}
            onChange={(event) => onQInput(event.target.value)}
            placeholder="Marina, villa, Palm..."
            className="w-full rounded-xl border border-line bg-ivory px-3 py-2.5 text-sm outline-none focus:border-gold"
          />
        </label>

        <div>
          <p className="mb-2 text-[11px] uppercase tracking-[0.16em] text-muted">Property type</p>
          <div className="flex flex-wrap gap-2">
            {types.map((type) => (
              <button
                key={type.label}
                type="button"
                onClick={() => onChange({ propertyType: type.value || undefined })}
                className={`rounded-full px-3 py-1.5 text-xs ${
                  (filters.propertyType ?? "") === type.value
                    ? "bg-ink text-ivory"
                    : "border border-line text-ink-soft"
                }`}
              >
                {type.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <label className="block">
            <span className="mb-1.5 block text-[11px] uppercase tracking-[0.16em] text-muted">Min price</span>
            <input
              type="number"
              min={0}
              value={filters.minPrice ?? ""}
              onChange={(event) =>
                onChange({ minPrice: event.target.value ? Number(event.target.value) : undefined })
              }
              placeholder="AED"
              className="w-full rounded-xl border border-line bg-ivory px-3 py-2.5 text-sm outline-none focus:border-gold"
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-[11px] uppercase tracking-[0.16em] text-muted">Max price</span>
            <input
              type="number"
              min={0}
              value={filters.maxPrice ?? ""}
              onChange={(event) =>
                onChange({ maxPrice: event.target.value ? Number(event.target.value) : undefined })
              }
              placeholder="AED"
              className="w-full rounded-xl border border-line bg-ivory px-3 py-2.5 text-sm outline-none focus:border-gold"
            />
          </label>
        </div>

        <div>
          <p className="mb-2 text-[11px] uppercase tracking-[0.16em] text-muted">Bedrooms</p>
          <div className="flex flex-wrap gap-2">
            {[undefined, 1, 2, 3, 4].map((beds) => (
              <button
                key={String(beds)}
                type="button"
                onClick={() => onChange({ bedrooms: beds })}
                className={`rounded-full px-3 py-1.5 text-xs ${
                  filters.bedrooms === beds ? "bg-ink text-ivory" : "border border-line text-ink-soft"
                }`}
              >
                {beds ? `${beds}+` : "Any"}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <label className="block">
            <span className="mb-1.5 block text-[11px] uppercase tracking-[0.16em] text-muted">Min sqft</span>
            <input
              type="number"
              min={0}
              value={filters.minArea ?? ""}
              onChange={(event) =>
                onChange({ minArea: event.target.value ? Number(event.target.value) : undefined })
              }
              className="w-full rounded-xl border border-line bg-ivory px-3 py-2.5 text-sm outline-none focus:border-gold"
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-[11px] uppercase tracking-[0.16em] text-muted">Max sqft</span>
            <input
              type="number"
              min={0}
              value={filters.maxArea ?? ""}
              onChange={(event) =>
                onChange({ maxArea: event.target.value ? Number(event.target.value) : undefined })
              }
              className="w-full rounded-xl border border-line bg-ivory px-3 py-2.5 text-sm outline-none focus:border-gold"
            />
          </label>
        </div>

        <div>
          <p className="mb-2 text-[11px] uppercase tracking-[0.16em] text-muted">Furnishing</p>
          <div className="flex flex-wrap gap-2">
            {[
              { label: "Any", value: undefined },
              { label: "Furnished", value: true },
              { label: "Unfurnished", value: false },
            ].map((item) => (
              <button
                key={item.label}
                type="button"
                onClick={() => onChange({ furnished: item.value })}
                className={`rounded-full px-3 py-1.5 text-xs ${
                  filters.furnished === item.value ? "bg-ink text-ivory" : "border border-line text-ink-soft"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}

export function SortSelect({
  value,
  onChange,
}: {
  value: SortOption;
  onChange: (value: SortOption) => void;
}) {
  return (
    <select
      value={value}
      onChange={(event) => onChange(event.target.value as SortOption)}
      className="rounded-full border border-line bg-white px-3 py-2 text-sm text-ink outline-none"
    >
      <option value="newest">Newest first</option>
      <option value="price-asc">Price: low to high</option>
      <option value="price-desc">Price: high to low</option>
    </select>
  );
}
