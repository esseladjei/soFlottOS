"use client";

// ---------------------------------------------------------------------------
// The card shown on the global 404 page.
//
// The 404 page sits above both root layouts and must stay statically
// generated - if it read the language cookie on the server, every marketing
// page would turn into a server-rendered page and lose its SEO advantage.
// The language is therefore resolved in the browser instead: the page ships in
// German and switches on hydration if the visitor picked English before.
// ---------------------------------------------------------------------------

import Link from "next/link";
import { useSyncExternalStore } from "react";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getAppContent } from "@/content/app";
import { defaultLocale, isLocale, LOCALE_COOKIE_NAME, type Locale } from "@/i18n/config";

/** The cookie never changes while this page is open, so nothing to subscribe to. */
function subscribe() {
  return () => {};
}

function readLocaleCookie(): Locale {
  const match = document.cookie.match(new RegExp(`(?:^|; )${LOCALE_COOKIE_NAME}=([^;]*)`));
  const value = match?.[1];
  return isLocale(value) ? value : defaultLocale;
}

function serverLocale(): Locale {
  return defaultLocale;
}

export function NotFoundCard() {
  const locale = useSyncExternalStore(subscribe, readLocaleCookie, serverLocale);

  const t = getAppContent(locale).notFound;

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
