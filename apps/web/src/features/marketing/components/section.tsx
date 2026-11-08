// Shared layout bits for the marketing pages, so every section gets the same
// width, padding and heading style.

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** A full-width band with a centred, max-width container inside. */
export function Section({
  children,
  className,
  id,
  labelledBy,
}: {
  children: ReactNode;
  className?: string;
  id?: string;
  labelledBy?: string;
}) {
  return (
    <section aria-labelledby={labelledBy} className={cn("py-14 md:py-20", className)} id={id}>
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">{children}</div>
    </section>
  );
}

/** Eyebrow + headline + intro. Used at the top of most sections. */
export function SectionIntro({
  eyebrow,
  title,
  intro,
  id,
  accent = "text-stone-600",
  align = "left",
}: {
  eyebrow?: string;
  title: string;
  intro?: string;
  id?: string;
  /** Theme text colour for the eyebrow. */
  accent?: string;
  align?: "center" | "left";
}) {
  return (
    <div className={cn("max-w-3xl", align === "center" && "mx-auto text-center")}>
      {eyebrow ? (
        <p className={cn("text-xs font-extrabold uppercase tracking-[0.2em]", accent)}>{eyebrow}</p>
      ) : null}
      <h2
        className="mt-2 font-[family-name:var(--font-display)] text-2xl font-extrabold tracking-tight text-stone-950 md:text-3xl"
        id={id}
      >
        {title}
      </h2>
      {intro ? <p className="mt-3 text-base leading-7 text-stone-600">{intro}</p> : null}
    </div>
  );
}
