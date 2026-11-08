import { NextResponse } from "next/server";
import { BackendError, BackendUnavailableError, loginAgainstBackend } from "@/lib/api/backend";
import { ADMIN_ROLE } from "@/lib/auth/constants";
import { setSession } from "@/lib/auth/session";
import { toPublicSession } from "@/lib/auth/session-cookie";
import type { LoginRequest } from "@/types/api";

export function GET() {
  return NextResponse.json(
    { title: "Method not allowed", detail: "Use POST /api/auth/login to create a console session.", status: 405 },
    { status: 405, headers: { allow: "POST" } },
  );
}

export async function POST(request: Request) {
  try {
    const credentials = (await request.json()) as LoginRequest;
    const session = await loginAgainstBackend(credentials);

    // Valid credentials for a client or driver still must not open the
    // internal console. No cookie is written for them.
    if (session.role !== ADMIN_ROLE) {
      return NextResponse.json(
        { title: "Admin access only", detail: "This console is restricted to soFlott administrators.", status: 403 },
        { status: 403 },
      );
    }

    await setSession(session);
    return NextResponse.json(toPublicSession(session));
  } catch (error) {
    if (error instanceof BackendError) {
      return NextResponse.json(error.body, { status: error.status });
    }

    if (error instanceof BackendUnavailableError) {
      return NextResponse.json(error.problem, { status: error.problem.status ?? 503 });
    }

    return NextResponse.json(
      { title: "Authentication failed", detail: "An unexpected error occurred while signing you in.", status: 500 },
      { status: 500 },
    );
  }
}
