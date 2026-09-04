"use client";

import { useAuth } from "@/components/providers/AuthProvider";
import { Heart } from "lucide-react";
import { useRouter } from "next/navigation";

export function FavoriteButton({ propertyId }: { propertyId: string }) {
  const { user, isFavorite, toggleFavorite } = useAuth();
  const router = useRouter();
  const saved = isFavorite(propertyId);

  async function onClick() {
    if (!user) {
      router.push(`/login?next=/listings/${propertyId}`);
      return;
    }
    await toggleFavorite(propertyId);
  }

  return (
    <button
      type="button"
      onClick={() => void onClick()}
      className="inline-flex items-center gap-2 rounded-full border border-line px-4 py-2 text-sm text-ink transition hover:border-gold"
    >
      <Heart className={`h-4 w-4 ${saved ? "heart-pop fill-gold text-gold" : ""}`} />
      {saved ? "Saved" : "Save listing"}
    </button>
  );
}
