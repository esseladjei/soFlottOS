"use client";

import { Info } from "lucide-react";
import type { ReactNode } from "react";
import type { FieldCopy } from "@/content/app/pricing";
import { useAppContent } from "@/i18n/locale-provider";
import { cn } from "@/lib/utils";

/**
 * Label with an info icon. Hovering/focusing the icon shows the hint as a native tooltip and the
 * hint + example are also rendered under the field so the explanation works on touch devices.
 */
export function FieldLabel({ copy, htmlFor, optional }: { copy: FieldCopy; htmlFor?: string; optional?: boolean }) {
  const t = useAppContent().pricing.common;
  return (
    <label className="flex items-center gap-1.5 text-sm font-bold text-stone-800" htmlFor={htmlFor}>
      <span>{copy.label}</span>
      {optional ? <span className="text-xs font-normal text-stone-500">({t.optional})</span> : null}
      <span className="inline-flex" title={copy.hint} tabIndex={0} aria-label={copy.hint}>
        <Info aria-hidden className="size-4 text-stone-400 hover:text-orange-600" />
      </span>
    </label>
  );
}

export function FieldHelp({ copy, className }: { copy: FieldCopy; className?: string }) {
  const t = useAppContent().pricing.common;
  return (
    <p className={cn("text-xs leading-relaxed text-stone-500", className)}>
      {copy.hint}
      {copy.example ? <span className="block text-stone-400">{t.example}: {copy.example}</span> : null}
    </p>
  );
}

/** Label + control + hint/example + validation error, in one consistent block. */
export function Field({ copy, htmlFor, error, optional, children, className }: {
  copy: FieldCopy;
  htmlFor?: string;
  error?: string;
  optional?: boolean;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <FieldLabel copy={copy} htmlFor={htmlFor} optional={optional} />
      {children}
      {error ? <p className="text-sm text-rose-600">{error}</p> : <FieldHelp copy={copy} />}
    </div>
  );
}

/** Callout used for section-level explanations and worked examples. */
export function HintBox({ children, tone = "info" }: { children: ReactNode; tone?: "info" | "warning" }) {
  return (
    <div className={cn(
      "flex gap-3 rounded-xl border p-4 text-sm leading-relaxed",
      tone === "info" ? "border-orange-200 bg-orange-50 text-orange-900" : "border-amber-200 bg-amber-50 text-amber-900",
    )}>
      <Info aria-hidden className="mt-0.5 size-4 shrink-0" />
      <div>{children}</div>
    </div>
  );
}
