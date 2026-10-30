// URL: /de/security and /en/security
// The whole page is built by the shared factory; the words come from
// `content/marketing/<language>.ts` under `pages.security`.
import { createSubPage } from "@/features/marketing/lib/create-sub-page";

const route = createSubPage("security");

export const generateMetadata = route.generateMetadata;
export const generateStaticParams = route.generateStaticParams;
export default route.Page;
