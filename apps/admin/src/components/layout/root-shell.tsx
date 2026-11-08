import type { ReactNode } from "react";
import { DM_Sans, Nunito_Sans } from "next/font/google";
import { AppProviders } from "@/components/providers/app-providers";
import { LocaleProvider } from "@/i18n/locale-provider";
import type { Locale } from "@/i18n/config";
import "@/app/globals.css";

// ---------------------------------------------------------------------------
// The outermost HTML of every page.
//
// Rendered by the single root layout (`app/layout.tsx`). It publishes the
// language to every client component through `LocaleProvider`, which is where
// `useAppContent()` and `useFormatters()` get their data from.
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
          </LocaleProvider>
        </AppProviders>
      </body>
    </html>
  );
}
