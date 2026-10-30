import { handlePasswordRecovery } from "@/lib/auth/password-recovery";

export function POST(request: Request) {
  return handlePasswordRecovery(request, "forgot-password");
}
