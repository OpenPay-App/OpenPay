import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { withAuth } from "@kinde-oss/kinde-auth-nextjs/middleware";

const authHandler = withAuth({
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

export default async function middleware(request: NextRequest) {
  // Skip Kinde auth when credentials are missing or unconfigured
  if (!process.env.KINDE_CLIENT_ID || !process.env.KINDE_ISSUER_URL) {
    return NextResponse.next();
  }

  try {
    return await authHandler(request);
  } catch (err) {
    console.error("Middleware error:", err);
    return NextResponse.next();
  }
}

// Next.js 16 alias compatibility
export const proxy = middleware;

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
  ],
};
