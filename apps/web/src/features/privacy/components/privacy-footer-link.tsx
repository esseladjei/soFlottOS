"use client";

import { useCookieConsent } from "@/features/privacy/hooks/use-cookie-consent";

/** A button that looks like a footer link and reopens the cookie settings. */
export function PrivacyFooterLink({ label, className }: { label: string; className?: string }) {
  const { openSettings } = useCookieConsent();

  return (
    <button className={className} onClick={openSettings} type="button">
      {label}
    </button>
  );
}
