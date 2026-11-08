"use client";

import { Check, X } from "lucide-react";
import { useId } from "react";
import type { CategoryContent, PrivacyContent } from "@/content/privacy/types";
import { CookieTable } from "@/features/privacy/components/cookie-table";
import type { ConsentCategory } from "@/features/privacy/lib/consent-model";
import { cn } from "@/lib/utils";

interface CookieCategoryProps {
  category: ConsentCategory;
  text: CategoryContent;
  settings: PrivacyContent["settings"];
  /** Current switch position; ignored for the necessary category. */
  checked: boolean;
  onChange?: (checked: boolean) => void;
}

/** One consent category: its explanation, an on/off switch and the cookies behind it. */
export function CookieCategory({ category, text, settings, checked, onChange }: CookieCategoryProps) {
  const id = useId();
  const locked = category === "necessary";
  const on = locked || checked;
  const state = locked ? settings.alwaysActive : on ? settings.active : settings.inactive;

  return (
    <section
      aria-labelledby={`${id}-name`}
      className={cn(
        "rounded-2xl border p-4 transition-colors sm:p-5",
        on ? "border-stone-300 bg-white" : "border-stone-200 bg-stone-50/60",
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h3 className="font-[family-name:var(--font-display)] text-base font-extrabold text-stone-950" id={`${id}-name`}>
            {text.name}
          </h3>
          <p
            aria-live="polite"
            className={cn(
              "mt-1 inline-flex items-center gap-1 text-xs font-bold",
              on ? "text-emerald-700" : "text-stone-500",
            )}
          >
            {on ? <Check aria-hidden className="size-3.5" /> : <X aria-hidden className="size-3.5" />}
            {state}
          </p>
        </div>

        {locked ? null : (
          <button
            aria-checked={on}
            aria-describedby={`${id}-description`}
            aria-labelledby={`${id}-name`}
            className={cn(
              "relative inline-flex h-7 w-12 shrink-0 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/70 focus-visible:ring-offset-2",
              on ? "bg-emerald-600" : "bg-stone-300",
            )}
            onClick={() => onChange?.(!checked)}
            role="switch"
            type="button"
          >
            <span
              aria-hidden
              className={cn(
                "inline-block size-5 rounded-full bg-white shadow transition-transform motion-reduce:transition-none",
                on ? "translate-x-6" : "translate-x-1",
              )}
            />
          </button>
        )}
      </div>

      <p className="mt-3 text-sm leading-6 text-stone-700" id={`${id}-description`}>
        {text.description}
      </p>

      <dl className="mt-3 grid gap-x-4 gap-y-1 text-sm leading-6 sm:grid-cols-[auto_1fr]">
        <dt className="font-bold text-stone-900">{settings.purposeLabel}</dt>
        <dd className="text-stone-600">{text.purpose}</dd>
        <dt className="font-bold text-stone-900">{settings.examplesLabel}</dt>
        <dd className="text-stone-600">{text.examples}</dd>
      </dl>

      <CookieTable category={category} settings={settings} />
    </section>
  );
}
