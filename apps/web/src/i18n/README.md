# i18n

Everything that decides which language a visitor sees.

```
config.ts           the list of languages, the cookie name, Accept-Language matching
routes.ts           the public site map and the /de <-> /en path helpers
server.ts           getRequestLocale() - the language of the current request (server)
locale-provider.tsx LocaleProvider, useLocale(), useAppContent(), useFormatters() (client)
```

## Two ways of remembering the language

* **Public website** - the language is part of the URL (`/de/pricing`), so each
  language has a stable address that Google can index. `middleware.ts` stores
  the opened language in the `soflott_locale` cookie so a later visit to `/` lands
  in the same language.
* **Signed-in console** - URLs such as `/client/orders` carry no language
  segment. The language comes from the `soflott_locale` cookie, which the language
  switcher writes before refreshing the page.

## The language switcher

`components/i18n/language-switcher.tsx` serves both halves:

* `mode="path"` (default) renders real links to the other language - used by the
  public navigation and footer so search engines can follow them.
* `mode="cookie"` writes the cookie and re-renders the current page - used by
  the login screen, the register screen and the role shell.

## Adding a language

1. Add the code to `locales` in `config.ts` and give it a label and an
   `og:locale` value.
2. Add a `content/marketing/<code>.ts` and a `content/app/<code>.ts` file and
   register both in the matching `index.ts`.
3. Add the Intl tag and the "hours" abbreviation in `lib/format.ts`.

`npm run typecheck` tells you if anything is missing.
