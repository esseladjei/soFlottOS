// ---------------------------------------------------------------------------
// Facts about the internal admin console. This app is not public, so it has no
// SEO or structured-data configuration.
// ---------------------------------------------------------------------------

const env = process.env;

export const siteConfig = {
  name: "soFlottOS Admin",
  shortName: "soFlott Admin",
  brand: "soFlott",
  companyName: "soFlott UG (haftungsbeschränkt)",
  description: "Internal administration console for soFlott UG (haftungsbeschränkt).",
  /** Origin of this admin app, e.g. https://admin.soflott.de */
  url: env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3001",
} as const;
