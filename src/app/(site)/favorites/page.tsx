"use client";

import { PropertyCard } from "@/components/listings/PropertyCard";
import { useAuth } from "@/components/providers/AuthProvider";
import { type Property } from "@/types";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function FavoritesPage() {
  const { user, loading } = useAuth();
  const [properties, setProperties] = useState<Property[]>([]);
  const [fetching, setFetching] = useState(false);

  useEffect(() => {
    if (!user) {
      setProperties([]);
      return;
    }
    setFetching(true);
    fetch("/api/favorites")
      .then((response) => response.json())
      .then((data: { properties?: Property[] }) => setProperties(data.properties ?? []))
      .finally(() => setFetching(false));
  }, [user]);

  if (loading) {
    return <div className="mx-auto max-w-7xl px-4 py-20 text-muted">Loading...</div>;
  }

  if (!user) {
    return (
      <div className="mx-auto max-w-xl px-4 py-24 text-center">
        <h1 className="font-serif text-3xl text-ink sm:text-4xl">Save homes you love</h1>
        <p className="mt-3 text-ink-soft">Sign in to bookmark listings and return to them later.</p>
        <div className="mt-6 flex justify-center gap-3">
          <Link href="/login?next=/favorites" className="rounded-full bg-ink px-5 py-2.5 text-sm text-ivory">
            Sign in
          </Link>
          <Link href="/signup?next=/favorites" className="rounded-full border border-line px-5 py-2.5 text-sm">
            Create account
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="font-serif text-3xl text-ink sm:text-4xl">Your saved listings</h1>
      <p className="mt-2 text-sm text-muted">Signed in as {user.email}</p>
      {fetching ? (
        <p className="mt-10 text-muted">Loading saved homes...</p>
      ) : properties.length === 0 ? (
        <div className="mt-12 rounded-2xl border border-dashed border-line px-6 py-16 text-center">
          <p className="font-serif text-2xl">Nothing saved yet</p>
          <Link href="/listings" className="mt-4 inline-block text-sm underline">
            Browse listings
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {properties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      )}
    </div>
  );
}
