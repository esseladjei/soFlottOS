import type { NextConfig } from "next";

const securityHeaders = [
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "X-Frame-Options",
    value: "DENY",
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(self)",
  },
  {
    key: "Cross-Origin-Opener-Policy",
    value: "same-origin",
  },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  compress: true,
  images: {
    formats: ["image/avif", "image/webp"],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
  // Permanent redirects keep old links and search results working:
  //   - pre-i18n root paths (/platform, /operations, /security)
  //   - the pre-division page structure (services, pricing, ...) which was
  //     replaced by /express and /digital (implementation brief v2.0).
  //   - the German short URLs of the legal pages (/datenschutz, /impressum, ...).
  async redirects() {
    const moved: [string, string][] = [
      ["services", "express"],
      ["industries", "express/direct-b2b-delivery"],
      ["pricing", "express/request-a-quote"],
      ["platform", "express/how-it-works"],
      ["security", "legal/privacy"],
    ];

    const legalShortUrls: [string, string][] = [
      ["datenschutz", "legal/privacy"],
      ["impressum", "legal/imprint"],
      ["agb", "legal/terms"],
      ["cookie-einstellungen", "legal/cookies"],
    ];

    return [
      { source: "/platform", destination: "/de/express/how-it-works", permanent: true },
      { source: "/operations", destination: "/de/express", permanent: true },
      { source: "/security", destination: "/de/legal/privacy", permanent: true },
      ...legalShortUrls.map(([from, to]) => ({
        source: `/${from}`,
        destination: `/de/${to}`,
        permanent: true,
      })),
      ...moved.map(([from, to]) => ({
        source: `/:locale(de|en)/${from}`,
        destination: `/:locale/${to}`,
        permanent: true,
      })),
    ];
  },
};

export default nextConfig;
