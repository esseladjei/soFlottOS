# i18n

```
config.ts           the list of languages, the cookie name, Accept-Language matching
server.ts           getRequestLocale() - the language of the current request (server)
locale-provider.tsx LocaleProvider, useLocale(), useAppContent(), useFormatters() (client)
```

Console URLs carry no language segment. The language comes from the
`soflott_locale` cookie (falling back to Accept-Language), which
`components/i18n/language-switcher.tsx` writes before refreshing the page.
