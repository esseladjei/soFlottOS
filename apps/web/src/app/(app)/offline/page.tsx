import type { Metadata } from "next";
import { WifiOff } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getAppContent } from "@/content/app";
import { getRequestLocale } from "@/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = getAppContent(await getRequestLocale()).offline;

  return {
    title: t.metaTitle,
    description: t.metaDescription,
    robots: { index: false, follow: false },
  };
}

export default async function OfflinePage() {
  const t = getAppContent(await getRequestLocale()).offline;

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-10">
      <Card className="max-w-2xl">
        <CardContent className="space-y-6 p-8 text-center">
          <div className="mx-auto flex size-16 items-center justify-center rounded-3xl bg-orange-100 text-orange-600">
            <WifiOff className="size-8" />
          </div>
          <div className="space-y-3">
            <Badge variant="warning">{t.badge}</Badge>
            <h1 className="text-3xl font-bold text-stone-900">{t.title}</h1>
            <p className="text-sm leading-7 text-stone-600">{t.description}</p>
          </div>
          <div className="flex justify-center">
            <Link className={buttonVariants({ size: "lg" })} href="/">
              {t.backHome}
            </Link>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
