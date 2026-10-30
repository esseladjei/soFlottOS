export default function Loading() {
  return (
    <main className="px-4 py-10 md:px-8 lg:px-12">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="h-28 animate-pulse rounded-2xl bg-stone-200" />
        <div className="grid gap-6 xl:grid-cols-[280px_minmax(0,1fr)]">
          <div className="hidden h-96 animate-pulse rounded-2xl bg-stone-200 xl:block" />
          <div className="space-y-6">
            <div className="grid gap-5 md:grid-cols-2 2xl:grid-cols-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <div className="h-44 animate-pulse rounded-2xl bg-stone-200" key={index} />
              ))}
            </div>
            <div className="h-96 animate-pulse rounded-2xl bg-stone-200" />
            <div className="h-96 animate-pulse rounded-2xl bg-stone-200" />
          </div>
        </div>
      </div>
    </main>
  );
}
