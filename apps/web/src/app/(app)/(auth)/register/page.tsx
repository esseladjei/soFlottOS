import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getAppContent } from "@/content/app";
import { RegisterForm } from "@/features/auth/components/register-form";
import { getRequestLocale } from "@/i18n/server";
import { getSession } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const t = getAppContent(await getRequestLocale());
  return { title: t.auth.register.metaTitle, robots: { index: false, follow: false } };
}

export default async function RegisterPage() {
  const session = await getSession();
  if (session) {
    redirect(session.role === "Client" ? "/client" : "/driver");
  }
  return <main className="min-h-screen bg-gradient-to-br from-orange-50 via-stone-50 to-white px-4 py-10 md:px-8 lg:px-12"><RegisterForm /></main>;
}
