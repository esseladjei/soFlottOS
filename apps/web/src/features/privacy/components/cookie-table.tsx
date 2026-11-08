import { ChevronDown } from "lucide-react";
import type { PrivacyContent } from "@/content/privacy/types";
import type { ConsentCategory } from "@/features/privacy/lib/consent-model";
import { cookiesIn } from "@/features/privacy/lib/privacy-config";

/** Collapsible list of the cookies that belong to one category. */
export function CookieTable({ category, settings }: { category: ConsentCategory; settings: PrivacyContent["settings"] }) {
  const cookies = cookiesIn(category);
  const { headers, items } = settings.cookies;

  return (
    <details className="group mt-4 border-t border-stone-200 pt-3">
      <summary className="inline-flex cursor-pointer list-none items-center gap-1.5 rounded-md text-sm font-bold text-stone-800 hover:text-stone-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/70 focus-visible:ring-offset-2 [&::-webkit-details-marker]:hidden">
        <ChevronDown aria-hidden className="size-4 transition-transform group-open:rotate-180 motion-reduce:transition-none" />
        <span className="group-open:hidden">
          {settings.cookies.show} ({cookies.length})
        </span>
        <span className="hidden group-open:inline">{settings.cookies.hide}</span>
      </summary>

      {cookies.length === 0 ? (
        <p className="mt-3 text-sm text-stone-600">{settings.cookies.none}</p>
      ) : (
        <div className="mt-3 overflow-x-auto rounded-xl border border-stone-200">
          <table className="w-full min-w-[34rem] border-collapse text-left text-sm">
            <caption className="sr-only">{settings.categories[category].name}</caption>
            <thead className="bg-stone-100 text-xs font-extrabold uppercase tracking-wide text-stone-600">
              <tr>
                <th className="px-3 py-2" scope="col">
                  {headers.name}
                </th>
                <th className="px-3 py-2" scope="col">
                  {headers.provider}
                </th>
                <th className="px-3 py-2" scope="col">
                  {headers.purpose}
                </th>
                <th className="px-3 py-2" scope="col">
                  {headers.duration}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200 bg-white align-top text-stone-700">
              {cookies.map((cookie) => (
                <tr key={cookie.id}>
                  <th className="px-3 py-2 font-mono text-xs font-bold text-stone-900" scope="row">
                    {cookie.name}
                  </th>
                  <td className="px-3 py-2">
                    {cookie.provider}
                    {cookie.thirdParty ? (
                      <span className="mt-1 block text-xs text-stone-500">{settings.cookies.thirdParty}</span>
                    ) : null}
                  </td>
                  <td className="px-3 py-2">{items[cookie.id].purpose}</td>
                  <td className="whitespace-nowrap px-3 py-2">{items[cookie.id].duration}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {cookies.some((cookie) => cookie.thirdParty) ? (
        <p className="mt-3 text-xs leading-5 text-stone-500">{settings.cookies.thirdPartyNote}</p>
      ) : null}
    </details>
  );
}
