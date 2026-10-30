import type { ReactNode } from "react";
import { RootShell } from "@/components/layout/root-shell";
import { getRequestLocale } from "@/i18n/server";
import { baseMetadata, baseViewport } from "@/lib/metadata";

// ---------------------------------------------------------------------------
// Root layout for everything that is NOT the public website: the login and
// register screens plus the signed-in console for admins, clients and drivers.
//
// These URLs have no language segment ("/client/orders", not
// "/de/client/orders"), so the language comes from the `soflott_locale` cookie
// that the language switcher writes.
//
// Nothing in here should ever be indexed by Google, hence `robots: noindex`.
// ---------------------------------------------------------------------------

export const metadata = {
  ...baseMetadata,
  robots: { index: false, follow: false },
};

export const viewport = baseViewport;

export default async function AppRootLayout({ children }: Readonly<{ children: ReactNode }>) {
  const locale = await getRequestLocale();

  return <RootShell locale={locale}>{children}</RootShell>;
}
