"use client";

import { Cookie } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { getPrivacyContent } from "@/content/privacy";
import { useCookieConsent } from "@/features/privacy/hooks/use-cookie-consent";
import { useLocale } from "@/i18n/locale-provider";
import { localePath } from "@/i18n/routes";
import { cn } from "@/lib/utils";

const solid = "bg-stone-900 text-white shadow-none hover:bg-stone-800";
const link = "font-bold text-stone-900 underline underline-offset-4 hover:text-orange-700";

/**
 * Asks for consent until the visitor has made a choice. It does not block the
 * page (visitors can still read the privacy policy and imprint), and "Accept
 * all" and "Necessary only" look and weigh exactly the same, so refusing is as
 * easy as agreeing.
 */
export function CookieBanner() {
  const locale = useLocale();
  const { banner } = getPrivacyContent(locale);
  const { consent, isSettingsOpen, openSettings, acceptAll, rejectOptional } = useCookieConsent();
  const pathname = usePathname();
  const ref = useRef<HTMLElement>(null);

  // The cookie page shows the full settings itself.
  const onCookiePage = pathname.endsWith("/legal/cookies");
  const visible = consent === null && !isSettingsOpen && !onCookiePage;

  useEffect(() => {
    if (visible) ref.current?.focus({ preventScroll: true });
  }, [visible]);

  if (!visible) return null;

  return (
    <section
      aria-describedby="cookie-banner-text"
      aria-label={banner.ariaLabel}
      className="fixed inset-x-0 bottom-0 z-50 p-3 outline-none sm:p-5"
      ref={ref}
      tabIndex={-1}
    >
      <div
        className={cn(
          "mx-auto max-h-[85dvh] max-w-5xl overflow-y-auto rounded-2xl border border-stone-200 bg-white p-5 shadow-2xl shadow-stone-900/20 sm:p-6",
          "motion-safe:animate-[cookie-rise_320ms_ease-out]",
        )}
      >
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:gap-8">
          <div className="flex min-w-0 flex-1 gap-4">
            <span aria-hidden className="hidden size-11 shrink-0 items-center justify-center rounded-xl bg-stone-900 text-white sm:flex">
              <Cookie className="size-5" />
            </span>
            <div className="min-w-0">
              <h2 className="font-[family-name:var(--font-display)] text-lg font-extrabold tracking-tight text-stone-950">
                {banner.title}
              </h2>
              <p className="mt-1.5 text-sm leading-6 text-stone-700" id="cookie-banner-text">
                {banner.text}{" "}
                <Link className={link} href={localePath(locale, "legal/privacy")}>
                  {banner.privacyLink}
                </Link>
                {" · "}
                <Link className={link} href={localePath(locale, "legal/cookies")}>
                  {banner.cookiesLink}
                </Link>
              </p>
            </div>
          </div>

          <div className="flex shrink-0 flex-col gap-2 sm:flex-row lg:flex-col xl:flex-row">
            <Button className={solid} onClick={rejectOptional}>
              {banner.rejectOptional}
            </Button>
            <Button className={solid} onClick={acceptAll}>
              {banner.acceptAll}
            </Button>
            <Button onClick={openSettings} variant="outline">
              {banner.customize}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
