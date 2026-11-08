import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getAppContent } from "@/content/app";
import { LoginForm } from "@/features/auth/components/login-form";
import { getRequestLocale } from "@/i18n/server";
import { getSession } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

interface LoginPageProps { searchParams: Promise<{ redirectTo?: string }>; }

export async function generateMetadata(): Promise<Metadata> {
  const t = getAppContent(await getRequestLocale());
  return { title: t.auth.login.metaTitle, robots: { index: false, follow: false } };
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const session = await getSession();
  if (session) {
    redirect("/");
  }
  const params = await searchParams;
  return <main className="min-h-screen bg-gradient-to-br from-orange-50 via-stone-50 to-white px-4 py-10 md:px-8 lg:px-12"><LoginForm redirectTo={params.redirectTo} showDemoAccounts={process.env.NODE_ENV !== "production"} /></main>;
}
