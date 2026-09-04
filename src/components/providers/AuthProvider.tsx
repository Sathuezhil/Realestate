"use client";

import { type AuthUser } from "@/types";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  refresh: () => Promise<void>;
  login: (email: string, password: string) => Promise<string | null>;
  register: (name: string, email: string, password: string) => Promise<string | null>;
  logout: () => Promise<void>;
  toggleFavorite: (propertyId: string) => Promise<{ saved: boolean } | { error: string }>;
  isFavorite: (propertyId: string) => boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({
  children,
  initialUser = null,
}: {
  children: React.ReactNode;
  initialUser?: AuthUser | null;
}) {
  const [user, setUser] = useState<AuthUser | null>(initialUser);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    const response = await fetch("/api/auth/me");
    const data = (await response.json()) as { user: AuthUser | null };
    setUser(data.user);
    setLoading(false);
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const login = useCallback(async (email: string, password: string) => {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = (await response.json()) as { user?: AuthUser; error?: string };
    if (!response.ok) return data.error ?? "Could not log in.";
    setUser(data.user ?? null);
    return null;
  }, []);

  const register = useCallback(async (name: string, email: string, password: string) => {
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });
    const data = (await response.json()) as { user?: AuthUser; error?: string };
    if (!response.ok) return data.error ?? "Could not create account.";
    setUser(data.user ?? null);
    return null;
  }, []);

  const logout = useCallback(async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
  }, []);

  const toggleFavorite = useCallback(async (propertyId: string) => {
    const response = await fetch("/api/favorites", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ propertyId }),
    });
    const data = (await response.json()) as { favoriteIds?: string[]; saved?: boolean; error?: string };
    if (!response.ok) return { error: data.error ?? "Please log in to save listings." };
    setUser((current) =>
      current && data.favoriteIds
        ? { ...current, favoriteIds: data.favoriteIds }
        : current,
    );
    return { saved: Boolean(data.saved) };
  }, []);

  const isFavorite = useCallback(
    (propertyId: string) => Boolean(user?.favoriteIds.includes(propertyId)),
    [user],
  );

  const value = useMemo(
    () => ({ user, loading, refresh, login, register, logout, toggleFavorite, isFavorite }),
    [user, loading, refresh, login, register, logout, toggleFavorite, isFavorite],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
