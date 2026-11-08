import type { ReactNode } from "react";
import { Analytics } from "@vercel/analytics/next";
import { DM_Sans, Nunito_Sans } from "next/font/google";
import { AppProviders } from "@/components/providers/app-providers";
import { ServiceWorkerRegistration } from "@/components/pwa/service-worker-registration";
import { LocaleProvider } from "@/i18n/locale-provider";
import type { Locale } from "@/i18n/config";
import "@/app/globals.css";

// ---------------------------------------------------------------------------
// The outermost HTML of every page.
//
// Next.js calls the topmost `layout.tsx` of a route a "root layout" and it is
// the only place where `<html>` and `<body>` may be rendered. This app has two
// root layouts (see `app/(app)/layout.tsx` and
// `app/(marketing)/[locale]/layout.tsx`) because the public website needs
// `<html lang="de">` or `<html lang="en">` depending on the URL, while the
// signed-in console is always English.
//
// To avoid copy/paste, both root layouts render this one component and only
// pass in the language. It also publishes that language to every client
// component through `LocaleProvider`, which is where `useAppContent()` and
// `useFormatters()` get their data from.
// ---------------------------------------------------------------------------

const sans = Nunito_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const display = DM_Sans({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

export function RootShell({ locale, children }: { locale: Locale; children: ReactNode }) {
  return (
    <html lang={locale} suppressHydrationWarning>
      <body
        className={`${sans.variable} ${display.variable} min-h-screen bg-stone-50 font-sans text-stone-900 antialiased`}
      >
        <AppProviders>
          <LocaleProvider locale={locale}>
            {children}
            <ServiceWorkerRegistration />
          </LocaleProvider>
        </AppProviders>
        <Analytics />
      </body>
    </html>
  );
}
