import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { RoleShell } from "@/components/layout/role-shell";
import { getAppContent } from "@/content/app";
import { getRequestLocale } from "@/i18n/server";
import { getSession } from "@/lib/auth/session";
import type { UserRole } from "@/types/api";

export const dynamic = "force-dynamic";

function roleHome(role: UserRole) {
  return role === "Admin" ? "/admin" : role === "Client" ? "/client" : "/driver";
}

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const session = await getSession();
  if (!session) {
    redirect("/login?redirectTo=/admin");
  }
  if (session.role !== "Admin") {
    redirect(roleHome(session.role));
  }

  const { shell } = getAppContent(await getRequestLocale());

  return <RoleShell session={session} title={shell.admin.title} nav={[{ href: "/admin", label: shell.admin.nav.dashboard }, { href: "/admin/availability", label: shell.admin.nav.bookingAvailability }, { href: "/admin/clients", label: shell.admin.nav.clients }, { href: "/admin/drivers", label: shell.admin.nav.drivers }, { href: "/admin/invoices", label: shell.admin.nav.invoices }]}>{children}</RoleShell>;
}
