import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE_NAME } from "@/lib/auth/constants";
import { decodeSessionCookieValue, isAdminSession } from "@/lib/auth/session-cookie";

// ---------------------------------------------------------------------------
// The whole administration console is private. Middleware runs before every
// page and:
//
//   - sends visitors without a valid Admin session to /login?redirectTo=...
//   - sends signed-in admins away from /login to the dashboard.
//
// Password recovery stays reachable without a session. API route handlers
// enforce the same Admin check themselves (see `lib/api/backend.ts`).
// ---------------------------------------------------------------------------

const publicPaths = ["/login", "/forgot-password", "/reset-password"];

function isPublicPath(pathname: string) {
  return publicPaths.some((path) => pathname === path || pathname.startsWith(`${path}/`));
}

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const signedIn = isAdminSession(decodeSessionCookieValue(request.cookies.get(SESSION_COOKIE_NAME)?.value));

  if (pathname === "/login") {
    return signedIn ? NextResponse.redirect(new URL("/", request.url)) : NextResponse.next();
  }

  if (isPublicPath(pathname) || signedIn) {
    return NextResponse.next();
  }

  const loginUrl = new URL("/login", request.url);
  if (pathname !== "/") {
    loginUrl.searchParams.set("redirectTo", pathname + search);
  }
  const response = NextResponse.redirect(loginUrl);
  // Drop an expired or non-admin cookie so it is not sent again.
  response.cookies.delete(SESSION_COOKIE_NAME);
  return response;
}

export const config = {
  // Skip API routes, build assets and files with an extension (images, icons).
  matcher: ["/((?!api|_next/static|_next/image|icons|.*\\..*).*)"],
};
