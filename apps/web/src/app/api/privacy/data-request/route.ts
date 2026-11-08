import { NextResponse } from "next/server";
import { privacyRequestSchema } from "@/features/privacy/lib/schemas";
import { forwardPublicPrivacyCall } from "@/lib/api/backend";

export async function POST(request: Request) {
  const payload = privacyRequestSchema.safeParse(await request.json().catch(() => null));
  if (!payload.success) {
    return NextResponse.json(
      { title: "Invalid privacy request", status: 400, errors: payload.error.flatten().fieldErrors },
      { status: 400, headers: { "cache-control": "no-store" } },
    );
  }

  return forwardPublicPrivacyCall("/api/privacy/data-request", {
    method: "POST",
    body: JSON.stringify(payload.data),
  });
}
