import { ListingsClient } from "@/components/listings/ListingsClient";
import { Suspense } from "react";

export const metadata = {
  title: "Listings",
};

export default function ListingsPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-7xl px-4 py-20 text-muted">Loading listings...</div>}>
      <ListingsClient />
    </Suspense>
  );
}
