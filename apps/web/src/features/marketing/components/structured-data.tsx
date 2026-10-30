// ---------------------------------------------------------------------------
// JSON-LD structured data.
//
// This is invisible to humans but read by Google. It powers:
//   - the local business panel (address, phone, opening hours, service area)
//   - FAQ rich results (the expandable questions under a search result)
//   - breadcrumb trails above a search result
//
// Each component renders a single <script type="application/ld+json"> tag.
// ---------------------------------------------------------------------------

import type { FaqItem } from "@/content/marketing/types";
import { absoluteUrl, languageAlternates } from "@/features/marketing/lib/seo";
import type { Locale } from "@/i18n/config";
import { localePath, type MarketingPage } from "@/i18n/routes";
import { siteConfig } from "@/lib/site";

/** Renders one JSON-LD block. */
function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      // The content is our own static object, never user input.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
      type="application/ld+json"
    />
  );
}

/** Stable ids so the different blocks can reference each other. */
const businessId = `${siteConfig.url}#business`;
const websiteId = `${siteConfig.url}#website`;

/**
 * Who we are and where we operate. Rendered once per page in the locale layout.
 */
export function BusinessJsonLd({ locale, description }: { locale: Locale; description: string }) {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "LocalBusiness",
          "@id": businessId,
          additionalType: "https://schema.org/CourierService",
          name: siteConfig.brand,
          legalName: siteConfig.companyName,
          description,
          url: absoluteUrl(localePath(locale)),
          telephone: siteConfig.phone,
          email: siteConfig.email,
          priceRange: siteConfig.priceRange,
          currenciesAccepted: "EUR",
          ...(siteConfig.address.street &&
          siteConfig.address.postalCode &&
          siteConfig.address.city
            ? {
                address: {
                  "@type": "PostalAddress",
                  streetAddress: siteConfig.address.street,
                  postalCode: siteConfig.address.postalCode,
                  addressLocality: siteConfig.address.city,
                  addressCountry: siteConfig.address.country,
                },
              }
            : {}),
          geo: {
            "@type": "GeoCoordinates",
            latitude: siteConfig.geo.latitude,
            longitude: siteConfig.geo.longitude,
          },
          areaServed: {
            "@type": "GeoCircle",
            geoMidpoint: {
              "@type": "GeoCoordinates",
              latitude: siteConfig.geo.latitude,
              longitude: siteConfig.geo.longitude,
            },
            geoRadius: siteConfig.geo.radiusMeters,
          },
          openingHoursSpecification: [
            {
              "@type": "OpeningHoursSpecification",
              dayOfWeek: siteConfig.openingHours.days,
              opens: siteConfig.openingHours.opens,
              closes: siteConfig.openingHours.closes,
            },
          ],
          sameAs: siteConfig.sameAs,
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
          publisher: { "@id": businessId },
        }}
      />
    </>
  );
}

/** Describes the courier service itself, so Google can match service queries. */
export function ServiceJsonLd({
  locale,
  name,
  description,
}: {
  locale: Locale;
  name: string;
  description: string;
}) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "Service",
        serviceType: name,
        name,
        description,
        provider: { "@id": businessId },
        areaServed: siteConfig.serviceArea.split(",").map((city) => ({
          "@type": "City",
          name: city.trim(),
        })),
        availableChannel: {
          "@type": "ServiceChannel",
          serviceUrl: absoluteUrl(localePath(locale, "pricing")),
          servicePhone: siteConfig.phone,
        },
      }}
    />
  );
}

/** Turns the FAQ section into Google's expandable question results. */
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

/** "Home > Pricing" trail shown above the search result. */
export function BreadcrumbJsonLd({
  locale,
  homeLabel,
  page,
  pageLabel,
}: {
  locale: Locale;
  homeLabel: string;
  page: MarketingPage;
  pageLabel: string;
}) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: homeLabel,
            item: absoluteUrl(localePath(locale)),
          },
          {
            "@type": "ListItem",
            position: 2,
            name: pageLabel,
            item: languageAlternates(page)[locale],
          },
        ],
      }}
    />
  );
}
