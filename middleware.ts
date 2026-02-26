import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("auth-token")?.value;
  const role = request.cookies.get("user-role")?.value;
  const path = request.nextUrl.pathname;

  // Define public routes
  const isPublicRoute = [
    "/",
    "/login",
    "/register",
    "/admin/login",
    "/admin/register",
  ].includes(path);

  // If no token and trying to access protected route
  if (!token && !isPublicRoute) {
    if (path.startsWith("/admin")) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // If token exists and trying to access public auth routes
  if (token && isPublicRoute && path !== "/") {
    if (role === "admin") {
      return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    } else if (role === "helper") {
      return NextResponse.redirect(new URL("/helper/dashboard", request.url));
    }
    return NextResponse.redirect(new URL("/customer/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
