export type TransactionType = "income" | "expense" | "transfer";

/** transfer = savings, loan principal, etc. — not consumption */
export type CategoryKind = TransactionType;

export type SettlementStatus = "pending" | "settled" | "partial";

export type SplitMethod = "equal" | "custom";

export type RecurrenceFrequency = "daily" | "weekly" | "monthly" | "yearly";

export interface Category {
  id: string;
  name: string;
  kind: CategoryKind;
  group?: string;
  parentId?: string;
  icon?: string;
  color?: string;
  isCustom?: boolean;
  userId?: string;
}

export interface CategoryGroup {
  id: string;
  name: string;
  kind: CategoryKind;
  categories: Category[];
}

export interface RecurrenceRule {
  frequency: RecurrenceFrequency;
  interval: number;
  nextDate: string;
  endDate?: string;
}

export interface SplitParticipant {
  id: string;
  name: string;
  amount: number;
  settled: boolean;
}

export interface TransactionSplit {
  method: SplitMethod;
  participants: SplitParticipant[];
  status: SettlementStatus;
}

export interface Transaction {
  id: string;
  userId: string;
  type: TransactionType;
  amount: number;
  categoryId: string;
  subcategoryId?: string;
  note?: string;
  date: string;
  createdAt: string;
  updatedAt: string;
  recurring?: RecurrenceRule;
  split?: TransactionSplit;
}

export interface Budget {
  id: string;
  userId: string;
  categoryId: string;
  limit: number;
  month: string;
  createdAt: string;
}

export interface Goal {
  id: string;
  userId: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline?: string;
  createdAt: string;
}

export interface UserPreferences {
  currency: string;
  locale: string;
  monthStartDay: number;
  theme: "light" | "dark" | "system";
  defaultView: "home" | "activity" | "calendar";
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  preferences: UserPreferences;
  createdAt: string;
}

export interface MonthSummary {
  month: string;
  income: number;
  expense: number;
  transfer: number;
  /** Cash left after spending and transfers out */
  balance: number;
  /** Consumption only (excludes transfers) */
  net: number;
  byCategory: Record<string, number>;
}

export interface AllTimeSummary {
  income: number;
  expense: number;
  transfer: number;
  savings: number;
  byCategory: Record<string, number>;
}

export interface TransactionFilters {
  type?: TransactionType | "all";
  categoryId?: string;
  search?: string;
  from?: string;
  to?: string;
}

export interface CreateTransactionInput {
  type: TransactionType;
  amount: number;
  categoryId: string;
  subcategoryId?: string;
  note?: string;
  date: string;
  recurring?: RecurrenceRule;
  split?: TransactionSplit;
}

export interface UpdateTransactionInput extends Partial<CreateTransactionInput> {
  id: string;
}
