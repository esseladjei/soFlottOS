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

export default async function ClientLayout({ children }: { children: ReactNode }) {
  const session = await getSession();
  if (!session) {
    redirect("/login?redirectTo=/client");
  }
  if (session.role !== "Client") {
    redirect(roleHome(session.role));
  }

  const { shell } = getAppContent(await getRequestLocale());

  return <RoleShell session={session} title={shell.client.title} nav={[{ href: "/client", label: shell.client.nav.dashboard }, { href: "/client/new-order", label: shell.client.nav.newOrder }, { href: "/client/orders", label: shell.client.nav.orders }, { href: "/client/invoices", label: shell.client.nav.invoices }]}>{children}</RoleShell>;
}
