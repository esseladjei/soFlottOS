import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { RoleShell } from "@/components/layout/role-shell";
import type { NavGroup } from "@/components/layout/navigation";
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
  const nav: NavGroup[] = [
    {
      id: "operations",
      label: shell.admin.nav.operations,
      paths: ["/orders"],
      items: [
        { href: "/", label: shell.admin.nav.dashboard },
        { href: "/orders/new", label: shell.admin.nav.newOrder },
        { href: "/availability", label: shell.admin.nav.bookingAvailability },
      ],
    },
    {
      id: "people",
      label: shell.admin.nav.people,
      items: [
        { href: "/clients", label: shell.admin.nav.clients },
        { href: "/drivers", label: shell.admin.nav.drivers },
      ],
    },
    {
      id: "billing",
      label: shell.admin.nav.billing,
      items: [{ href: "/invoices", label: shell.admin.nav.invoices }],
    },
    {
      id: "pricing",
      label: shell.admin.nav.pricing,
      items: [
        { href: "/pricing", label: shell.admin.nav.pricingOverview },
        { href: "/pricing/costs", label: shell.admin.nav.pricingCosts },
        { href: "/pricing/vehicles", label: shell.admin.nav.pricingVehicles },
        { href: "/pricing/labour", label: shell.admin.nav.pricingLabour },
        { href: "/pricing/cost-profiles", label: shell.admin.nav.pricingCostProfiles },
        { href: "/pricing/profiles", label: shell.admin.nav.pricingProfiles },
        { href: "/pricing/simulator", label: shell.admin.nav.pricingSimulator },
        { href: "/pricing/audit", label: shell.admin.nav.pricingAudit },
      ],
    },
    {
      id: "help",
      label: shell.admin.nav.help,
      items: [{ href: "/help", label: shell.admin.nav.pricingGuide }],
    },
  ];

  return <RoleShell session={session} title={shell.admin.title} nav={nav}>{children}</RoleShell>;
}
