// ---------------------------------------------------------------------------
// Texts of the cookie banner, the cookie settings and the data-request form.
//
// Both languages live in one place so that a legal edit is made once, next to
// its translation. The privacy POLICY itself is ordinary page content and lives
// in `content/marketing/{de,en}.ts`.
// ---------------------------------------------------------------------------

import type { CookieId } from "@/features/privacy/lib/privacy-config";
import type { ConsentCategory } from "@/features/privacy/lib/consent-model";

export interface CategoryContent {
  name: string;
  description: string;
  /** What the technology is used for. */
  purpose: string;
  /** Concrete examples, so the visitor knows what is meant. */
  examples: string;
}

export interface CookieContent {
  purpose: string;
  duration: string;
}

export type PrivacyRequestTypeKey = "Access" | "Deletion" | "Correction" | "Export" | "Restriction" | "Objection";
export type PrivacyRequestStatusKey = "Received" | "InProgress" | "Completed" | "Rejected";

export interface PrivacyContent {
  banner: {
    ariaLabel: string;
    title: string;
    text: string;
    acceptAll: string;
    rejectOptional: string;
    customize: string;
    privacyLink: string;
    cookiesLink: string;
  };
  settings: {
    title: string;
    intro: string;
    /** Label of the footer link and of any button that reopens the settings. */
    open: string;
    close: string;
    save: string;
    acceptAll: string;
    rejectOptional: string;
    alwaysActive: string;
    active: string;
    inactive: string;
    refusalNote: string;
    purposeLabel: string;
    examplesLabel: string;
    saved: string;
    reloadNote: string;
    statusTitle: string;
    statusNone: string;
    /** `{date}` and `{id}` are replaced. */
    statusSaved: string;
    withdrawalNote: string;
    privacyLink: string;
    categories: Record<ConsentCategory, CategoryContent>;
    cookies: {
      show: string;
      hide: string;
      none: string;
      thirdPartyNote: string;
      thirdParty: string;
      headers: { name: string; provider: string; purpose: string; duration: string };
      items: Record<CookieId, CookieContent>;
    };
  };
  request: {
    title: string;
    intro: string;
    types: Record<PrivacyRequestTypeKey, string>;
    fields: { type: string; email: string; name: string; message: string };
    hints: { email: string; name: string; message: string };
    consent: string;
    submit: string;
    submitting: string;
    successTitle: string;
    /** `{id}` and `{date}` are replaced. */
    successText: string;
    referenceLabel: string;
    dueLabel: string;
    again: string;
    errors: { email: string; type: string; message: string; server: string; rateLimited: string; unavailable: string };
    lookup: {
      title: string;
      intro: string;
      field: string;
      status: string;
      submit: string;
      submitting: string;
      statuses: Record<PrivacyRequestStatusKey, string>;
      notFound: string;
      invalid: string;
      error: string;
      due: string;
      completed: string;
      received: string;
    };
  };
}
