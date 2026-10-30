import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE_NAME } from "@/lib/auth/constants";
import { decodeSessionCookieValue, isSessionExpired } from "@/lib/auth/session-cookie";
import {
  LOCALE_COOKIE_MAX_AGE,
  LOCALE_COOKIE_NAME,
  isLocale,
  matchLocale,
  type Locale,
} from "@/i18n/config";
import type { UserRole } from "@/types/api";

// ---------------------------------------------------------------------------
// Middleware runs BEFORE every matching page is rendered. It does two jobs:
//
//   1. Language:  sends "/" to "/de" or "/en" and remembers the language the
//                 visitor last looked at.
//   2. Access:    keeps signed-out visitors out of /admin, /client and /driver,
//                 and signed-in users away from /login and /register.
// ---------------------------------------------------------------------------

const roleHomes: Record<UserRole, string> = {
  Admin: "/admin",
  Client: "/client",
  Driver: "/driver",
};

function readSession(request: NextRequest) {
  const session = decodeSessionCookieValue(request.cookies.get(SESSION_COOKIE_NAME)?.value);
  if (!session || isSessionExpired(session.expiresAtUtc)) {
    return null;
  }
  return session;
}

function requiredRole(pathname: string): UserRole | null {
  if (pathname.startsWith("/admin")) return "Admin";
  if (pathname.startsWith("/client")) return "Client";
  if (pathname.startsWith("/driver")) return "Driver";
  return null;
}

/** First URL segment, e.g. "/de/pricing" -> "de". */
function pathLocale(pathname: string): Locale | null {
  const first = pathname.split("/")[1];
  return isLocale(first) ? first : null;
}

/**
 * Which language should this visitor see?
 * 1. the language they picked before (cookie)
 * 2. the language their browser asks for (Accept-Language)
 * 3. German
 */
function preferredLocale(request: NextRequest): Locale {
  const saved = request.cookies.get(LOCALE_COOKIE_NAME)?.value;
  if (isLocale(saved)) {
    return saved;
  }
  return matchLocale(request.headers.get("accept-language"));
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const session = readSession(request);

  // --- 1. Language ---------------------------------------------------------
  if (pathname === "/") {
    const locale = preferredLocale(request);
    const response = NextResponse.redirect(new URL(`/${locale}`, request.url));
    response.cookies.set(LOCALE_COOKIE_NAME, locale, {
      path: "/",
      maxAge: LOCALE_COOKIE_MAX_AGE,
      sameSite: "lax",
    });
    return response;
  }

  const urlLocale = pathLocale(pathname);

  // --- 2. Access control ---------------------------------------------------
  if (pathname === "/login" || pathname === "/register") {
    if (session) {
      return NextResponse.redirect(new URL(roleHomes[session.role], request.url));
    }
    return NextResponse.next();
  }

  const role = requiredRole(pathname);

  if (role) {
    if (!session) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirectTo", pathname + request.nextUrl.search);
      return NextResponse.redirect(loginUrl);
    }

    if (session.role !== role) {
      return NextResponse.redirect(new URL(roleHomes[session.role], request.url));
    }
  }

  const response = NextResponse.next();

  // Remember the language of the page that was actually opened, so a later
  // visit to "/" lands in the same language.
  if (urlLocale) {
    response.cookies.set(LOCALE_COOKIE_NAME, urlLocale, {
      path: "/",
      maxAge: LOCALE_COOKIE_MAX_AGE,
      sameSite: "lax",
    });
  }

  return response;
}

export const config = {
  // Run on every page request, but skip API routes, build assets and files
  // with an extension (images, icons, the service worker, ...).
  matcher: ["/((?!api|_next/static|_next/image|icons|.*\\..*).*)"],
};
