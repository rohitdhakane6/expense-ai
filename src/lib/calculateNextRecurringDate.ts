import { addDays, addWeeks, addMonths, addYears, startOfDay } from "date-fns";
import { recurringIntervalOptions } from "@/db/schema";

/**
 * Get the next recurring date based on interval
 * @param interval - The recurring interval
 * @param fromDate - Base date to calculate from (defaults to current date)
 * @param count - Number of intervals to add (defaults to 1)
 * @returns Next recurring date
 */
export function getNextRecurringDate({
  interval,
  fromDate = new Date(),
  count = 1,
}: {
  interval: (typeof recurringIntervalOptions)[number];
  fromDate?: Date;
  count?: number;
}): Date {
  // Normalize to start of day to avoid time issues
  const baseDate = startOfDay(fromDate);

  switch (interval) {
    case "daily":
      return addDays(baseDate, count);
    case "weekly":
      return addWeeks(baseDate, count);
    case "monthly":
      return addMonths(baseDate, count);
    case "yearly":
      return addYears(baseDate, count);
    default:
      throw new Error(`Unsupported recurring interval: ${interval}`);
  }
}

/**
 * Get a human-readable description of the recurring interval
 * @param interval - The recurring interval
 * @returns Human-readable description
 */
export function getRecurringIntervalDescription(
  interval: (typeof recurringIntervalOptions)[number],
): string {
  const descriptions = {
    daily: "Every day",
    weekly: "Every week",
    monthly: "Every month",
    yearly: "Every year",
  };

  return descriptions[interval];
}

/**
 * Calculate how many days until the next recurring date
 * @param nextRecurringDate - The next scheduled date
 * @param currentDate - Current date (defaults to now)
 * @returns Number of days (negative if overdue)
 */
export function getDaysUntilNextRecurring(
  nextRecurringDate: Date,
  currentDate: Date = new Date(),
): number {
  const diffTime =
    startOfDay(nextRecurringDate).getTime() - startOfDay(currentDate).getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}
