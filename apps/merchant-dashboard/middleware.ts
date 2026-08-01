import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export default async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // 1. Always allow public pages & API endpoints without requiring Kinde Auth
  if (
    pathname === "/" ||
    pathname.startsWith("/docs") ||
    pathname.startsWith("/changelog") ||
    pathname.startsWith("/status") ||
    pathname.startsWith("/license") ||
    pathname.startsWith("/privacy") ||
    pathname.startsWith("/terms") ||
    pathname.startsWith("/checkout") ||
    pathname.startsWith("/api/")
  ) {
    return NextResponse.next();
  }

  // 2. If Kinde Auth credentials are not configured on Vercel environment, bypass auth check
  if (!process.env.KINDE_CLIENT_ID || !process.env.KINDE_ISSUER_URL) {
    return NextResponse.next();
  }

  // 3. Otherwise execute Kinde middleware for protected dashboard routes
  try {
    const { withAuth } = await import("@kinde-oss/kinde-auth-nextjs/middleware");
    const response = await withAuth(request, {
      isReturnToCurrentPage: true,
    });
    return response || NextResponse.next();
  } catch (error) {
    console.error("Middleware Kinde Auth error:", error);
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
