import "server-only";
import { cookies } from "next/headers";
import type { NextRequest } from "next/server";
import { SESSION_COOKIE_NAME } from "@/lib/auth/constants";
import {
  decodeSessionCookieValue,
  encodeSessionCookieValue,
  isSessionExpired,
  toPublicSession,
  type SessionCookiePayload,
} from "@/lib/auth/session-cookie";

export function getSessionFromRequest(request: NextRequest): SessionCookiePayload | null {
  const session = decodeSessionCookieValue(request.cookies.get(SESSION_COOKIE_NAME)?.value);
  if (!session || isSessionExpired(session.expiresAtUtc)) {
    return null;
  }

  return session;
}

export async function getSession() {
  const cookieStore = await cookies();
  const session = decodeSessionCookieValue(cookieStore.get(SESSION_COOKIE_NAME)?.value);
  if (!session || isSessionExpired(session.expiresAtUtc)) {
    return null;
  }

  return toPublicSession(session);
}

export async function setSession(session: SessionCookiePayload) {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, encodeSessionCookieValue(session), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: new Date(session.expiresAtUtc),
  });
}

export async function clearSession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}
