# Marketing feature

Components that render the public website. Copy lives in
`src/content/marketing`; these files only decide the look.

| File | Purpose |
| --- | --- |
| `components/marketing-page.tsx` | Renders any page: division sub-nav, hero, blocks, closing CTA, JSON-LD |
| `components/blocks.tsx` | One renderer per content block kind (`cards`, `links`, `divisions`, `steps`, `compare`, `checklist`, `text`, `notice`, `faq`, `form`, `contact`, `imprint`) |
| `components/enquiry-form.tsx` | Express quote / subcontracting, Digital proposal and contact forms |
| `components/marketing-nav.tsx`, `marketing-menu.tsx` | Corporate top navigation + mobile menu |
| `components/division-subnav.tsx` | Second nav bar inside soFlott Express / soFlott Digital |
| `components/marketing-footer.tsx` | Footer with division columns and legal note |
| `components/structured-data.tsx` | Organization, WebSite, Service, FAQPage, BreadcrumbList JSON-LD |
| `lib/theme.ts` | Colours per division (Express orange, Digital sky, corporate stone) |
| `lib/seo.ts`, `lib/links.ts` | Metadata/hreflang and link resolution |

## Enquiry forms (Phase 1)

There is no enquiry backend yet. Forms validate in the browser and open the
visitor's email program with a prepared message to the division inbox
(`NEXT_PUBLIC_EXPRESS_EMAIL`, `NEXT_PUBLIC_DIGITAL_EMAIL`, general enquiries use
`NEXT_PUBLIC_CONTACT_EMAIL`). Nothing is stored. To add a backend later,
replace `submitEnquiry` in `enquiry-form.tsx`.
`/express/request-a-quote?type=subcontracting` preselects the subcontracting form.

## Legal pages

The imprint is filled from `siteConfig` (`NEXT_PUBLIC_LEGAL_*`,
`NEXT_PUBLIC_ADDRESS_*`); empty values show "to be completed". A draft banner
appears on `/legal/*` until `NEXT_PUBLIC_LEGAL_REVIEWED=true`.

The navigation logo is `public/logo/soFlott_arrow_nav.png`.
