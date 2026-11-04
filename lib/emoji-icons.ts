/** Colorful emoji keys for categories, groups and navigation */

export const CATEGORY_EMOJI: Record<string, string> = {
  "inc-salary": "💼",
  "inc-part-time": "⏰",
  "inc-investments": "📈",
  "inc-business": "🏢",
  "inc-freelancing": "💻",
  "inc-gifts": "🎁",
  "inc-interest": "🏦",
  "inc-rental": "🏠",
  "inc-bonus": "✨",
  "inc-pocket": "👛",
  "inc-refunds": "↩️",
  "inc-other": "💰",

  "exp-groceries": "🛒",
  "exp-fruits": "🍎",
  "exp-non-veg": "🍗",
  "exp-snacks": "🍿",
  "exp-restaurants": "🍽️",
  "exp-movies": "🎬",
  "exp-outings": "🏞️",
  "exp-food-delivery": "🛵",

  "exp-education": "🎓",
  "exp-books": "📚",
  "exp-emi": "🧾",
  "exp-cc-bills": "💳",

  "exp-shopping": "🛍️",
  "exp-entertainment": "🎤",
  "exp-salons": "💇",
  "exp-hobbies": "🎨",
  "exp-gifts": "🎀",
  "exp-sports": "⚽",

  "exp-rent": "🔑",
  "exp-electricity": "⚡",
  "exp-water": "💧",
  "exp-internet": "📶",
  "exp-mobile": "📱",
  "exp-repairs": "🔧",

  "exp-healthcare": "🩺",
  "exp-medicines": "💊",
  "exp-gym": "🏋️",
  "exp-pets": "🐶",
  "exp-personal-care": "💅",

  "exp-fuel": "⛽",
  "exp-public-transport": "🚌",
  "exp-vehicle": "🚗",
  "exp-travel": "✈️",
  "exp-accommodation": "🏨",
  "exp-trips": "🧳",

  "exp-donations": "🙏",
  "exp-family": "👨‍👩‍👧",
  "exp-events": "🎉",
  "exp-emergency": "🚨",
  "exp-misc": "📦",

  "trf-savings": "🐷",
  "trf-loans": "📉",
};

export const GROUP_EMOJI: Record<string, string> = {
  food: "🍔",
  "education-finance": "🎓",
  lifestyle: "🎭",
  home: "🏡",
  health: "❤️",
  transport: "🚆",
  social: "👥",
  custom: "✨",
};

export const GROUP_COLORS: Record<
  string,
  { bg: string; border: string; tint: string; text: string }
> = {
  food: {
    bg: "#fff4e8",
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

export const NAV_EMOJI: Record<string, string> = {
  "/home": "🏠",
  "/activity": "📋",
  "/reports": "📊",
  "/calendar": "📅",
  "/splits": "🤝",
  "/budgets": "👛",
  "/goals": "🎯",
  "/profile": "👤",
  "/add": "➕",
};

export const CATEGORY_TINTS = [
  "#fff7ed",
  "#ecfeff",
  "#fdf2f8",
  "#f0fdf4",
  "#eef2ff",
  "#fefce8",
  "#f5f3ff",
  "#fff1f2",
];

export function getCategoryEmoji(id: string) {
  return CATEGORY_EMOJI[id] ?? "💡";
}

export function getGroupEmoji(id: string) {
  return GROUP_EMOJI[id] ?? "✨";
}

export function getNavEmoji(href: string) {
  return NAV_EMOJI[href] ?? "🔹";
}

/** Twemoji PNG — consistent colorful icons across browsers */
export function emojiToTwemojiUrl(emoji: string) {
  const points = [...emoji]
    .map((ch) => ch.codePointAt(0))
    .filter((n): n is number => Boolean(n) && n !== 0xfe0f)
    .map((n) => n.toString(16));
  return `https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/${points.join("-")}.png`;
}
