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
  // The public pages moved under a language prefix (/de, /en). These permanent
  // redirects keep old links and existing Google results working.
  async redirects() {
    return [
      { source: "/platform", destination: "/de/platform", permanent: true },
      { source: "/operations", destination: "/de/services", permanent: true },
      { source: "/security", destination: "/de/security", permanent: true },
    ];
  },
};

export default nextConfig;
