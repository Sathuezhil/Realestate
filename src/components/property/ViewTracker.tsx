"use client";

import { useBrowse } from "@/components/providers/BrowseProvider";
import { useEffect } from "react";

export function ViewTracker({ propertyId }: { propertyId: string }) {
  const { recordView } = useBrowse();

  useEffect(() => {
    recordView(propertyId);
  }, [propertyId, recordView]);

  return null;
}
