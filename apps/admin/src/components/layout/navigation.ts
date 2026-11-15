export interface NavItem {
  href: string;
  label: string;
}

export interface NavGroup {
  id: "operations" | "people" | "billing" | "pricing" | "help";
  label: string;
  items: NavItem[];
  paths?: string[];
}

export function matchesPath(pathname: string, href: string): boolean {
  return pathname === href || (href !== "/" && pathname.startsWith(`${href}/`));
}

export function activeGroup(nav: NavGroup[], pathname: string): string | undefined {
  return nav.find((group) =>
    group.items.some((item) => matchesPath(pathname, item.href)) ||
    group.paths?.some((path) => matchesPath(pathname, path)),
  )?.id;
}

/** The most specific link of a group that matches the current path (so "/pricing" is not active on "/pricing/costs"). */
export function activeItem(items: NavItem[], pathname: string): string | undefined {
  return items
    .filter((item) => matchesPath(pathname, item.href))
    .sort((a, b) => b.href.length - a.href.length)[0]?.href;
}
