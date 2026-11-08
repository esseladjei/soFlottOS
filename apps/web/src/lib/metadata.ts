import type { Metadata, Viewport } from "next";
import { siteConfig } from "@/lib/site";

// ---------------------------------------------------------------------------
// Metadata that every page starts from: favicons, the web app manifest, the
// social sharing image and the default title/description.
//
// Next.js requires each root layout to export its own `metadata`, so both root
// layouts simply re-export the objects below. Individual marketing pages then
// override title, description, keywords, canonical URL and the hreflang
// alternates - see `features/marketing/lib/seo.ts`.
// ---------------------------------------------------------------------------

export const baseMetadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.brand} | Express & Digital`,
    template: `%s | ${siteConfig.brand}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  manifest: "/manifest.webmanifest",
  // Page-specific keywords live in the marketing content; these are generic.
  keywords: ["soFlott", "soFlott Express", "soFlott Digital", "B2B"],
  openGraph: {
    type: "website",
    siteName: siteConfig.brand,
    title: `${siteConfig.brand} | Express & Digital`,
    description: siteConfig.description,
    url: siteConfig.url,
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: `${siteConfig.brand} - Express & Digital`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.brand} | Express & Digital`,
    description: siteConfig.description,
    images: ["/twitter-image"],
  },
  // Helps Google understand that the site is aimed at a German audience.
  other: {
    "geo.region": `${siteConfig.address.country}-BY`,
    "geo.placename": siteConfig.serviceArea,
  },
  icons: {
    icon: "/logo/soFlott_arrow.png",
    apple: "/logo/soFlott_arrow.png",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: siteConfig.shortName,
  },
};

export const baseViewport: Viewport = {
  colorScheme: "light",
  themeColor: "#ffffff",
};
