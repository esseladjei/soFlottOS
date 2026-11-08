// ---------------------------------------------------------------------------
// Facts about the internal admin console. This app is not public, so it has no
// SEO or structured-data configuration.
// ---------------------------------------------------------------------------

const env = process.env;

/** Accepts "admin.soflott.de" or a full URL; empty or invalid values fall back. */
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
  name: "soFlottOS Admin",
  shortName: "soFlott Admin",
  brand: "soFlott",
  companyName: "soFlott UG (haftungsbeschränkt)",
  description: "Internal administration console for soFlott UG (haftungsbeschränkt).",
  /** Origin of this admin app, e.g. https://admin.soflott.de */
  url: resolveOrigin(env.NEXT_PUBLIC_SITE_URL, "http://localhost:3001"),
} as const;
