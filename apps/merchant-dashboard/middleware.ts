import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export default async function middleware(request: NextRequest) {
  // Skip Kinde auth when not configured (e.g. Vercel deployments, local dev)
  if (!process.env.KINDE_CLIENT_ID || !process.env.KINDE_ISSUER_URL) {
    return NextResponse.next();
  }

  try {
    const { withAuth } = await import(
      "@kinde-oss/kinde-auth-nextjs/middleware"
    );
    const handler = withAuth({
      publicPaths: [
        "/",
        "/docs/*",
        "/changelog",
        "/status",
        "/license",
        "/privacy",
        "/terms",
        "/checkout/*",
        "/api/checkout/*",
        "/api/auth/*",
        "/api/health",
      ],
    }) as (request: NextRequest) => Promise<NextResponse>;
    return handler(request);
  } catch {
    // Kinde middleware failed to load — pass through all requests
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
  ],
};
