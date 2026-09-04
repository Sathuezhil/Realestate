"use client";

import { STUDIO } from "@/lib/contact";
import { type Property } from "@/types";
import { useRouter } from "next/navigation";
import { useMemo, useState, type FormEvent } from "react";

const COMMUNITIES = [
  { area: "Palm Jumeirah", lat: 25.1184, lng: 55.1372 },
  { area: "Downtown Dubai", lat: 25.1972, lng: 55.2744 },
  { area: "Dubai Marina", lat: 25.0805, lng: 55.1403 },
  { area: "JBR", lat: 25.078, lng: 55.133 },
  { area: "Emirates Hills", lat: 25.068, lng: 55.172 },
  { area: "Dubai Hills", lat: 25.111, lng: 55.245 },
  { area: "Arabian Ranches", lat: 25.051, lng: 55.27 },
  { area: "DIFC", lat: 25.2108, lng: 55.2803 },
  { area: "Business Bay", lat: 25.185, lng: 55.265 },
  { area: "Bluewaters", lat: 25.079, lng: 55.12 },
  { area: "Al Barari", lat: 25.091, lng: 55.317 },
  { area: "JLT", lat: 25.069, lng: 55.145 },
];

const inputClass =
  "w-full rounded-xl border border-line bg-white px-3 py-2.5 text-sm outline-none focus:border-gold";

export function PropertyForm({ property }: { property?: Property }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const [area, setArea] = useState(property?.location.area ?? "Palm Jumeirah");
  const preset = useMemo(
    () => COMMUNITIES.find((item) => item.area === area),
    [area],
  );

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError("");
    const form = new FormData(event.currentTarget);
    const payload = {
      title: form.get("title"),
      description: form.get("description"),
      price: Number(form.get("price")),
      propertyType: form.get("propertyType"),
      bedrooms: Number(form.get("bedrooms")),
      bathrooms: Number(form.get("bathrooms")),
      areaSqft: Number(form.get("areaSqft")),
      furnished: form.get("furnished") === "on",
      status: form.get("status"),
      images: String(form.get("images") ?? ""),
      amenities: String(form.get("amenities") ?? ""),
      location: {
        area: String(form.get("area")),
        city: "Dubai",
        address: form.get("address"),
        lat: Number(form.get("lat")),
        lng: Number(form.get("lng")),
      },
      agent: {
        name: form.get("agentName"),
        phone: form.get("agentPhone"),
        email: form.get("agentEmail"),
      },
    };

    const path = property ? `/api/admin/properties/${property.id}` : "/api/admin/properties";
    const response = await fetch(path, {
      method: property ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = (await response.json()) as { error?: string };
    setPending(false);
    if (!response.ok) {
      setError(data.error ?? "Could not save listing.");
      return;
    }
    router.push("/admin/listings");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="max-w-3xl space-y-4 rounded-2xl border border-line bg-white p-6 shadow-[0_10px_40px_rgba(28,25,22,0.04)]">
      <label className="block text-sm">
        Title
        <input name="title" required defaultValue={property?.title} className={`mt-1 ${inputClass}`} />
      </label>
      <label className="block text-sm">
        Description
        <textarea
          name="description"
          required
          rows={6}
          defaultValue={property?.description}
          className={`mt-1 ${inputClass}`}
        />
      </label>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm">
          Price (AED)
          <input
            name="price"
            type="number"
            min={1}
            required
            defaultValue={property?.price}
            className={`mt-1 ${inputClass}`}
          />
        </label>
        <label className="block text-sm">
          Type
          <select name="propertyType" defaultValue={property?.propertyType ?? "villa"} className={`mt-1 ${inputClass}`}>
            <option value="villa">Villa</option>
            <option value="apartment">Apartment</option>
            <option value="office">Office</option>
          </select>
        </label>
        <label className="block text-sm">
          Bedrooms
          <input name="bedrooms" type="number" min={0} defaultValue={property?.bedrooms ?? 0} className={`mt-1 ${inputClass}`} />
        </label>
        <label className="block text-sm">
          Bathrooms
          <input name="bathrooms" type="number" min={0} defaultValue={property?.bathrooms ?? 0} className={`mt-1 ${inputClass}`} />
        </label>
        <label className="block text-sm">
          Size (sqft)
          <input name="areaSqft" type="number" min={1} required defaultValue={property?.areaSqft} className={`mt-1 ${inputClass}`} />
        </label>
        <label className="block text-sm">
          Status
          <select name="status" defaultValue={property?.status ?? "available"} className={`mt-1 ${inputClass}`}>
            <option value="available">Available</option>
            <option value="sold">Sold</option>
            <option value="rented">Rented</option>
          </select>
        </label>
      </div>
      <label className="inline-flex items-center gap-2 text-sm">
        <input name="furnished" type="checkbox" defaultChecked={property?.furnished} />
        Furnished
      </label>

      <label className="block text-sm">
        Community
        <select
          name="area"
          value={area}
          onChange={(event) => setArea(event.target.value)}
          className={`mt-1 ${inputClass}`}
        >
          {COMMUNITIES.map((item) => (
            <option key={item.area}>{item.area}</option>
          ))}
        </select>
      </label>
      <label className="block text-sm">
        Address
        <input name="address" required defaultValue={property?.location.address} className={`mt-1 ${inputClass}`} />
      </label>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm">
          Latitude
          <input
            name="lat"
            type="number"
            step="0.0001"
            required
            defaultValue={property?.location.lat ?? preset?.lat}
            key={`${area}-lat`}
            className={`mt-1 ${inputClass}`}
          />
        </label>
        <label className="block text-sm">
          Longitude
          <input
            name="lng"
            type="number"
            step="0.0001"
            required
            defaultValue={property?.location.lng ?? preset?.lng}
            key={`${area}-lng`}
            className={`mt-1 ${inputClass}`}
          />
        </label>
      </div>

      <label className="block text-sm">
        Image URLs (one per line)
        <textarea
          name="images"
          required
          rows={4}
          defaultValue={property?.images.join("\n")}
          placeholder="https://images.unsplash.com/..."
          className={`mt-1 ${inputClass}`}
        />
      </label>
      <label className="block text-sm">
        Amenities (comma separated)
        <input
          name="amenities"
          defaultValue={property?.amenities.join(", ")}
          placeholder="Pool, Parking, Gym"
          className={`mt-1 ${inputClass}`}
        />
      </label>

      <div className="grid gap-4 sm:grid-cols-3">
        <label className="block text-sm">
          Agent name
          <input name="agentName" required defaultValue={property?.agent.name ?? "Aurelia Studio"} className={`mt-1 ${inputClass}`} />
        </label>
        <label className="block text-sm">
          Agent phone
          <input name="agentPhone" required defaultValue={property?.agent.phone ?? STUDIO.phoneDisplay} className={`mt-1 ${inputClass}`} />
        </label>
        <label className="block text-sm">
          Agent email
          <input name="agentEmail" type="email" required defaultValue={property?.agent.email ?? STUDIO.email} className={`mt-1 ${inputClass}`} />
        </label>
      </div>

      {error ? <p className="text-sm text-red-700">{error}</p> : null}
      <button
        type="submit"
        disabled={pending}
        className="rounded-xl bg-ink px-5 py-3 text-sm text-ivory disabled:opacity-60"
      >
        {pending ? "Saving..." : property ? "Save listing" : "Publish listing"}
      </button>
    </form>
  );
}
