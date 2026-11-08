import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { RoleShell } from "@/components/layout/role-shell";
import { getAppContent } from "@/content/app";
import { getRequestLocale } from "@/i18n/server";
import { getSession } from "@/lib/auth/session";
import type { UserRole } from "@/types/api";

export const dynamic = "force-dynamic";

function roleHome(role: UserRole) {
  return role === "Client" ? "/client" : "/driver";
}

export default async function DriverLayout({ children }: { children: ReactNode }) {
  const session = await getSession();
  if (!session) {
    redirect("/login?redirectTo=/driver");
  }
  if (session.role !== "Driver") {
    redirect(roleHome(session.role));
  }

  const { shell } = getAppContent(await getRequestLocale());

  return <RoleShell session={session} title={shell.driver.title} nav={[{ href: "/driver", label: shell.driver.nav.jobs }]}>{children}</RoleShell>;
}
