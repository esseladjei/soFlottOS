// ---------------------------------------------------------------------------
// The SHAPE of all marketing copy.
//
// Why a type? Because `de.ts` and `en.ts` must contain exactly the same fields.
// TypeScript now shows an error the moment a translation is missing, so the
// English site can never silently fall back to half-German pages.
//
// Nothing here is visual - these are plain words and numbers. The React
// components in `features/marketing` decide how the words are rendered.
// ---------------------------------------------------------------------------

import type { MarketingPage } from "@/i18n/routes";

/**
 * Icons are referenced by name instead of importing React components into the
 * content files. `features/marketing/components/icon.tsx` maps each name to a
 * real Lucide icon.
 */
export type IconName =
  | "alert"
  | "award"
  | "banknote"
  | "building"
  | "calendar"
  | "check"
  | "clock"
  | "euro"
  | "file"
  | "gavel"
  | "hospital"
  | "lock"
  | "mail"
  | "map"
  | "package"
  | "phone"
  | "printer"
  | "receipt"
  | "route"
  | "shield"
  | "signature"
  | "smartphone"
  | "sparkles"
  | "truck"
  | "wrench";

/** Title + description + keywords for one page, used by `generateMetadata`. */
export interface PageMeta {
  title: string;
  description: string;
  keywords: string[];
}

/**
 * A call-to-action link.
 * Use `page` for public marketing pages - the current language prefix is added
 * automatically, so you never hardcode "/de/..." in the copy.
 * Use `href` for fixed application paths such as "/login" or "/register".
 */
export interface LinkItem {
  label: string;
  page?: MarketingPage;
  href?: string;
}

export interface IconItem {
  icon: IconName;
  title: string;
  description: string;
}

/** One of the four customer groups from the marketing plan. */
export interface SegmentItem {
  icon: IconName;
  name: string;
  /** What hurts today, in their own words. */
  pain: string;
  /** Typical cargo we move for them. */
  cargo: string;
  /** The one-sentence sales hook. */
  hook: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface HomeContent {
  meta: PageMeta;
  hero: {
    eyebrow: string;
    headlineLead: string;
    headlineHighlight: string;
    subheadline: string;
    primaryCta: LinkItem;
    secondaryCta: LinkItem;
    bullets: string[];
    note: string;
    panel: {
      eyebrow: string;
      title: string;
      stats: { label: string; value: string; caption: string }[];
      liveLabel: string;
      liveValue: string;
      routeFrom: string;
      routeTo: string;
      routeSeparator: string;
    };
  };
  trustBar: { icon: IconName; label: string }[];
  comparison: {
    eyebrow: string;
    title: string;
    intro: string;
    columnOther: string;
    columnSoFlott: string;
    rows: { label: string; other: string; soFlott: string }[];
  };
  usps: {
    eyebrow: string;
    title: string;
    intro: string;
    items: (IconItem & { proof: string })[];
  };
  segments: {
    eyebrow: string;
    title: string;
    intro: string;
    painLabel: string;
    cargoLabel: string;
    items: SegmentItem[];
    cta: LinkItem;
  };
  cargo: {
    eyebrow: string;
    title: string;
    intro: string;
    groups: { icon: IconName; title: string; items: string[] }[];
    note: string;
  };
  process: {
    eyebrow: string;
    title: string;
    intro: string;
    steps: { title: string; description: string }[];
  };
  platform: {
    eyebrow: string;
    title: string;
    intro: string;
    items: IconItem[];
    cta: LinkItem;
  };
  pricing: {
    eyebrow: string;
    title: string;
    intro: string;
    points: IconItem[];
    example: {
      title: string;
      rows: { label: string; value: string }[];
      totalLabel: string;
      totalValue: string;
      note: string;
    };
    cta: LinkItem;
  };
  offer: {
    eyebrow: string;
    title: string;
    description: string;
    cta: LinkItem;
    note: string;
  };
  area: {
    eyebrow: string;
    title: string;
    intro: string;
    cities: string[];
    note: string;
  };
  faq: {
    eyebrow: string;
    title: string;
    intro: string;
    items: FaqItem[];
  };
  finalCta: {
    title: string;
    description: string;
    primaryCta: LinkItem;
    secondaryCta: LinkItem;
    phoneLabel: string;
  };
}

/** A sub-page (services, pricing, ...). Simpler than the home page on purpose. */
export interface SubPageContent {
  meta: PageMeta;
  eyebrow: string;
  title: string;
  intro: string;
  lead: string[];
  sections: {
    title: string;
    description: string;
    items: IconItem[];
  }[];
  highlights: string[];
  faq?: FaqItem[];
  cta: {
    title: string;
    description: string;
    primaryCta: LinkItem;
    secondaryCta: LinkItem;
  };
}

export interface MarketingContent {
  /** Short words reused in many places. */
  common: {
    skipToContent: string;
    languageLabel: string;
    phone: string;
    email: string;
    callNow: string;
    moreInfo: string;
    vatNote: string;
  };
  nav: {
    ariaLabel: string;
    items: { page: Exclude<MarketingPage, "home">; label: string }[];
    login: string;
    cta: string;
  };
  home: HomeContent;
  pages: {
    services: SubPageContent;
    industries: SubPageContent;
    pricing: SubPageContent;
    platform: SubPageContent;
    security: SubPageContent;
    contact: SubPageContent;
  };
  footer: {
    tagline: string;
    columns: {
      title: string;
      links: { page: MarketingPage; label: string }[];
    }[];
    contactTitle: string;
    serviceAreaTitle: string;
    serviceAreaText: string;
    legalNote: string;
    copyright: (year: number, company: string) => string;
  };
}
