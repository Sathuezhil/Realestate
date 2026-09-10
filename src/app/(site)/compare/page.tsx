import { CompareClient } from "@/components/listings/CompareClient";
import { type Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = { title: "Compare homes" };

export default function ComparePage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-7xl px-4 py-20 text-muted">Loading comparison...</div>}>
      <CompareClient />
    </Suspense>
  );
}
