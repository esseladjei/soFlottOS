import { NextResponse } from "next/server";
import { BackendError, BackendUnavailableError, registerClientAgainstBackend, registerDriverAgainstBackend } from "@/lib/api/backend";
import { setSession } from "@/lib/auth/session";
import { toPublicSession } from "@/lib/auth/session-cookie";
import type { RegisterClientRequest, RegisterDriverRequest } from "@/types/api";

type RegisterBody =
  | { role: "Client"; payload: RegisterClientRequest }
  | { role: "Driver"; payload: RegisterDriverRequest };

export function GET() {
  return NextResponse.json(
    { title: "Method not allowed", detail: "Use POST /api/auth/register to create an account.", status: 405 },
    { status: 405, headers: { allow: "POST" } },
  );
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as RegisterBody;
    const session = body.role === "Client"
      ? await registerClientAgainstBackend(body.payload)
      : await registerDriverAgainstBackend(body.payload);

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
      { title: "Registration failed", detail: "An unexpected error occurred while creating your account.", status: 500 },
      { status: 500 },
    );
  }
}
