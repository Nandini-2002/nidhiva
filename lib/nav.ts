export interface NavItem {
  href: string;
  label: string;
  emoji: string;
  group?: "main" | "planning" | "account";
}

export const MAIN_NAV: NavItem[] = [
  { href: "/home", label: "Home", emoji: "🏠", group: "main" },
  { href: "/activity", label: "Activity", emoji: "📋", group: "main" },
  { href: "/reports", label: "Reports", emoji: "📊", group: "main" },
  { href: "/calendar", label: "Calendar", emoji: "📅", group: "main" },
  { href: "/splits", label: "Splits", emoji: "🤝", group: "main" },
];

export const PLANNING_LINKS: NavItem[] = [
  { href: "/budgets", label: "Budgets", emoji: "👛", group: "planning" },
  { href: "/goals", label: "Goals", emoji: "🎯", group: "planning" },
];

export const ACCOUNT_NAV: NavItem[] = [
  { href: "/profile", label: "Profile", emoji: "👤", group: "account" },
];

export const ALL_SIDEBAR_NAV: NavItem[] = [
  ...MAIN_NAV,
  ...PLANNING_LINKS,
  ...ACCOUNT_NAV,
];

export const BOTTOM_NAV = [
  { href: "/home", label: "Home", emoji: "🏠" },
  { href: "/activity", label: "Activity", emoji: "📋" },
  { href: "/reports", label: "Reports", emoji: "📊" },
  { href: "/profile", label: "Profile", emoji: "👤" },
] as const;
