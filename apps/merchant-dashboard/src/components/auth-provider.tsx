"use client";

import { KindeProvider } from "@kinde-oss/kinde-auth-nextjs";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // Skip Kinde auth when env vars aren't configured (local dev without auth provider)
  const isKindeConfigured =
    process.env.NEXT_PUBLIC_KINDE_CLIENT_ID &&
    process.env.NEXT_PUBLIC_KINDE_ISSUER_URL;

  if (!isKindeConfigured) {
    // Return children without KindeProvider wrapper when not configured
    return <>{children}</>;
  }

  return <KindeProvider>{children}</KindeProvider>;
}
