"use client";

import { ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { getPrivacyContent } from "@/content/privacy";
import { CookieCategory } from "@/features/privacy/components/cookie-category";
import { useCookieConsent } from "@/features/privacy/hooks/use-cookie-consent";
import {
  consentCategories,
  NO_CONSENT,
  optionalCategories,
  type ConsentChoices,
  type OptionalCategory,
} from "@/features/privacy/lib/consent-model";
import { useLocale } from "@/i18n/locale-provider";
import { localePath } from "@/i18n/routes";
import { cn } from "@/lib/utils";

const solid = "bg-stone-900 text-white shadow-none hover:bg-stone-800";

/**
 * The full consent form: one card per category plus the save / accept / reject
 * buttons. Used both inside the settings dialog and inline on the cookie page.
 * The switches start from the stored decision and stay off for anything the
 * visitor has not explicitly allowed yet.
 */
export function CookieSettingsPanel({
  variant,
  className,
}: {
  /** `dialog` is scrollable and has a sticky action bar on larger screens. */
  variant: "dialog" | "page";
  className?: string;
}) {
  const locale = useLocale();
  const content = getPrivacyContent(locale);
  const { settings } = content;
  const { consent, save, acceptAll, rejectOptional, closeSettings } = useCookieConsent();

  const [draft, setDraft] = useState<ConsentChoices>(() => (consent ? pick(consent) : NO_CONSENT));
  const toggle = (category: OptionalCategory, value: boolean) => setDraft((current) => ({ ...current, [category]: value }));

  const inDialog = variant === "dialog";
  const date = consent ? new Intl.DateTimeFormat(locale, { dateStyle: "long", timeStyle: "short" }).format(new Date(consent.updatedAt)) : "";

  return (
    <div className={className}>
      <div className={cn(inDialog && "px-5 py-5 sm:px-7")}>
        {inDialog ? (
          <div className="flex items-start gap-3 pr-8">
            <span aria-hidden className="mt-1 flex size-9 shrink-0 items-center justify-center rounded-xl bg-stone-900 text-white">
              <ShieldCheck className="size-5" />
            </span>
            <div>
              <h2 className="font-[family-name:var(--font-display)] text-xl font-extrabold tracking-tight text-stone-950">
                {settings.title}
              </h2>
              <p className="mt-1 text-sm leading-6 text-stone-600">{settings.intro}</p>
            </div>
          </div>
        ) : null}

        {consent === undefined ? null : (
          <p className={cn("rounded-xl bg-stone-100 px-4 py-3 text-sm leading-6 text-stone-700", inDialog && "mt-5")}>
            <span className="font-bold text-stone-900">{settings.statusTitle}: </span>
            {consent
              ? settings.statusSaved.replace("{date}", date).replace("{id}", consent.id.slice(0, 8))
              : settings.statusNone}
          </p>
        )}

        <div className={cn("space-y-3", consent === undefined ? "mt-5" : "mt-4")}>
          {consentCategories.map((category) => (
            <CookieCategory
              category={category}
              checked={category === "necessary" ? true : draft[category]}
              key={category}
              onChange={category === "necessary" ? undefined : (value) => toggle(category, value)}
              settings={settings}
              text={settings.categories[category]}
            />
          ))}
        </div>

        <p className="mt-4 text-sm leading-6 text-stone-600">{settings.refusalNote}</p>
        <p className="mt-2 text-sm leading-6 text-stone-600">{settings.withdrawalNote}</p>
        <p className="mt-2 text-sm">
          <Link
            className="font-bold text-stone-900 underline underline-offset-4 hover:text-orange-700"
            href={localePath(locale, "legal/privacy")}
            onClick={inDialog ? closeSettings : undefined}
          >
            {settings.privacyLink}
          </Link>
        </p>
      </div>

      <div
        className={cn(
          "flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:justify-end",
          inDialog ? "border-t border-stone-200 bg-white px-5 py-4 sm:sticky sm:bottom-0 sm:px-7" : "mt-6",
        )}
      >
        <Button className={solid} onClick={rejectOptional}>
          {settings.rejectOptional}
        </Button>
        <Button className={solid} onClick={acceptAll}>
          {settings.acceptAll}
        </Button>
        <Button onClick={() => save(draft)} variant="outline">
          {settings.save}
        </Button>
      </div>
    </div>
  );
}

function pick(choices: ConsentChoices): ConsentChoices {
  return Object.fromEntries(optionalCategories.map((category) => [category, choices[category]])) as ConsentChoices;
}
