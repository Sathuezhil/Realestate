"use client";

import dynamic from "next/dynamic";
import { type Property } from "@/types";

const PropertyMapInner = dynamic(
  () => import("@/components/maps/Maps").then((mod) => mod.PropertyMap),
  { ssr: false, loading: () => <div className="h-[360px] rounded-2xl bg-ivory-dark" /> },
);

const ListingsMapInner = dynamic(
  () => import("@/components/maps/Maps").then((mod) => mod.ListingsMap),
  { ssr: false, loading: () => <div className="h-[70vh] rounded-2xl bg-ivory-dark" /> },
);

export function PropertyMap({ property }: { property: Property }) {
  return <PropertyMapInner property={property} />;
}

export function ListingsMap({ properties }: { properties: Property[] }) {
  return <ListingsMapInner properties={properties} />;
}
