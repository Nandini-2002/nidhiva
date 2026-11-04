/** Unique colorful photorealistic 3D icons — /public/icons/3d */

const BASE = "/icons/3d";

export const PREMIUM_ASSETS = {
  // groups / shared (colorful versions)
  food: `${BASE}/icon-food-color.jpg`,
  groceries: `${BASE}/icon-groceries-color.jpg`,
  finance: `${BASE}/icon-finance-color.jpg`,
  books: `${BASE}/icon-books-color.jpg`,
  lifestyle: `${BASE}/icon-lifestyle-color.jpg`,
  home: `${BASE}/icon-home-color.jpg`,
  health: `${BASE}/icon-health-color.jpg`,
  transport: `${BASE}/icon-transport-color.jpg`,
  social: `${BASE}/icon-social-color.jpg`,
  income: `${BASE}/icon-income-color.jpg`,
  savings: `${BASE}/icon-savings-color.jpg`,
  reports: `${BASE}/icon-reports.jpg`,
  calendar: `${BASE}/icon-calendar.jpg`,
  activity: `${BASE}/icon-activity.jpg`,
  profile: `${BASE}/icon-profile.jpg`,
  goals: `${BASE}/icon-goals.jpg`,
  budgets: `${BASE}/icon-budgets.jpg`,
  splits: `${BASE}/icon-splits.jpg`,

  // unique per-category
  fruits: `${BASE}/cat-fruits.jpg`,
  nonveg: `${BASE}/cat-nonveg.jpg`,
  snacks: `${BASE}/cat-snacks.jpg`,
  restaurant: `${BASE}/cat-restaurant.jpg`,
  movies: `${BASE}/cat-movies.jpg`,
  outings: `${BASE}/cat-outings.jpg`,
  delivery: `${BASE}/cat-delivery.jpg`,
  education: `${BASE}/cat-education.jpg`,
  emi: `${BASE}/cat-emi.jpg`,
  entertainment: `${BASE}/cat-entertainment.jpg`,
  salon: `${BASE}/cat-salon.jpg`,
  hobbies: `${BASE}/cat-hobbies.jpg`,
  gifts: `${BASE}/cat-gifts.jpg`,
  sports: `${BASE}/cat-sports.jpg`,
  electricity: `${BASE}/cat-electricity.jpg`,
  water: `${BASE}/cat-water.jpg`,
  internet: `${BASE}/cat-internet.jpg`,
  mobile: `${BASE}/cat-mobile.jpg`,
  repairs: `${BASE}/cat-repairs.jpg`,
  medicine: `${BASE}/cat-medicine.jpg`,
  gym: `${BASE}/cat-gym.jpg`,
  pets: `${BASE}/cat-pets.jpg`,
  personalcare: `${BASE}/cat-personalcare.jpg`,
  fuel: `${BASE}/cat-fuel.jpg`,
  bus: `${BASE}/cat-bus.jpg`,
  vehicle: `${BASE}/cat-vehicle.jpg`,
  plane: `${BASE}/cat-plane.jpg`,
  hotel: `${BASE}/cat-hotel.jpg`,
  trips: `${BASE}/cat-trips.jpg`,
  donations: `${BASE}/cat-donations.jpg`,
  family: `${BASE}/cat-family.jpg`,
  events: `${BASE}/cat-events.jpg`,
  emergency: `${BASE}/cat-emergency.jpg`,
  misc: `${BASE}/cat-misc.jpg`,
} as const;

export type PremiumAssetKey = keyof typeof PREMIUM_ASSETS;

export const GROUP_PREMIUM: Record<string, PremiumAssetKey> = {
  food: "food",
  "education-finance": "finance",
  lifestyle: "lifestyle",
  home: "home",
  health: "health",
  transport: "transport",
  social: "social",
  custom: "misc",
};

export const NAV_PREMIUM: Record<string, PremiumAssetKey> = {
  "/home": "home",
  "/activity": "activity",
  "/reports": "reports",
  "/calendar": "calendar",
  "/splits": "splits",
  "/budgets": "budgets",
  "/goals": "goals",
  "/profile": "profile",
  "/add": "income",
};

/** One unique matching icon per category id */
export const CATEGORY_PREMIUM: Record<string, PremiumAssetKey> = {
  "inc-salary": "income",
  "inc-part-time": "income",
  "inc-investments": "finance",
  "inc-business": "income",
  "inc-freelancing": "income",
  "inc-gifts": "gifts",
  "inc-interest": "finance",
  "inc-rental": "home",
  "inc-bonus": "income",
  "inc-pocket": "budgets",
  "inc-refunds": "finance",
  "inc-other": "income",

  "exp-groceries": "groceries",
  "exp-fruits": "fruits",
  "exp-non-veg": "nonveg",
  "exp-snacks": "snacks",
  "exp-restaurants": "restaurant",
  "exp-movies": "movies",
  "exp-outings": "outings",
  "exp-food-delivery": "delivery",

  "exp-education": "education",
  "exp-books": "books",
  "exp-emi": "emi",
  "exp-cc-bills": "finance",

  "exp-shopping": "lifestyle",
  "exp-entertainment": "entertainment",
  "exp-salons": "salon",
  "exp-hobbies": "hobbies",
  "exp-gifts": "gifts",
  "exp-sports": "sports",

  "exp-rent": "home",
  "exp-electricity": "electricity",
  "exp-water": "water",
  "exp-internet": "internet",
  "exp-mobile": "mobile",
  "exp-repairs": "repairs",

  "exp-healthcare": "health",
  "exp-medicines": "medicine",
  "exp-gym": "gym",
  "exp-pets": "pets",
  "exp-personal-care": "personalcare",

  "exp-fuel": "fuel",
  "exp-public-transport": "bus",
  "exp-vehicle": "vehicle",
  "exp-travel": "plane",
  "exp-accommodation": "hotel",
  "exp-trips": "trips",

  "exp-donations": "donations",
  "exp-family": "family",
  "exp-events": "events",
  "exp-emergency": "emergency",
  "exp-misc": "misc",

  "trf-savings": "savings",
  "trf-loans": "finance",
};

export const GROUP_COLORS: Record<
  string,
  { bg: string; border: string; tint: string; text: string }
> = {
  food: {
    bg: "#fff7ed",
    border: "#fdba74",
    tint: "#ffedd5",
    text: "#c2410c",
  },
  "education-finance": {
    bg: "#eef2ff",
    border: "#a5b4fc",
    tint: "#e0e7ff",
    text: "#4338ca",
  },
  lifestyle: {
    bg: "#fdf2f8",
    border: "#f9a8d4",
    tint: "#fce7f3",
    text: "#be185d",
  },
  home: {
    bg: "#ecfeff",
    border: "#67e8f9",
    tint: "#cffafe",
    text: "#0e7490",
  },
  health: {
    bg: "#fef2f2",
    border: "#fca5a5",
    tint: "#fee2e2",
    text: "#b91c1c",
  },
  transport: {
    bg: "#f0fdf4",
    border: "#86efac",
    tint: "#dcfce7",
    text: "#15803d",
  },
  social: {
    bg: "#f5f3ff",
    border: "#c4b5fd",
    tint: "#ede9fe",
    text: "#6d28d9",
  },
  custom: {
    bg: "#f8fafc",
    border: "#cbd5e1",
    tint: "#f1f5f9",
    text: "#334155",
  },
};

export function getCategoryPremiumSrc(categoryId: string) {
  const key = CATEGORY_PREMIUM[categoryId] ?? "misc";
  return PREMIUM_ASSETS[key];
}

export function getGroupPremiumSrc(groupId: string) {
  const key = GROUP_PREMIUM[groupId] ?? "misc";
  return PREMIUM_ASSETS[key];
}

export function getNavPremiumSrc(href: string) {
  const key = NAV_PREMIUM[href] ?? "activity";
  return PREMIUM_ASSETS[key];
}
