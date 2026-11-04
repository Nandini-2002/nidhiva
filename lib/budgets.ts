import type { Budget, Goal } from "@/lib/types";

const BUDGET_KEY = "nidhiva:budgets:";
const GOAL_KEY = "nidhiva:goals:";

function read<T>(key: string): T[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T[]) : [];
  } catch {
    return [];
  }
}

function write<T>(key: string, items: T[]) {
  localStorage.setItem(key, JSON.stringify(items));
}

export function listBudgets(userId: string): Budget[] {
  return read<Budget>(BUDGET_KEY + userId);
}

export function upsertBudget(
  userId: string,
  input: Omit<Budget, "id" | "userId" | "createdAt"> & { id?: string },
): Budget {
  const items = listBudgets(userId);
  const existing = input.id ? items.find((b) => b.id === input.id) : undefined;
  const budget: Budget = existing
    ? { ...existing, ...input, userId }
    : {
        id: crypto.randomUUID(),
        userId,
        categoryId: input.categoryId,
        limit: input.limit,
        month: input.month,
        createdAt: new Date().toISOString(),
      };
  const next = existing
    ? items.map((b) => (b.id === budget.id ? budget : b))
    : [budget, ...items];
  write(BUDGET_KEY + userId, next);
  return budget;
}

export function deleteBudget(userId: string, id: string) {
  write(
    BUDGET_KEY + userId,
    listBudgets(userId).filter((b) => b.id !== id),
  );
}

export function listGoals(userId: string): Goal[] {
  return read<Goal>(GOAL_KEY + userId);
}

export function upsertGoal(
  userId: string,
  input: Omit<Goal, "id" | "userId" | "createdAt"> & { id?: string },
): Goal {
  const items = listGoals(userId);
  const existing = input.id ? items.find((g) => g.id === input.id) : undefined;
  const goal: Goal = existing
    ? { ...existing, ...input, userId }
    : {
        id: crypto.randomUUID(),
        userId,
        name: input.name,
        targetAmount: input.targetAmount,
        currentAmount: input.currentAmount,
        deadline: input.deadline,
        createdAt: new Date().toISOString(),
      };
  const next = existing
    ? items.map((g) => (g.id === goal.id ? goal : g))
    : [goal, ...items];
  write(GOAL_KEY + userId, next);
  return goal;
}

export function deleteGoal(userId: string, id: string) {
  write(
    GOAL_KEY + userId,
    listGoals(userId).filter((g) => g.id !== id),
  );
}
