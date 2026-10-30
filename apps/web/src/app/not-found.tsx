import { NotFoundCard } from "@/components/layout/not-found-card";
import { RootShell } from "@/components/layout/root-shell";
import { defaultLocale } from "@/i18n/config";

// The app has two root layouts (public website and signed-in console), so this
// global 404 page has no layout of its own and renders the shell itself.
export default function NotFound() {
  return (
    <RootShell locale={defaultLocale}>
      <main className="flex min-h-screen items-center justify-center px-4 py-10">
        <NotFoundCard />
      </main>
    </RootShell>
  );
}
