"use client";

import Image, { type ImageProps } from "next/image";
import { useEffect, useState } from "react";

export const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80";

const DEAD_PHOTO_IDS: Record<string, string> = {
  "photo-1560185127-6a33939ba3e0": "photo-1556912173-3bb406ef7e77",
  "photo-1560185127-c37e0aa0cc6d": "photo-1600566753190-17f0baa2a6c3",
  "photo-1600047509807-ba8b31be01b2": "photo-1600607687939-ce8a6c25118c",
  "photo-1554995207-c18c203606cb": "photo-1502672260266-1c1ef2d93688",
  "photo-1497366754035-1c4baba81ce8": "photo-1497366811353-6870744d04b2",
  "photo-1616486338812-3dadae4b4ace": "photo-1560448204-e02f11c3d0e2",
};

export function resolveImageUrl(src?: string | null): string {
  if (!src?.trim()) return FALLBACK_IMAGE;
  let next = src.trim();
  for (const [dead, live] of Object.entries(DEAD_PHOTO_IDS)) {
    if (next.includes(dead)) next = next.replace(dead, live);
  }
  return next;
}

type Props = Omit<ImageProps, "src"> & { src?: string | null };

export function SmartImage({ src, alt, onError, ...props }: Props) {
  const resolved = resolveImageUrl(typeof src === "string" ? src : FALLBACK_IMAGE);
  const [current, setCurrent] = useState(resolved);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setCurrent(resolved);
    setFailed(false);
  }, [resolved]);

  return (
    <Image
      {...props}
      src={failed ? FALLBACK_IMAGE : current}
      alt={alt}
      unoptimized
      onError={(event) => {
        if (!failed) setFailed(true);
        onError?.(event);
      }}
    />
  );
}
