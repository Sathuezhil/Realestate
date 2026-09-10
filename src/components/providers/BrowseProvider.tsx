"use client";

import {
  COMPARE_KEY,
  MAX_COMPARE,
  MAX_RECENT,
  RECENT_KEY,
  parseIdList,
  pushRecentId,
} from "@/lib/browse";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

interface BrowseContextValue {
  ready: boolean;
  recentIds: string[];
  compareIds: string[];
  recordView: (id: string) => void;
  isCompared: (id: string) => boolean;
  toggleCompare: (id: string) => void;
  removeCompare: (id: string) => void;
  clearCompare: () => void;
}

const BrowseContext = createContext<BrowseContextValue | null>(null);

function writeIds(key: string, ids: string[]) {
  window.localStorage.setItem(key, JSON.stringify(ids));
}

export function BrowseProvider({ children }: { children: React.ReactNode }) {
  const [recentIds, setRecentIds] = useState<string[]>([]);
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setRecentIds(parseIdList(window.localStorage.getItem(RECENT_KEY), MAX_RECENT));
    setCompareIds(parseIdList(window.localStorage.getItem(COMPARE_KEY), MAX_COMPARE));
    setReady(true);
  }, []);

  useEffect(() => {
    function onStorage(event: StorageEvent) {
      if (event.key === RECENT_KEY) {
        setRecentIds(parseIdList(event.newValue, MAX_RECENT));
      }
      if (event.key === COMPARE_KEY) {
        setCompareIds(parseIdList(event.newValue, MAX_COMPARE));
      }
    }
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const recordView = useCallback((id: string) => {
    if (!id) return;
    setRecentIds((current) => {
      const next = pushRecentId(current, id);
      writeIds(RECENT_KEY, next);
      return next;
    });
  }, []);

  const isCompared = useCallback((id: string) => compareIds.includes(id), [compareIds]);

  const toggleCompare = useCallback((id: string) => {
    setCompareIds((current) => {
      if (current.includes(id)) {
        const next = current.filter((item) => item !== id);
        writeIds(COMPARE_KEY, next);
        return next;
      }
      if (current.length >= MAX_COMPARE) return current;
      const next = [...current, id];
      writeIds(COMPARE_KEY, next);
      return next;
    });
  }, []);

  const removeCompare = useCallback((id: string) => {
    setCompareIds((current) => {
      const next = current.filter((item) => item !== id);
      writeIds(COMPARE_KEY, next);
      return next;
    });
  }, []);

  const clearCompare = useCallback(() => {
    writeIds(COMPARE_KEY, []);
    setCompareIds([]);
  }, []);

  const value = useMemo(
    () => ({
      ready,
      recentIds,
      compareIds,
      recordView,
      isCompared,
      toggleCompare,
      removeCompare,
      clearCompare,
    }),
    [ready, recentIds, compareIds, recordView, isCompared, toggleCompare, removeCompare, clearCompare],
  );

  return <BrowseContext.Provider value={value}>{children}</BrowseContext.Provider>;
}

export function useBrowse() {
  const context = useContext(BrowseContext);
  if (!context) throw new Error("useBrowse must be used within BrowseProvider");
  return context;
}
