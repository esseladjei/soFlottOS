// /manifest.webmanifest - makes the app installable on phones (PWA).

import type { MetadataRoute } from "next";
import { defaultLocale } from "@/i18n/config";
import { siteConfig } from "@/lib/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteConfig.name,
    short_name: siteConfig.shortName,
    description: siteConfig.description,
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#ffffff",
    icons: [
      {
        src: "/logo/soFlott_arrow.png",
        sizes: "1254x1254",
        type: "image/png",
        purpose: "any",
      },
    ],
    categories: ["business", "productivity", "navigation"],
    // German is the default language of the public site.
    lang: defaultLocale,
  };
}
