// ---------------------------------------------------------------------------
// One place for every fact about the business.
//
// These values appear in page titles, in the footer, and - importantly - in the
// structured data (JSON-LD) that Google reads to build rich results and the
// local business panel.
//
// >>> REPLACE THE PLACEHOLDERS BELOW BEFORE GOING LIVE. <<<
// Anything can also be set through environment variables so you do not have to
// edit code for a deployment.
// ---------------------------------------------------------------------------

const env = process.env;

/** Accepts "soflott.de" or a full URL; empty or invalid values fall back. */
function resolveOrigin(value: string | undefined, fallback: string) {
  const raw = value?.trim();
  if (!raw) return fallback;
  try {
    return new URL(/^https?:\/\//i.test(raw) ? raw : `https://${raw}`).origin;
  } catch {
    return fallback;
  }
}

export const siteConfig = {
  /** Product / software name used inside the signed-in app. */
  name: "soFlottOS",
  shortName: "soFlottOS",
  /** Customer-facing brand used on the public website. */
  brand: "soFlott",
  /** Legal entity printed on invoices, in the imprint and in the footer. */
  companyName: "soFlott UG (haftungsbeschränkt)",

  description:
    "soFlott UG (haftungsbeschränkt): B2B courier and logistics services through soFlott Express, IT consulting and software engineering through soFlott Digital.",

  url: resolveOrigin(env.NEXT_PUBLIC_SITE_URL, "http://localhost:3000"),

  // --- Contact -------------------------------------------------------------
  // PLACEHOLDER: replace with the real number before launch.
  phone: env.NEXT_PUBLIC_CONTACT_PHONE || "+49 8233 8470743",
  email: env.NEXT_PUBLIC_CONTACT_EMAIL || "info@soflott.de",

  // --- Commercial divisions ------------------------------------------------
  // Brands / business units of the one legal entity above - NOT separate
  // companies. Inbox routing: express courier services -> dispatch@,
  // IT / software services -> digital@, everything else -> info@ (above).
  divisions: {
    express: {
      name: "soFlott Express",
      email: env.NEXT_PUBLIC_EXPRESS_EMAIL || "dispatch@soflott.de",
    },
    digital: {
      name: "soFlott Digital",
      email: env.NEXT_PUBLIC_DIGITAL_EMAIL || "digital@soflott.de",
    },
  },

  // --- Legal identity (Impressum) ------------------------------------------
  // OWNER DECISION: fill these from the commercial register entry before
  // launch. Empty values are shown as "to be completed" on /legal/imprint.
  legal: {
    managingDirectors: env.NEXT_PUBLIC_LEGAL_MANAGING_DIRECTORS ?? "Essel Adjei-Mensah",
    registerCourt: env.NEXT_PUBLIC_LEGAL_REGISTER_COURT ?? "",
    registerNumber: env.NEXT_PUBLIC_LEGAL_REGISTER_NUMBER ?? "",
    vatId: env.NEXT_PUBLIC_LEGAL_VAT_ID ?? "",
    /** Set to "true" once a legal adviser has reviewed imprint and privacy. */
    reviewed: env.NEXT_PUBLIC_LEGAL_REVIEWED === "true",
  },

  // --- Address (imprint + Organization structured data) --------------------
  address: {
    street: env.NEXT_PUBLIC_ADDRESS_STREET ?? "Mandichostr. 1a",
    postalCode: env.NEXT_PUBLIC_ADDRESS_POSTAL_CODE ?? "86504",
    city: env.NEXT_PUBLIC_ADDRESS_CITY ?? "Merching",
    country: env.NEXT_PUBLIC_ADDRESS_COUNTRY || "DE",
  },

  /**
   * Region named in metadata. OWNER DECISION: confirm the real Express service
   * area before launch (brief section 14).
   */
  serviceArea: env.NEXT_PUBLIC_SERVICE_AREA || "Augsburg, Mering and Munich",

  /** Social or directory profiles. Leave empty until the profiles exist. */
  sameAs: [] as string[],
} as const;

/** `tel:` links must not contain spaces or brackets. */
export const telHref = `tel:${siteConfig.phone.replace(/[^+\d]/g, "")}`;

export const expressMailtoHref = `mailto:${siteConfig.divisions.express.email}`;
export const digitalMailtoHref = `mailto:${siteConfig.divisions.digital.email}`;
export const mailtoHref = `mailto:${siteConfig.email}`;
