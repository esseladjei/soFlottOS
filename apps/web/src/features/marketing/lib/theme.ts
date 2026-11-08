// Colour themes per division.
//
// Tailwind only generates classes it can find as literal strings, so every
// theme is spelled out in full here instead of being built from a colour name.
// The -700/-800 shades keep white button text above the WCAG AA contrast ratio.

import type { Division } from "@/i18n/routes";

export interface DivisionTheme {
  /** Eyebrows, icons, small accents. */
  accent: string;
  /** Soft icon tile background. */
  accentSoft: string;
  /** Solid primary button. */
  button: string;
  /** Outline / secondary button. */
  buttonOutline: string;
  /** Hero background gradient. */
  hero: string;
  /** Link hover colour. */
  linkHover: string;
  /** Focus ring. */
  ring: string;
  /** Active item in the division sub-navigation. */
  navActive: string;
  /** Left border used for notices. */
  border: string;
}

export const divisionThemes: Record<Division, DivisionTheme> = {
  corporate: {
    accent: "text-stone-700",
    accentSoft: "bg-stone-100 text-stone-800",
    button: "bg-stone-900 text-white hover:bg-stone-800",
    buttonOutline: "border border-stone-300 bg-white text-stone-900 hover:bg-stone-100",
    hero: "bg-gradient-to-b from-stone-100 to-white",
    linkHover: "hover:text-stone-950",
    ring: "focus-visible:ring-stone-900",
    navActive: "bg-stone-900 text-white",
    border: "border-stone-500",
  },
  express: {
    accent: "text-orange-700",
    accentSoft: "bg-orange-50 text-orange-700",
    button: "bg-orange-700 text-white hover:bg-orange-800",
    buttonOutline: "border border-orange-200 bg-white text-orange-800 hover:bg-orange-50",
    hero: "bg-gradient-to-b from-orange-50 to-white",
    linkHover: "hover:text-orange-700",
    ring: "focus-visible:ring-orange-700",
    navActive: "bg-orange-700 text-white",
    border: "border-orange-600",
  },
  digital: {
    accent: "text-sky-700",
    accentSoft: "bg-sky-50 text-sky-700",
    button: "bg-sky-700 text-white hover:bg-sky-800",
    buttonOutline: "border border-sky-200 bg-white text-sky-800 hover:bg-sky-50",
    hero: "bg-gradient-to-b from-sky-50 to-white",
    linkHover: "hover:text-sky-700",
    ring: "focus-visible:ring-sky-700",
    navActive: "bg-sky-700 text-white",
    border: "border-sky-600",
  },
};

/** Base classes shared by every marketing button; combine with a theme colour. */
export const buttonBase =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2";
