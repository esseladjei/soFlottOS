// ---------------------------------------------------------------------------
// The SHAPE of all marketing copy.
//
// `de.ts` and `en.ts` must both satisfy `MarketingContent`. Because `pages` is
// a `Record<MarketingPage, PageContent>`, adding a page to `i18n/routes.ts`
// makes the build fail until BOTH languages contain copy for it.
//
// Every page is a hero + an ordered list of typed content blocks + an optional
// closing call to action. The React components in `features/marketing` decide
// how each block kind looks; the content files only contain words.
//
// Content rules (from the implementation brief, section 4.7):
//   - no invented statistics, client logos, testimonials or certifications;
//   - no service promise (same-day, prices, areas) the owner has not confirmed;
//   - soFlott Express / soFlott Digital are divisions of soFlott UG.
// ---------------------------------------------------------------------------

import type { MarketingPage } from "@/i18n/routes";

/**
 * Icons are referenced by name; `features/marketing/components/icon.tsx` maps
 * each name to a Lucide icon so the copy files stay free of React imports.
 */
export type IconName =
  | "building"
  | "calendar"
  | "check"
  | "clipboard"
  | "clock"
  | "code"
  | "file"
  | "handshake"
  | "layers"
  | "lifebuoy"
  | "lock"
  | "mail"
  | "map"
  | "package"
  | "phone"
  | "plug"
  | "receipt"
  | "refresh"
  | "route"
  | "scale"
  | "search"
  | "shield"
  | "signature"
  | "truck"
  | "users"
  | "wrench";

/** Title + description (+ optional keywords) used by `generateMetadata`. */
export interface PageMeta {
  title: string;
  description: string;
  keywords?: string[];
}

/**
 * A call-to-action link.
 * `page` = public marketing page (language prefix added automatically).
 * `href` = fixed app path such as "/login" or "/register".
 * `query` = optional query string appended to `page`, e.g. "type=subcontracting".
 */
export interface LinkItem {
  label: string;
  page?: MarketingPage;
  href?: string;
  query?: string;
}

export interface IconItem {
  icon: IconName;
  title: string;
  description: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export type FormKind = "express-quote" | "digital-proposal" | "contact";

/** Content blocks, rendered in order by `MarketingPageView`. */
export type ContentBlock =
  /** Grid of icon cards. */
  | { kind: "cards"; eyebrow?: string; title: string; intro?: string; items: IconItem[] }
  /** Cards that link to other pages (division hubs, related services). */
  | {
      kind: "links";
      eyebrow?: string;
      title: string;
      intro?: string;
      items: (IconItem & { page: MarketingPage })[];
    }
  /** The two divisions, side by side (corporate pages). */
  | {
      kind: "divisions";
      eyebrow?: string;
      title: string;
      intro?: string;
      items: {
        division: "express" | "digital";
        name: string;
        summary: string;
        points: string[];
        cta: LinkItem;
      }[];
    }
  /** Numbered steps. */
  | { kind: "steps"; eyebrow?: string; title: string; intro?: string; steps: { title: string; description: string }[] }
  /** Comparison table: one column per option, one row per criterion. */
  | {
      kind: "compare";
      eyebrow?: string;
      title: string;
      intro?: string;
      columns: string[];
      /** One value per column, in the same order. */
      rows: { label: string; values: string[] }[];
      /** First link is rendered as the primary button. */
      ctas?: LinkItem[];
    }
  /** Checklist. */
  | { kind: "checklist"; title: string; intro?: string; items: string[] }
  /**
   * Plain prose, optionally with sub-headed sections (legal pages, about).
   * `toc` (the contents heading) adds a linked table of contents and `numbered`
   * numbers the sections, so long policies can be cited ("see section 9").
   */
  | {
      kind: "text";
      title?: string;
      paragraphs: string[];
      sections?: { title: string; paragraphs: string[]; items?: string[]; links?: LinkItem[] }[];
      toc?: string;
      numbered?: boolean;
    }
  /** Highlighted note, e.g. what we do not promise or what must be agreed. */
  | { kind: "notice"; title: string; text: string }
  /** Frequently asked questions (also emitted as FAQPage JSON-LD). */
  | { kind: "faq"; title: string; intro?: string; items: FaqItem[] }
  /** Enquiry form. */
  | { kind: "form"; form: FormKind; title: string; intro?: string }
  /** Contact details card for the page's division. */
  | { kind: "contact"; title: string; intro?: string }
  /** Legal identity table, filled from `siteConfig` (imprint). */
  | { kind: "imprint"; title: string }
  /** The full cookie settings (privacy preferences), shown inline on the cookie page. */
  | { kind: "cookieSettings" }
  /** GDPR data-subject request form with a status lookup. */
  | { kind: "privacyRequest" };

export interface PageContent {
  /** Short name used in navigation, breadcrumbs and the footer. */
  label: string;
  meta: PageMeta;
  hero: {
    eyebrow: string;
    title: string;
    intro: string;
    primaryCta?: LinkItem;
    secondaryCta?: LinkItem;
    points?: string[];
  };
  blocks: ContentBlock[];
  cta?: {
    title: string;
    description: string;
    primaryCta: LinkItem;
    secondaryCta?: LinkItem;
  };
}

/** Labels shared by every form field. */
interface FieldText {
  label: string;
  hint?: string;
}

export interface FormsContent {
  required: string;
  optional: string;
  submit: string;
  submitting: string;
  successTitle: string;
  /** `{email}` is replaced with the receiving address. */
  successText: string;
  privacyConsent: string;
  privacyLink: string;
  errors: {
    required: string;
    email: string;
    consent: string;
    summary: string;
  };
  fields: {
    company: FieldText;
    name: FieldText;
    email: FieldText;
    phone: FieldText;
    country: FieldText;
    message: FieldText;
    topic: FieldText;
    pickup: FieldText;
    delivery: FieldText;
    date: FieldText;
    shipment: FieldText;
    area: FieldText;
    volume: FieldText;
    startDate: FieldText;
    engagement: FieldText;
    timeline: FieldText;
    budget: FieldText;
    stops: FieldText;
    schedule: FieldText;
  };
  expressQuote: {
    typeLegend: string;
    types: { direct: string; routes: string; subcontracting: string };
    engagementOptions: string[];
    subject: { direct: string; routes: string; subcontracting: string };
  };
  digitalProposal: {
    engagementOptions: string[];
    subject: string;
  };
  contact: {
    topicOptions: { express: string; digital: string; general: string };
    subject: string;
  };
}

export interface MarketingContent {
  common: {
    skipToContent: string;
    languageLabel: string;
    breadcrumbLabel: string;
    phone: string;
    email: string;
    address: string;
    divisionOf: string;
    legalDraft: string;
    toBeCompleted: string;
  };
  nav: {
    ariaLabel: string;
    menuLabel: string;
    items: MarketingPage[];
    login: string;
    cta: LinkItem;
  };
  /** Sub-navigation shown inside each division. */
  divisions: Record<
    "express" | "digital",
    { name: string; tagline: string; ariaLabel: string; items: MarketingPage[]; cta: LinkItem }
  >;
  pages: Record<MarketingPage, PageContent>;
  forms: FormsContent;
  imprint: {
    company: string;
    address: string;
    managingDirectors: string;
    register: string;
    vatId: string;
    contact: string;
    divisions: string;
  };
  footer: {
    tagline: string;
    columns: { title: string; links: MarketingPage[] }[];
    contactTitle: string;
    legalNote: string;
    copyright: (year: number, company: string) => string;
  };
}
