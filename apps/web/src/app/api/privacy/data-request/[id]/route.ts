import { NextResponse } from "next/server";
import { privacyReferenceSchema } from "@/features/privacy/lib/schemas";
import { forwardPublicPrivacyCall } from "@/lib/api/backend";

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  if (!privacyReferenceSchema.safeParse(id).success) {
    return NextResponse.json({ title: "Invalid reference", status: 400 }, { status: 400, headers: { "cache-control": "no-store" } });
  }

  return forwardPublicPrivacyCall(`/api/privacy/data-request/${id}`, { method: "GET" });
}
