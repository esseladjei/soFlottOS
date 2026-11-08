"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAppContent } from "@/i18n/locale-provider";

export function NotFoundCard() {
  const t = useAppContent().notFound;

  return (
    <Card className="max-w-2xl">
      <CardContent className="space-y-6 p-8 text-center">
        <Badge variant="warning">{t.badge}</Badge>
        <div className="space-y-3">
          <h1 className="text-3xl font-bold text-stone-900">{t.title}</h1>
          <p className="text-sm leading-7 text-stone-600">{t.description}</p>
        </div>
        <Link className={buttonVariants({ size: "lg" })} href="/">
          {t.backHome}
        </Link>
      </CardContent>
    </Card>
  );
}
