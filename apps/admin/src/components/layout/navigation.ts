export interface NavItem {
  href: string;
  label: string;
}

export interface NavGroup {
  id: "operations" | "people" | "billing";
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
