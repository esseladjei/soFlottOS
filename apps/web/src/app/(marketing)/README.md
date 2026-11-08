# Marketing routes

The public website of soFlott UG (haftungsbeschränkt) and its two divisions,
in German and English. No session required.

```
[locale]/layout.tsx          <html lang>, nav, footer, Organization JSON-LD
[locale]/[[...slug]]/page.tsx every public page (statically generated)
```

All pages come from the site map in `src/i18n/routes.ts`:

| Area | Paths |
| --- | --- |
| Corporate | `/de`, `/de/about`, `/de/contact`, `/de/legal/imprint`, `/de/legal/privacy` |
| soFlott Express | `/de/express`, `…/direct-b2b-delivery`, `…/logistics-subcontracting`, `…/contracted-delivery-routes`, `…/service-areas`, `…/how-it-works`, `…/request-a-quote`, `…/contact` |
| soFlott Digital | `/de/digital`, `…/it-consulting`, `…/software-development`, `…/api-integration`, `…/application-modernisation`, `…/contract-software-engineering`, `…/support-and-maintenance`, `…/case-studies`, `…/request-a-proposal`, `…/contact` |

Same paths under `/en`. Unknown paths return 404. Old URLs (`/de/services`,
`/de/pricing`, …) are permanently redirected in `next.config.ts`.

To add a page: add its key to `i18n/routes.ts`, then add copy for it in
`content/marketing/de.ts` and `en.ts` (typecheck fails until both exist).
Nav, footer, sitemap, hreflang and breadcrumbs update automatically.
`noindexPages` keeps a page out of search engines and the sitemap.
