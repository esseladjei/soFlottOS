// URL: /de/contact and /en/contact
// The whole page is built by the shared factory; the words come from
// `content/marketing/<language>.ts` under `pages.contact`.
import { createSubPage } from "@/features/marketing/lib/create-sub-page";

const route = createSubPage("contact");

export const generateMetadata = route.generateMetadata;
export const generateStaticParams = route.generateStaticParams;
export default route.Page;
