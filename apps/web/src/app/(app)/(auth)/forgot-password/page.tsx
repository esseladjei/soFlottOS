import type { Metadata } from "next";
import { getAppContent } from "@/content/app";
import { ForgotPasswordForm } from "@/features/auth/components/password-recovery-form";
import { getRequestLocale } from "@/i18n/server";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const t = getAppContent(await getRequestLocale()).auth.recovery;
  return { title: t.forgotTitle, robots: { index: false, follow: false }, referrer: "no-referrer" };
}

export default function ForgotPasswordPage() {
  return <main className="min-h-screen bg-gradient-to-br from-orange-50 via-stone-50 to-white px-4 py-10 md:px-8 lg:px-12"><ForgotPasswordForm /></main>;
}
