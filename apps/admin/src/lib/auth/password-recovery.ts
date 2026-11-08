import "server-only";
import { NextResponse } from "next/server";
import { z } from "zod";
import { isStrongPassword } from "@/features/auth/schemas";
import { BackendError, BackendUnavailableError, recoverPasswordAgainstBackend } from "@/lib/api/backend";
import { clearSession } from "@/lib/auth/session";

const forgotSchema = z.object({
  email: z.string().trim().max(255).email(),
  locale: z.enum(["en", "de"]).default("de"),
});
const resetSchema = z.object({
  token: z.string().length(64).regex(/^[A-F0-9]{64}$/),
  password: z.string().refine(isStrongPassword),
});

export async function handlePasswordRecovery(request: Request, action: "forgot-password" | "reset-password") {
  try {
    const body: unknown = await request.json();
    const parsed = action === "forgot-password" ? forgotSchema.safeParse(body) : resetSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ title: "Invalid recovery request", status: 400 }, { status: 400 });
    }
    await recoverPasswordAgainstBackend(action, parsed.data);
    if (action === "reset-password") await clearSession();
    return new NextResponse(null, { status: 204, headers: { "cache-control": "no-store" } });
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
    console.error("Password recovery request failed.", error);
    return NextResponse.json({ title: "Password recovery failed", status: 500 }, { status: 500 });
  }
}
