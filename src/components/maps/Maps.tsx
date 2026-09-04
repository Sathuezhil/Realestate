"use client";

import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import L from "leaflet";
import { type Property } from "@/types";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";
import "leaflet/dist/leaflet.css";

const pin = L.divIcon({
  className: "property-pin",
  html: "<span></span>",
  iconSize: [22, 22],
  iconAnchor: [11, 22],
});

export function PropertyMap({ property }: { property: Property }) {
  const { lat, lng } = property.location;
  return (
    <MapContainer
      center={[lat, lng]}
      zoom={14}
      scrollWheelZoom={false}
      className="h-[360px] w-full rounded-2xl"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={[lat, lng]} icon={pin}>
        <Popup>
          {property.location.area}, {property.location.city}
        </Popup>
      </Marker>
    </MapContainer>
  );
}

export function ListingsMap({ properties }: { properties: Property[] }) {
  const center = properties[0]
    ? [properties[0].location.lat, properties[0].location.lng] as [number, number]
    : ([25.2048, 55.2708] as [number, number]);

  return (
    <MapContainer center={center} zoom={12} scrollWheelZoom className="h-[70vh] w-full rounded-2xl">
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {properties.map((property) => (
        <Marker
          key={property.id}
          position={[property.location.lat, property.location.lng]}
          icon={pin}
        >
          <Popup>
            <div className="min-w-[160px]">
              <p className="font-medium">{property.title}</p>
              <p className="text-sm">{formatPrice(property.price)}</p>
              <Link href={`/listings/${property.id}`} className="text-sm underline">
                View details
              </Link>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
