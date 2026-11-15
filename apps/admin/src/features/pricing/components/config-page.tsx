"use client";

import { Pencil, Plus } from "lucide-react";
import type { ReactNode } from "react";
import { EmptyState, LoadingState, PageHeader } from "@/components/layout/states";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppContent } from "@/i18n/locale-provider";

/**
 * Standard "list on the left, editor on the right" layout shared by every pricing configuration page.
 * `editing` is `undefined` (nothing open), `null` (create) or an entity (edit).
 */
export function ConfigPage<T extends { id: number }>({ title, description, intro, listTitle, items, isLoading, editing, onCreate, onEdit, renderRow, columns, editor, extra }: {
  title: string;
  description: string;
  intro?: ReactNode;
  listTitle: string;
  items: T[] | undefined;
  isLoading: boolean;
  editing: T | null | undefined;
  onCreate: () => void;
  onEdit: (item: T) => void;
  renderRow: (item: T) => ReactNode[];
  columns: string[];
  editor: ReactNode;
  extra?: ReactNode;
}) {
  const t = useAppContent().pricing.common;
  return (
    <div className="space-y-8">
      <PageHeader title={title} description={description} action={<Button onClick={onCreate}><Plus aria-hidden className="mr-2 size-4" />{t.newEntry}</Button>} />
      {intro}
      {extra}
      <div className={editing === undefined ? "" : "grid gap-6 xl:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]"}>
        <Card>
          <CardHeader><CardTitle>{listTitle}</CardTitle></CardHeader>
          <CardContent className="overflow-x-auto">
            {isLoading ? <LoadingState /> : null}
            {items && items.length === 0 ? <EmptyState title={t.noData} description="" /> : null}
            {items && items.length > 0 ? (
              <table className="w-full text-sm">
                <thead><tr className="border-b text-left text-xs uppercase tracking-wide text-stone-500">{columns.map((column) => <th key={column} className="py-2 pr-3 font-bold">{column}</th>)}<th /></tr></thead>
                <tbody>
                  {items.map((item) => (
                    <tr key={item.id} className="border-b last:border-b-0">
                      {renderRow(item).map((cell, index) => <td key={index} className="py-3 pr-3 align-top">{cell}</td>)}
                      <td className="py-3 text-right"><Button variant="outline" size="sm" onClick={() => onEdit(item)}><Pencil aria-hidden className="mr-1 size-3.5" />{t.edit}</Button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : null}
          </CardContent>
        </Card>
        {editing === undefined ? null : <div>{editor}</div>}
      </div>
    </div>
  );
}

export function ActiveBadge({ active }: { active: boolean }) {
  const t = useAppContent().pricing.common;
  return <Badge variant={active ? "success" : "neutral"}>{active ? t.active : t.inactive}</Badge>;
}

export function EditorCard({ title, children, onCancel, pending, submitLabel }: { title: string; children: ReactNode; onCancel: () => void; pending?: boolean; submitLabel: string }) {
  const t = useAppContent().pricing.common;
  return (
    <Card className="xl:sticky xl:top-6">
      <CardHeader><CardTitle>{title}</CardTitle></CardHeader>
      <CardContent className="space-y-5">
        {children}
        <div className="flex gap-3 border-t pt-5">
          <Button type="submit" disabled={pending}>{submitLabel}</Button>
          <Button type="button" variant="outline" onClick={onCancel}>{t.cancel}</Button>
        </div>
      </CardContent>
    </Card>
  );
}

/** Two-column key/value list for engine-derived numbers. */
export function DerivedList({ title, hint, rows }: { title: string; hint: string; rows: [string, string][] }) {
  return (
    <div className="rounded-xl bg-stone-50 p-4">
      <p className="text-xs font-bold uppercase tracking-wide text-stone-500">{title}</p>
      <p className="mt-1 text-xs text-stone-500">{hint}</p>
      <dl className="mt-3 grid gap-x-6 gap-y-1 text-sm sm:grid-cols-2">
        {rows.map(([label, value]) => <div key={label} className="flex justify-between gap-3 border-b border-stone-200/70 py-1 last:border-b-0"><dt className="text-stone-600">{label}</dt><dd className="font-semibold tabular-nums">{value}</dd></div>)}
      </dl>
    </div>
  );
}
