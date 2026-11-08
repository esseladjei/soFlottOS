import { NextResponse } from "next/server";
import { consentEvidenceSchema } from "@/features/privacy/lib/schemas";
import { forwardPublicPrivacyCall } from "@/lib/api/backend";

const invalid = () =>
  NextResponse.json({ title: "Invalid consent record", status: 400 }, { status: 400, headers: { "cache-control": "no-store" } });

// Stores the proof of a cookie decision. The browser sends no IP address or
// user agent of its own, and none is forwarded here.
export async function POST(request: Request) {
  const payload = consentEvidenceSchema.safeParse(await request.json().catch(() => null));
  if (!payload.success) {
    return invalid();
  }

  return forwardPublicPrivacyCall("/api/privacy/consent", {
    method: "POST",
    body: JSON.stringify(payload.data),
  });
}
