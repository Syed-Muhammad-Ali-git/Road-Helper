import { NextResponse, NextRequest } from "next/server";
import { publicRoutes } from "./app/utils/routes";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value || null;
  const { pathname } = req.nextUrl;

  // Static files and api routes bypass
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/favicon.ico") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  const isPublic = publicRoutes.includes(pathname);

  // Redirect to login if accessing protected route without token
  if (!token && !isPublic && pathname !== "/") {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  // Redirect to dashboard if accessing public route with token
  if (token && isPublic) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|favicon.ico|api|assets).*)"],
};
