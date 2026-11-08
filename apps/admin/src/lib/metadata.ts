import type { Metadata, Viewport } from "next";
import { siteConfig } from "@/lib/site";

// The admin console must never appear in search results or be shared publicly.
export const baseMetadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  robots: { index: false, follow: false, nocache: true },
  referrer: "no-referrer",
  icons: {
    icon: "/logo/soFlott_arrow.png",
    apple: "/logo/soFlott_arrow.png",
  },
};

export const baseViewport: Viewport = {
  colorScheme: "light",
  themeColor: "#ffffff",
};
