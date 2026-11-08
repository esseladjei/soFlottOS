import type { NextRequest } from "next/server";
import { proxyRequestToBackend } from "@/lib/api/backend";

async function handleProxy(request: NextRequest, context: { params: Promise<{ segments: string[] }> }) {
  const { segments } = await context.params;
  return proxyRequestToBackend(request, segments);
}

export const GET = handleProxy;
export const POST = handleProxy;
export const PUT = handleProxy;
export const DELETE = handleProxy;
