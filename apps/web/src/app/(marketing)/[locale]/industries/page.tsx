// URL: /de/industries and /en/industries
// The whole page is built by the shared factory; the words come from
// `content/marketing/<language>.ts` under `pages.industries`.
import { createSubPage } from "@/features/marketing/lib/create-sub-page";

const route = createSubPage("industries");

export const generateMetadata = route.generateMetadata;
export const generateStaticParams = route.generateStaticParams;
export default route.Page;
