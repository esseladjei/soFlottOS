"use client";

import { Card, CardContent } from "@/components/ui/card";
import { useAppContent } from "@/i18n/locale-provider";

export function LoadingState({ label }: { label?: string }) {
  const t = useAppContent();

  return <div className="rounded-2xl border border-dashed border-stone-300 bg-white p-8 text-center text-stone-600">{label ?? t.common.loading}</div>;
}

export function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <Card>
      <CardContent className="p-8 text-center">
        <h3 className="font-[family-name:var(--font-display)] text-xl font-bold text-stone-900">{title}</h3>
        <p className="mt-2 text-sm text-stone-600">{description}</p>
      </CardContent>
    </Card>
  );
}

export function ErrorState({ message }: { message: string }) {
  return <div className="rounded-2xl border border-rose-200 bg-rose-50 p-5 text-sm text-rose-700">{message}</div>;
}

export function PageHeader({ title, description, action }: { title: string; description?: string; action?: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="text-sm font-bold uppercase tracking-[0.16em] text-orange-600">soFlottOS</p>
        <h1 className="mt-2 font-[family-name:var(--font-display)] text-3xl font-extrabold tracking-tight text-stone-950">{title}</h1>
        {description ? <p className="mt-2 max-w-2xl text-stone-600">{description}</p> : null}
      </div>
      {action ? <div>{action}</div> : null}
    </div>
  );
}
