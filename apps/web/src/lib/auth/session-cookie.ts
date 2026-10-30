import { z } from "zod";
import { userRoles, type Session } from "@/types/api";

const sessionCookieSchema = z.object({
  userId: z.number().int().positive(),
  email: z.string().email(),
  fullName: z.string().min(1),
  role: z.enum(userRoles),
  token: z.string().min(1),
  expiresAtUtc: z.string().datetime({ offset: true }),
  clientId: z.number().int().positive().nullable().optional(),
});

export type SessionCookiePayload = z.infer<typeof sessionCookieSchema>;

function decodeBase64Url(value: string) {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");

  if (typeof Buffer !== "undefined") {
    return Buffer.from(padded, "base64").toString("utf8");
  }

  const binary = atob(padded);
  const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

function encodeBase64Url(value: string) {
  if (typeof Buffer !== "undefined") {
    return Buffer.from(value, "utf8").toString("base64url");
  }

  const bytes = new TextEncoder().encode(value);
  const binary = Array.from(bytes, (byte) => String.fromCharCode(byte)).join("");
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

export function decodeSessionCookieValue(value?: string | null): SessionCookiePayload | null {
  if (!value) {
    return null;
  }

  try {
    const raw = decodeBase64Url(value);
    const parsed = JSON.parse(raw);
    return sessionCookieSchema.parse(parsed);
  } catch {
    return null;
  }
}

export function encodeSessionCookieValue(session: SessionCookiePayload) {
  return encodeBase64Url(JSON.stringify(session));
}

export function toPublicSession(session: SessionCookiePayload): Session {
  return {
    userId: session.userId,
    email: session.email,
    fullName: session.fullName,
    role: session.role,
    expiresAtUtc: session.expiresAtUtc,
    clientId: session.clientId,
  };
}

export function isSessionExpired(expiresAtUtc: string) {
  return new Date(expiresAtUtc).getTime() <= Date.now();
}

export function hasValidSessionCookie(value?: string | null) {
  const session = decodeSessionCookieValue(value);
  return !!session && !isSessionExpired(session.expiresAtUtc);
}
