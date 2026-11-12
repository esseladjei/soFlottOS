import type {StaticImageData} from "next/image";
import type {Locale} from "@/i18n/config";
import type {MarketingPage} from "@/i18n/routes";
import heroDe from "../../../../public/images/digital/hero/hero_digital_de_3.png";
import heroEn from "../../../../public/images/digital/hero/hero_digital_en_2.png";
import consultingDe from "../../../../public/images/digital/hero/hero_digital_de_4.png";
import consultingEn from "../../../../public/images/digital/hero/hero_digital_en_3.png";
import softwareDe from "../../../../public/images/digital/de/software/software_de_2.png";
import softwareEn from "../../../../public/images/digital/en/software/digital_software_en_4.png";
import apiDe from "../../../../public/images/digital/de/api/api_de_1.png";
import apiEn from "../../../../public/images/digital/en/api/digital_api_en_3.png";
import modernisationDe from "../../../../public/images/digital/de/support_maintenance/support_de_3.png";
import contractDe from "../../../../public/images/digital/de/contract/contract_de_1.png";
import contractEn from "../../../../public/images/digital/en/contract/contract_en_4.png";
import supportEn from "../../../../public/images/digital/en/support_maintenance/support_en_3.png";

const digitalVisuals: Record<Locale, Partial<Record<MarketingPage, StaticImageData>>> = {
    de: {
        digital: heroDe,
        "digital/it-consulting": consultingDe,
        "digital/software-development": softwareDe,
        "digital/api-integration": apiDe,
        "digital/application-modernisation": modernisationDe,
        "digital/contract-software-engineering": contractDe,
        "digital/support-and-maintenance": consultingDe,
    },
    en: {
        digital: heroEn,
        "digital/it-consulting": consultingEn,
        "digital/software-development": softwareEn,
        "digital/api-integration": apiEn,
        "digital/application-modernisation": supportEn,
        "digital/contract-software-engineering": contractEn,
        "digital/support-and-maintenance": supportEn,
    },
};

export function getDigitalVisual(locale: Locale, page: MarketingPage): StaticImageData | undefined {
    return digitalVisuals[locale][page];
}
