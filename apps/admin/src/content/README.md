# content

All visible text of the admin console, separated from the React components.

```
content/app/
  types.ts   the shape every translation must have (TypeScript enforces it)
  de.ts      German copy - the default language
  en.ts      English copy
  index.ts   getAppContent(locale) -> the right file
```

Server components use `getAppContent(await getRequestLocale())`; client
components use `useAppContent()`. Dates and prices come from `useFormatters()`
(client) or `lib/format.ts` (server).

To add text: extend `types.ts`, then `de.ts` and `en.ts` - `npm run typecheck`
fails if a language is missing.
