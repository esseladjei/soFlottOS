import type {StaticImageData} from "next/image";
import {MarketingVisual} from "@/features/marketing/components/marketing-visual";
import type {Locale} from "@/i18n/config";
import type {MarketingPage} from "@/i18n/routes";
import heroDe from "../../../../public/images/express/hero/hero_de_2.png";
import heroEn from "../../../../public/images/express/hero/hero_en_1.png";
import b2bDe from "../../../../public/images/express/de/b2b/b2b_3.png";
import b2bEn from "../../../../public/images/express/en/b2b/b2b_6.png";
import routesDe from "../../../../public/images/express/de/fixedroutes/soFlott_express_fixedroute_1_de.png";
import routesEn from "../../../../public/images/express/en/fixedroutes/fixedroute_3.png";
import subcontractingDe from "../../../../public/images/express/de/subcontracting/subcontract-3.png";
import subcontractingEn from "../../../../public/images/express/en/subcontracting/subcontact_2.png";

interface ExpressVisualAsset {
    src: StaticImageData;
}

const expressVisuals: Record<Locale, Partial<Record<MarketingPage, ExpressVisualAsset>>> = {
    de: {
        express: {src: heroDe},
        "express/direct-b2b-delivery": {
            src: b2bDe,
        },
        "express/contracted-delivery-routes": {
            src: routesDe,
        },
        "express/logistics-subcontracting": {
            src: subcontractingDe,
        },
    },
    en: {
        express: {src: heroEn},
        "express/direct-b2b-delivery": {
            src: b2bEn,
        },
        "express/contracted-delivery-routes": {
            src: routesEn,
        },
        "express/logistics-subcontracting": {
            src: subcontractingEn,
        },
    },
};

export function getExpressVisual(locale: Locale, page: MarketingPage): ExpressVisualAsset | null {
    return expressVisuals[locale][page] ?? null;
}

export function ExpressVisual({
                                  locale,
                                  page,
                                  priority = false,
                                  sizes = "(min-width: 1024px) 42vw, 100vw",
                              }: {
    locale: Locale;
    page: MarketingPage;
    priority?: boolean;
    sizes?: string;
}) {
    const visual = getExpressVisual(locale, page);
    if (!visual) return null;

    return (
        <MarketingVisual priority={priority} sizes={sizes} src={visual.src}/>
    );
}
