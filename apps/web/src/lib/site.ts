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

export const siteConfig = {
  /** Product / software name used inside the signed-in app. */
  name: "soFlottOS",
  shortName: "soFlottOS",
  /** Customer-facing brand used on the public website. */
  brand: "soFlott",
  /** Legal entity printed on invoices and in the footer. */
  companyName: "soFlott UG (haftungsbeschränkt)",

  description:
    "soFlott. Schnell für Unternehmen. Regional B2B courier service around Augsburg, Mering and Munich with direct transport, digital proof of delivery and transparent fixed pricing.",

  url: env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",

  // --- Contact -------------------------------------------------------------
  // PLACEHOLDER: replace with the real number before launch.
  phone: env.NEXT_PUBLIC_CONTACT_PHONE ?? "+49 821 0000000",
  email: env.NEXT_PUBLIC_CONTACT_EMAIL ?? "dispatch@soflott.de",

  // --- Address (used by the LocalBusiness structured data) -----------------
  address: {
    street: env.NEXT_PUBLIC_ADDRESS_STREET ?? "",
    postalCode: env.NEXT_PUBLIC_ADDRESS_POSTAL_CODE ?? "",
    city: env.NEXT_PUBLIC_ADDRESS_CITY ?? "",
    country: env.NEXT_PUBLIC_ADDRESS_COUNTRY ?? "DE",
  },

  /** Rough centre of the service area; helps Google place the business. */
  geo: {
    latitude: Number(env.NEXT_PUBLIC_GEO_LAT ?? 48.3705),
    longitude: Number(env.NEXT_PUBLIC_GEO_LNG ?? 10.8978),
    /** Radius of the service area in metres. */
    radiusMeters: 75_000,
  },

  /** Region named in the copy and in `areaServed`. */
  serviceArea: env.NEXT_PUBLIC_SERVICE_AREA ?? "Augsburg, Mering and Munich",

  /** Shown as `openingHours` in structured data. Mo-Fr 07:00-19:00. */
  openingHours: {
    days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    opens: "07:00",
    closes: "19:00",
  },

  /** Google uses this as a rough price indicator in local results. */
  priceRange: "€€",

  /** Social or directory profiles. Leave empty until the profiles exist. */
  sameAs: [] as string[],
} as const;

/** `tel:` links must not contain spaces or brackets. */
export const telHref = `tel:${siteConfig.phone.replace(/[^+\d]/g, "")}`;

export const mailtoHref = `mailto:${siteConfig.email}`;
