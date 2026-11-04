import type { Category, CategoryGroup, CategoryKind } from "@/lib/types";

function cat(
  id: string,
  name: string,
  kind: CategoryKind,
  group?: string,
  extras?: Partial<Category>,
): Category {
  return { id, name, kind, group, ...extras };
}

export const INCOME_CATEGORIES: Category[] = [
  cat("inc-salary", "Salary", "income", "Income"),
  cat("inc-part-time", "Part-time", "income", "Income"),
  cat("inc-investments", "Investments", "income", "Income"),
  cat("inc-business", "Business", "income", "Income"),
  cat("inc-freelancing", "Freelancing", "income", "Income"),
  cat("inc-gifts", "Gifts", "income", "Income"),
  cat("inc-interest", "Interest", "income", "Income"),
  cat("inc-rental", "Rental Income", "income", "Income"),
  cat("inc-bonus", "Bonus", "income", "Income"),
  cat("inc-pocket", "Pocket Money", "income", "Income"),
  cat("inc-refunds", "Refunds", "income", "Income"),
  cat("inc-other", "Other Income", "income", "Income"),
];

/** Consumption expenses only — savings/loan principal live under TRANSFER_CATEGORIES */
export const EXPENSE_CATEGORY_GROUPS: CategoryGroup[] = [
  {
    id: "food",
    name: "Food & Dining",
    kind: "expense",
    categories: [
      cat("exp-groceries", "Groceries", "expense", "Food & Dining"),
      cat("exp-fruits", "Fruits", "expense", "Food & Dining"),
      cat("exp-non-veg", "Non-veg", "expense", "Food & Dining"),
      cat("exp-snacks", "Snacks", "expense", "Food & Dining"),
      cat("exp-restaurants", "Restaurants", "expense", "Food & Dining"),
      cat("exp-movies", "Movies", "expense", "Food & Dining"),
      cat("exp-outings", "Outings", "expense", "Food & Dining"),
      cat("exp-food-delivery", "Food Delivery", "expense", "Food & Dining"),
    ],
  },
  {
    id: "education-finance",
    name: "Education & Finance",
    kind: "expense",
    categories: [
      cat("exp-education", "Education Fees", "expense", "Education & Finance"),
      cat("exp-books", "Books", "expense", "Education & Finance"),
      cat("exp-emi", "EMIs", "expense", "Education & Finance"),
      cat("exp-cc-bills", "Credit Card Bills", "expense", "Education & Finance"),
    ],
  },
  {
    id: "lifestyle",
    name: "Lifestyle & Entertainment",
    kind: "expense",
    categories: [
      cat("exp-shopping", "Shopping", "expense", "Lifestyle & Entertainment"),
      cat("exp-entertainment", "Entertainment", "expense", "Lifestyle & Entertainment"),
      cat("exp-salons", "Salons & Beauty", "expense", "Lifestyle & Entertainment"),
      cat("exp-hobbies", "Hobbies", "expense", "Lifestyle & Entertainment"),
      cat("exp-gifts", "Gifts", "expense", "Lifestyle & Entertainment"),
      cat("exp-sports", "Sports", "expense", "Lifestyle & Entertainment"),
    ],
  },
  {
    id: "home",
    name: "Home & Utilities",
    kind: "expense",
    categories: [
      cat("exp-rent", "Rent", "expense", "Home & Utilities"),
      cat("exp-electricity", "Electricity", "expense", "Home & Utilities"),
      cat("exp-water", "Water", "expense", "Home & Utilities"),
      cat("exp-internet", "Internet", "expense", "Home & Utilities"),
      cat("exp-mobile", "Mobile Recharge", "expense", "Home & Utilities"),
      cat("exp-repairs", "Home Repairs", "expense", "Home & Utilities"),
    ],
  },
  {
    id: "health",
    name: "Health & Personal Care",
    kind: "expense",
    categories: [
      cat("exp-healthcare", "Healthcare", "expense", "Health & Personal Care"),
      cat("exp-medicines", "Medicines", "expense", "Health & Personal Care"),
      cat("exp-gym", "Gym & Fitness", "expense", "Health & Personal Care"),
      cat("exp-pets", "Pets", "expense", "Health & Personal Care"),
      cat("exp-personal-care", "Personal Care", "expense", "Health & Personal Care"),
    ],
  },
  {
    id: "transport",
    name: "Transport & Travel",
    kind: "expense",
    categories: [
      cat("exp-fuel", "Fuel", "expense", "Transport & Travel"),
      cat("exp-public-transport", "Public Transport", "expense", "Transport & Travel"),
      cat("exp-vehicle", "Vehicle Repairs", "expense", "Transport & Travel"),
      cat("exp-travel", "Travel", "expense", "Transport & Travel"),
      cat("exp-accommodation", "Accommodation", "expense", "Transport & Travel"),
      cat("exp-trips", "Trips", "expense", "Transport & Travel"),
    ],
  },
  {
    id: "social",
    name: "Social & Other",
    kind: "expense",
    categories: [
      cat("exp-donations", "Donations", "expense", "Social & Other"),
      cat("exp-family", "Family", "expense", "Social & Other"),
      cat("exp-events", "Events", "expense", "Social & Other"),
      cat("exp-emergency", "Emergency", "expense", "Social & Other"),
      cat("exp-misc", "Miscellaneous", "expense", "Social & Other"),
    ],
  },
];

/**
 * Non-consumption outflows — kept out of expense reports so analytics stay accurate.
 */
export const TRANSFER_CATEGORIES: Category[] = [
  cat("trf-savings", "Savings Contributions", "transfer", "Transfers"),
  cat("trf-loans", "Loans", "transfer", "Transfers"),
];

export const EXPENSE_CATEGORIES: Category[] = EXPENSE_CATEGORY_GROUPS.flatMap(
  (g) => g.categories,
);

export const DEFAULT_CATEGORIES: Category[] = [
  ...INCOME_CATEGORIES,
  ...EXPENSE_CATEGORIES,
  ...TRANSFER_CATEGORIES,
];

export function getCategoryById(
  id: string,
  custom: Category[] = [],
): Category | undefined {
  return [...DEFAULT_CATEGORIES, ...custom].find((c) => c.id === id);
}

export function getCategoriesByKind(
  kind: CategoryKind,
  custom: Category[] = [],
): Category[] {
  return [...DEFAULT_CATEGORIES, ...custom].filter((c) => c.kind === kind);
}

export function getExpenseGroups(custom: Category[] = []): CategoryGroup[] {
  const customExpense = custom.filter((c) => c.kind === "expense");
  const groups = EXPENSE_CATEGORY_GROUPS.map((g) => ({
    ...g,
    categories: [
      ...g.categories,
      ...customExpense.filter((c) => c.group === g.name),
    ],
  }));

  const ungrouped = customExpense.filter(
    (c) => !c.group || !groups.some((g) => g.name === c.group),
  );

  if (ungrouped.length) {
    groups.push({
      id: "custom",
      name: "Custom",
      kind: "expense",
      categories: ungrouped,
    });
  }

  return groups;
}

export function categoryLabel(
  id: string,
  custom: Category[] = [],
): string {
  return getCategoryById(id, custom)?.name ?? "Unknown";
}
