"use client";

import { Analytics } from "@vercel/analytics/next";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { useCookieConsent } from "@/features/privacy/hooks/use-cookie-consent";
import { applyConsent } from "@/features/privacy/lib/trackers";

/**
 * The enforcement point: nothing optional is loaded unless this component has
 * seen a matching decision. It renders no visible UI.
 *
 * - While the decision is unknown (`undefined`) nothing happens at all.
 * - Without consent, tracker scripts are never added and known cookies are removed.
 * - With consent, the matching scripts are loaded once and every route change
 *   is reported with its path only.
 * - If a running technology is withdrawn, the page reloads so it truly stops.
 */
export function ConsentScripts() {
  const { consent } = useCookieConsent();
  const pathname = usePathname();

  useEffect(() => {
    if (consent === undefined) return;

    if (applyConsent(consent, pathname) === "reload") {
      window.location.reload();
    }
  }, [consent, pathname]);

  if (!consent?.analytics) return null;

  return (
    <Analytics
      beforeSend={(event) => {
        // Share the path only; query strings and fragments can carry tokens or personal data.
        const url = new URL(event.url);
        url.search = "";
        url.hash = "";
        return { ...event, url: url.toString() };
      }}
    />
  );
}
