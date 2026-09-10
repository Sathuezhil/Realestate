"use client";

import { FilterSidebar, SortSelect } from "@/components/listings/FilterSidebar";
import { PropertyCard } from "@/components/listings/PropertyCard";
import { RecentlyViewed } from "@/components/listings/RecentlyViewed";
import { ListingsMap } from "@/components/maps/MapLoaders";
import { Reveal } from "@/components/motion/Reveal";
import { useDebounce } from "@/hooks/useDebounce";
import { filtersToSearchParams, parseFilters } from "@/lib/utils";
import { type Property, type PropertyFilters, type SortOption } from "@/types";
import { LayoutGrid, Map } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";

export function ListingsClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const filters = useMemo(() => parseFilters(searchParams), [searchParams]);
  const view = searchParams.get("view") === "map" ? "map" : "grid";
  const [qInput, setQInput] = useState(filters.q ?? "");
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const debouncedQ = useDebounce(qInput, 400);

  const replaceParams = useCallback(
    (patch: PropertyFilters, nextView = view) => {
      const params = filtersToSearchParams(patch, nextView === "map" ? { view: "map" } : {});
      const query = params.toString();
      const nextUrl = query ? `/listings?${query}` : "/listings";
      const current = `${window.location.pathname}${window.location.search}`;
      if (current !== nextUrl) router.replace(nextUrl, { scroll: false });
    },
    [router, view],
  );

  useEffect(() => {
    const urlQ = searchParams.get("q") ?? "";
    if (urlQ !== qInput && urlQ !== debouncedQ) {
      setQInput(urlQ);
    }
    // Only adopt URL keyword when it is not the in-progress typed value.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  useEffect(() => {
    const nextQ = debouncedQ.trim() || undefined;
    if (nextQ === filters.q) return;
    replaceParams({ ...filters, q: nextQ });
  }, [debouncedQ, filters, replaceParams]);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    const query = filtersToSearchParams(filters).toString();
    fetch(`/api/properties?${query}`, { signal: controller.signal })
      .then((response) => response.json())
      .then((data: { properties?: Property[] }) => setProperties(data.properties ?? []))
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === "AbortError") return;
      })
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, [searchParams, filters]);

  function patch(next: Partial<PropertyFilters>) {
    replaceParams({ ...filters, ...next, q: debouncedQ.trim() || undefined });
  }

  function reset() {
    setQInput("");
    router.replace("/listings", { scroll: false });
  }

  function setView(next: "grid" | "map") {
    replaceParams(filters, next);
  }

  function setSort(sort: SortOption) {
    patch({ sort });
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <Reveal className="mb-8">
        <p className="text-xs uppercase tracking-[0.22em] text-gold-hover">Search</p>
        <h1 className="mt-2 font-serif text-4xl text-ink md:text-5xl">
          Available <span className="gold-shimmer">listings</span>
        </h1>
        <p className="mt-3 max-w-2xl text-ink-soft">
          Filter by community, budget, and the way you want to live. Share the URL to keep the same
          search.
        </p>
      </Reveal>

      <RecentlyViewed embedded />

      <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
        <FilterSidebar
          filters={filters}
          qInput={qInput}
          onQInput={setQInput}
          onChange={patch}
          onReset={reset}
        />

        <div>
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-muted">
              {loading ? "Searching..." : `${properties.length} homes`}
            </p>
            <div className="flex items-center gap-2">
              <SortSelect value={filters.sort ?? "newest"} onChange={setSort} />
              <div className="flex rounded-full border border-line bg-white p-1">
                <button
                  type="button"
                  onClick={() => setView("grid")}
                  className={`inline-flex h-9 w-9 items-center justify-center rounded-full ${
                    view === "grid" ? "bg-ink text-ivory" : "text-ink"
                  }`}
                  aria-label="Grid view"
                >
                  <LayoutGrid className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setView("map")}
                  className={`inline-flex h-9 w-9 items-center justify-center rounded-full ${
                    view === "map" ? "bg-ink text-ivory" : "text-ink"
                  }`}
                  aria-label="Map view"
                >
                  <Map className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {view === "map" ? (
            <ListingsMap properties={properties} />
          ) : loading ? (
            <div className="grid gap-6 sm:grid-cols-2">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="h-80 animate-pulse rounded-2xl bg-ivory-dark" />
              ))}
            </div>
          ) : properties.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-line px-6 py-16 text-center">
              <p className="font-serif text-2xl text-ink">No listings match these filters</p>
              <p className="mt-2 text-sm text-muted">Try a broader location or clear a few filters.</p>
              <button
                type="button"
                onClick={reset}
                className="mt-5 rounded-full bg-ink px-5 py-2 text-sm text-ivory"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2">
              {properties.map((property, index) => (
                <Reveal key={property.id} delay={Math.min(index, 6) * 70}>
                  <PropertyCard property={property} />
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
