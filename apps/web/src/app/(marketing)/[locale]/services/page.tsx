// URL: /de/services and /en/services
// The whole page is built by the shared factory; the words come from
// `content/marketing/<language>.ts` under `pages.services`.
import { createSubPage } from "@/features/marketing/lib/create-sub-page";

const route = createSubPage("services");

export const generateMetadata = route.generateMetadata;
export const generateStaticParams = route.generateStaticParams;
export default route.Page;
