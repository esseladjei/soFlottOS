import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { RoleShell } from "@/components/layout/role-shell";
import { getAppContent } from "@/content/app";
import { getRequestLocale } from "@/i18n/server";
import { getSession } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

export default async function ConsoleLayout({ children }: { children: ReactNode }) {
  // Middleware already guards these routes; this is defence in depth.
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  const { shell } = getAppContent(await getRequestLocale());
  const nav = [
    { href: "/", label: shell.admin.nav.dashboard },
    { href: "/availability", label: shell.admin.nav.bookingAvailability },
    { href: "/clients", label: shell.admin.nav.clients },
    { href: "/drivers", label: shell.admin.nav.drivers },
    { href: "/invoices", label: shell.admin.nav.invoices },
  ];

  return <RoleShell session={session} title={shell.admin.title} nav={nav}>{children}</RoleShell>;
}
