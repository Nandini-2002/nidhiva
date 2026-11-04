import type { CreateTransactionInput, TransactionType } from "@/lib/types";

export interface ValidationResult {
  ok: boolean;
  errors: Record<string, string>;
}

const TYPES: TransactionType[] = ["income", "expense", "transfer"];

export function validateTransactionInput(
  input: Partial<CreateTransactionInput>,
): ValidationResult {
  const errors: Record<string, string> = {};

  if (!input.type || !TYPES.includes(input.type)) {
    errors.type = "Choose income, expense, or transfer";
  }

  if (input.amount == null || Number.isNaN(input.amount) || input.amount <= 0) {
    errors.amount = "Enter an amount greater than zero";
  }

  if (!input.categoryId?.trim()) {
    errors.categoryId = "Choose a category";
  }

  if (!input.date?.trim()) {
    errors.date = "Pick a date";
  } else if (Number.isNaN(Date.parse(input.date))) {
    errors.date = "Invalid date";
  }

  if (input.split) {
    const total = input.split.participants.reduce((s, p) => s + p.amount, 0);
    if (input.amount != null && Math.abs(total - input.amount) > 0.01) {
      errors.split = "Split amounts must add up to the total";
    }
    if (input.split.participants.some((p) => !p.name.trim())) {
      errors.split = "Every person needs a name";
    }
  }

  return { ok: Object.keys(errors).length === 0, errors };
}
