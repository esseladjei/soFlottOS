# content

All visible text lives here, separated from the React components that display
it. There are two dictionaries, because the public website and the signed-in
console are translated independently.

```
content/marketing/        public website (/de/..., /en/...)
  types.ts   the shape every translation must have (TypeScript enforces it)
  de.ts      German copy - the default language
  en.ts      English copy
  index.ts   getMarketingContent(locale) -> the right file

content/app/              login, register and the client/driver portal
  types.ts   the shape every translation must have, incl. enum and form labels
  de.ts      German copy - the default language
  en.ts      English copy
  index.ts   getAppContent(locale) -> the right file
```

## Reading a translation

| Where | Marketing | Application |
| --- | --- | --- |
| Server component | `getMarketingContent(locale)` (locale comes from the URL) | `getAppContent(await getRequestLocale())` |
| Client component | passed down as a prop | `useAppContent()` |

Dates, prices and distances come from `useFormatters()` (client) or
`lib/format.ts` (server), so they follow the same language.

## Changing the wording

Edit `de.ts` and `en.ts`. You do not need to open a component.

## Adding a new section

1. Add the field to `types.ts`.
2. Add the German text to `de.ts`.
3. Add the English text to `en.ts` - if you forget, `npm run typecheck` fails.
4. Render it in the matching component.

## Before going live

The marketing copy is tailored to the initial Augsburg, Mering and Munich
service area. Keep both language files aligned when changing regional details.
Phone number, e-mail address and company details come from `src/lib/site.ts`.
