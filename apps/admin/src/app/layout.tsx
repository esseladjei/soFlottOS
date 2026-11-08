import type { ReactNode } from "react";
import { RootShell } from "@/components/layout/root-shell";
import { getRequestLocale } from "@/i18n/server";
import { baseMetadata, baseViewport } from "@/lib/metadata";

// ---------------------------------------------------------------------------
// Root layout of the internal admin console. URLs have no language segment, so
// the language comes from the `soflott_locale` cookie that the language
// switcher writes. Nothing here may ever be indexed, hence `robots: noindex`.
// ---------------------------------------------------------------------------

export const metadata = baseMetadata;

export const viewport = baseViewport;

export default async function AdminRootLayout({ children }: Readonly<{ children: ReactNode }>) {
  const locale = await getRequestLocale();

  return <RootShell locale={locale}>{children}</RootShell>;
}
