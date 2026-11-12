"use client";

import { X } from "lucide-react";
import { useEffect, useRef } from "react";
import { getPrivacyContent } from "@/content/privacy";
import { CookieSettingsPanel } from "@/features/privacy/components/cookie-settings-panel";
import { useCookieConsent } from "@/features/privacy/hooks/use-cookie-consent";
import { useLocale } from "@/i18n/locale-provider";

/**
 * Modal that lets visitors change their cookie choice at any time. It uses the
 * native <dialog> element: the browser traps focus, closes on Escape and
 * returns focus to the button that opened it. The form inside is only mounted
 * while the dialog is open, so it always starts from the stored decision.
 */
export function CookieSettingsDialog() {
  const content = getPrivacyContent(useLocale()).settings;
  const { isSettingsOpen, closeSettings } = useCookieConsent();
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isSettingsOpen && !dialog.open) dialog.showModal();
    if (!isSettingsOpen && dialog.open) dialog.close();
  }, [isSettingsOpen]);

  useEffect(() => {
    if (!isSettingsOpen) return;

    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [isSettingsOpen]);

  return (
    <dialog
      aria-label={content.title}
      className="m-auto max-h-[calc(100dvh-1.5rem)] w-[calc(100%-1.5rem)] max-w-3xl overflow-y-auto overscroll-contain rounded-2xl border border-stone-200 bg-white p-0 text-stone-900 shadow-2xl backdrop:bg-stone-950/60 backdrop:backdrop-blur-sm"
      onClick={(event) => {
        if (event.target === event.currentTarget) closeSettings();
      }}
      onClose={closeSettings}
      ref={dialogRef}
    >
      {isSettingsOpen ? (
        <>
          <button
            aria-label={content.close}
            className="absolute right-3 top-3 z-10 inline-flex size-9 items-center justify-center rounded-full text-stone-500 hover:bg-stone-100 hover:text-stone-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/70"
            onClick={closeSettings}
            type="button"
          >
            <X aria-hidden className="size-5" />
          </button>
          <CookieSettingsPanel variant="dialog" />
        </>
      ) : null}
    </dialog>
  );
}
