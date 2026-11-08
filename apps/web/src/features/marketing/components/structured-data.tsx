// ---------------------------------------------------------------------------
// JSON-LD structured data.
//
// Invisible to humans but read by search engines. It describes:
//   - the organisation (soFlott UG) and its two divisions (brands)
//   - the service offered on a division service page
//   - FAQ rich results and the breadcrumb trail
//
// Only facts that are actually configured in `siteConfig` are emitted - no
// invented opening hours, coordinates, ratings or price ranges.
// ---------------------------------------------------------------------------

import type { FaqItem } from "@/content/marketing/types";
import { absoluteUrl } from "@/features/marketing/lib/seo";
import type { Locale } from "@/i18n/config";
import { localePath, type MarketingPage } from "@/i18n/routes";
import { siteConfig } from "@/lib/site";

/** Renders one JSON-LD block. */
function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      // The content is our own static object, never user input. `<` is escaped
      // so no string can close the script tag early.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
      type="application/ld+json"
    />
  );
}

/** Stable ids so the different blocks can reference each other. */
const organizationId = `${siteConfig.url}#organization`;
const websiteId = `${siteConfig.url}#website`;

function postalAddress() {
  const { street, postalCode, city, country } = siteConfig.address;
  if (!street || !postalCode || !city) return {};
  return {
    address: {
      "@type": "PostalAddress",
      streetAddress: street,
      postalCode,
      addressLocality: city,
      addressCountry: country,
    },
  };
}

/** The company and its divisions. Rendered once per page in the locale layout. */
export function OrganizationJsonLd({ locale, description }: { locale: Locale; description: string }) {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Organization",
          "@id": organizationId,
          name: siteConfig.brand,
          legalName: siteConfig.companyName,
          description,
          url: absoluteUrl(localePath(locale)),
          logo: absoluteUrl("/logo/soFlott_arrow_nav.png"),
          email: siteConfig.email,
          telephone: siteConfig.phone,
          ...postalAddress(),
          brand: [
            {
              "@type": "Brand",
              name: siteConfig.divisions.express.name,
              url: absoluteUrl(localePath(locale, "express")),
            },
            {
              "@type": "Brand",
              name: siteConfig.divisions.digital.name,
              url: absoluteUrl(localePath(locale, "digital")),
            },
          ],
          ...(siteConfig.sameAs.length ? { sameAs: siteConfig.sameAs } : {}),
        }}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          "@id": websiteId,
          name: siteConfig.brand,
          url: absoluteUrl(localePath(locale)),
          inLanguage: locale,
          publisher: { "@id": organizationId },
        }}
      />
    </>
  );
}

/** Describes the service on a division service page. */
export function ServiceJsonLd({
  locale,
  page,
  name,
  description,
  brand,
  areaServed,
}: {
  locale: Locale;
  page: MarketingPage;
  name: string;
  description: string;
  brand: string;
  /** Plain-text area; omitted when the service is not region-bound. */
  areaServed?: string;
}) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "Service",
        name,
        serviceType: name,
        description,
        url: absoluteUrl(localePath(locale, page)),
        provider: { "@id": organizationId },
        brand: { "@type": "Brand", name: brand },
        ...(areaServed ? { areaServed } : {}),
      }}
    />
  );
}

/** Turns an FAQ block into FAQPage structured data. */
export function FaqJsonLd({ items }: { items: FaqItem[] }) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: items.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: { "@type": "Answer", text: item.answer },
        })),
      }}
    />
  );
}

/** "Home > soFlott Express > How it works" trail. */
export function BreadcrumbJsonLd({
  locale,
  items,
}: {
  locale: Locale;
  items: { page: MarketingPage; label: string }[];
}) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: items.map((item, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: item.label,
          item: absoluteUrl(localePath(locale, item.page)),
        })),
      }}
    />
  );
}
