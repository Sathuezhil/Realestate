"use client";

import { useBrowse } from "@/components/providers/BrowseProvider";
import { MAX_COMPARE } from "@/lib/browse";
import { cn } from "@/lib/utils";
import { Columns2 } from "lucide-react";

export function CompareToggle({
  propertyId,
  variant = "icon",
}: {
  propertyId: string;
  variant?: "icon" | "label";
}) {
  const { isCompared, compareIds, toggleCompare } = useBrowse();
  const selected = isCompared(propertyId);
  const full = !selected && compareIds.length >= MAX_COMPARE;

  function onClick(event: React.MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    if (full) return;
    toggleCompare(propertyId);
  }

  if (variant === "label") {
    return (
      <button
        type="button"
        onClick={onClick}
        disabled={full}
        aria-pressed={selected}
        title={full ? "Compare up to 3 homes" : selected ? "Remove from compare" : "Add to compare"}
        className={cn(
          "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition",
          selected
            ? "border-gold bg-gold/15 text-ink"
            : "border-line text-ink hover:border-gold disabled:opacity-40",
        )}
      >
        <Columns2 className="h-4 w-4" />
        {selected ? "In compare" : full ? "Compare full" : "Compare"}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={full}
      aria-pressed={selected}
      aria-label={selected ? "Remove from compare" : "Add to compare"}
      title={full ? "Compare up to 3 homes" : selected ? "Remove from compare" : "Add to compare"}
      className={cn(
        "inline-flex h-9 w-9 items-center justify-center rounded-full bg-ivory/95 text-ink transition hover:text-gold-hover disabled:opacity-40",
        selected && "bg-gold text-ink",
      )}
    >
      <Columns2 className="h-4 w-4" />
    </button>
  );
}
