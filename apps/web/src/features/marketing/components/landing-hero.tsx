import Image from "next/image";
import type {PageContent} from "@/content/marketing/types";
import {CtaLink} from "@/features/marketing/components/blocks";
import {Breadcrumb} from "@/features/marketing/components/breadcrumb";
import {digitalHeroVisuals} from "@/features/marketing/components/digital-visual";
import {divisionThemes} from "@/features/marketing/lib/theme";
import type {Locale} from "@/i18n/config";
import {cn} from "@/lib/utils";
import homeDe from "../../../../public/images/soFlott_divisions_de-5.png";
import homeEn from "../../../../public/images/soFlott_divisions_en-3.png";

const homeVisuals = {de: homeDe, en: homeEn};

export function LandingHero({
    locale,
    page,
    hero,
    breadcrumbLabel,
    homeLabel,
    pageLabel,
    divisionOf,
}: {
    locale: Locale;
    page: "home" | "digital";
    hero: PageContent["hero"];
    breadcrumbLabel: string;
    homeLabel: string;
    pageLabel: string;
    divisionOf: string;
}) {
    const isHome = page === "home";
    const theme = divisionThemes[isHome ? "corporate" : "digital"];
    const visual = isHome ? homeVisuals[locale] : digitalHeroVisuals[locale];

    return (
        <section
            aria-labelledby="landing-title"
            className={cn("pb-12 pt-6 sm:pt-8 md:pb-16", isHome ? "bg-white" : "bg-sky-50")}
        >
            <div className="mx-auto w-full max-w-[1440px] px-4 sm:px-6">
                {!isHome ? (
                    <Breadcrumb
                        items={[{page: "home", label: homeLabel}, {page: "digital", label: pageLabel}]}
                        label={breadcrumbLabel}
                        locale={locale}
                    />
                ) : null}

                <div className={cn("landing-hero-content grid gap-6 pb-7 xl:grid-cols-[minmax(0,1fr)_auto] xl:items-end xl:gap-8", !isHome && "pt-6")}>
                    <div className="max-w-4xl">
                        <p className={cn("text-sm font-semibold", theme.accent)}>{hero.eyebrow}</p>
                        {hero.descriptor ? (
                            <p className="mt-1 text-sm text-stone-600">{hero.descriptor}</p>
                        ) : null}
                        <h1
                            className="mt-3 text-balance text-3xl font-extrabold leading-tight text-stone-950 sm:text-4xl xl:text-5xl"
                            id="landing-title"
                        >
                            {hero.title}
                        </h1>
                    </div>
                    <div className="landing-hero-actions grid grid-cols-2 gap-2 sm:flex sm:flex-nowrap sm:gap-3 xl:justify-end">
                        {hero.primaryCta ? (
                            <CtaLink
                                className="px-3 text-center sm:px-5"
                                link={hero.primaryCta}
                                locale={locale}
                                theme={isHome ? divisionThemes.express : theme}
                            />
                        ) : null}
                        {hero.secondaryCta ? (
                            <CtaLink
                                className="px-3 text-center sm:px-5"
                                link={hero.secondaryCta}
                                locale={locale}
                                theme={isHome ? divisionThemes.digital : theme}
                                variant={isHome ? "primary" : "secondary"}
                            />
                        ) : null}
                    </div>
                </div>

                <div className="landing-hero-artwork mx-auto max-w-[1240px] overflow-hidden rounded-2xl bg-stone-100 shadow-xl shadow-slate-900/10 sm:rounded-3xl">
                    <Image
                        alt=""
                        className="block h-auto w-full"
                        priority
                        sizes="(min-width: 1288px) 1240px, (min-width: 640px) calc(100vw - 48px), calc(100vw - 32px)"
                        src={visual}
                    />
                </div>

                <div className="mx-auto mt-7 max-w-4xl text-center">
                    <p className="text-base leading-7 text-stone-700 sm:text-lg sm:leading-8">{hero.intro}</p>
                    {!isHome ? <p className="mt-3 text-sm text-stone-600">{divisionOf}</p> : null}
                </div>
            </div>
        </section>
    );
}
