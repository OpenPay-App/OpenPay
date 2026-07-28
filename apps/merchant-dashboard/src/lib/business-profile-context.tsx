"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { getBusinessProfile } from "./hyperswitch";
import type { BusinessProfile } from "./types";

interface BusinessProfileContextValue {
  profile: BusinessProfile | null;
  currency: string;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

const CACHE_KEY = "openpay_business_profile";

function readCache(): BusinessProfile | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function writeCache(profile: BusinessProfile): void {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(profile));
  } catch {
    // localStorage may be full or disabled
  }
}

const BusinessProfileContext = createContext<BusinessProfileContextValue>({
  profile: null,
  currency: "USD",
  loading: true,
  error: null,
  refresh: async () => {},
});

export function BusinessProfileProvider({ children }: { children: React.ReactNode }) {
  // Initialize from cache so currency/timezone are available immediately
  const [profile, setProfile] = useState<BusinessProfile | null>(() => readCache());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async () => {
    try {
      setError(null);
      const p = await getBusinessProfile();
      setProfile(p);
      writeCache(p);
    } catch (err) {
      // Keep cached profile if API fails — don't revert to null
      setError(err instanceof Error ? err.message : "Failed to load business profile");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return (
    <BusinessProfileContext.Provider
      value={{
        profile,
        currency: profile?.default_currency || "USD",
        loading,
        error,
        refresh: fetchProfile,
      }}
    >
      {children}
    </BusinessProfileContext.Provider>
  );
}

export function useBusinessProfile() {
  return useContext(BusinessProfileContext);
}
