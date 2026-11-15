import { NextResponse } from "next/server";
import { publicRegistrationSchema } from "@/features/auth/public-registration";
import { BackendError, BackendUnavailableError, registerClientAgainstBackend } from "@/lib/api/backend";
import { setSession } from "@/lib/auth/session";
import { toPublicSession } from "@/lib/auth/session-cookie";

export function GET() {
  return NextResponse.json(
    { title: "Method not allowed", detail: "Use POST /api/auth/register to create an account.", status: 405 },
    { status: 405, headers: { allow: "POST" } },
  );
}

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();
    const parsed = publicRegistrationSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ title: "Invalid registration request", status: 400 }, { status: 400 });
    }
    const session = await registerClientAgainstBackend(parsed.data.payload);

    await setSession(session);
    return NextResponse.json(toPublicSession(session));
  } catch (error) {
    if (error instanceof SyntaxError) {
      return NextResponse.json({ title: "Invalid JSON", status: 400 }, { status: 400 });
    }
    if (error instanceof BackendError) {
      return NextResponse.json(error.body, { status: error.status });
    }

    if (error instanceof BackendUnavailableError) {
      return NextResponse.json(error.problem, { status: error.problem.status ?? 503 });
    }

    console.error("Registration request failed.", error);
    return NextResponse.json(
      { title: "Registration failed", detail: "An unexpected error occurred while creating your account.", status: 500 },
      { status: 500 },
    );
  }
}
