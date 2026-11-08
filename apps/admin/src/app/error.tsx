"use client";

import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAppContent } from "@/i18n/locale-provider";

export default function AppError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useAppContent().error;

  return (
    <main className="mx-auto flex min-h-[70vh] max-w-3xl items-center justify-center px-4 py-10">
      <Card className="w-full">
        <CardContent className="space-y-6 p-8">
          <div className="flex size-14 items-center justify-center rounded-3xl bg-rose-100 text-rose-600">
            <AlertTriangle className="size-7" />
          </div>
          <div className="space-y-3">
            <h1 className="text-3xl font-bold text-stone-900">{t.title}</h1>
            <p className="text-sm leading-7 text-stone-600">{t.description}</p>
            <p className="rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-500">
              {error.message}
            </p>
          </div>
          <Button onClick={reset}>{t.retry}</Button>
        </CardContent>
      </Card>
    </main>
  );
}
