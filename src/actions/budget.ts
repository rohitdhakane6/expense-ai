"use server";

import { db } from "@/db";
import { budgets, transactions } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { and, eq, gte, lte, sum } from "drizzle-orm";

export async function getBudget() {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Authentication required");

    // Fetch single budget (assuming one budget per user)
    const userBudget = await db
      .select()
      .from(budgets)
      .where(eq(budgets.userId, userId))
      .limit(1);

    if (!userBudget.length) {
      return {
        amount: 0,
        currentExpenses: 0,
      };
    }

    const startOfMonth = new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      1,
    );
    const endOfMonth = new Date(
      new Date().getFullYear(),
      new Date().getMonth() + 1,
      0,
    );

    // Sum expenses for the current month
    const totalExpenses = await db
      .select({
        totalExpenses: sum(transactions.amount),
      })
      .from(transactions)
      .where(
        and(
          eq(transactions.type, "expense"),
          eq(transactions.userId, userId),
          gte(transactions.transactionDate, startOfMonth),
          lte(transactions.transactionDate, endOfMonth),
        ),
      );

    return {
      ...userBudget[0],
      currentExpenses: totalExpenses[0]?.totalExpenses || 0,
    };
  } catch (error) {
    console.error("❌ Failed to fetch budget:", error);
    return {
      amount: 0,
      currentExpenses: 0,
      error: "Failed to fetch budget",
    };
  }
}

export async function updateBudget(input: { amount: string }) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Authentication required");

    // Check if budget exists
    const existingBudget = await db
      .select()
      .from(budgets)
      .where(eq(budgets.userId, userId))
      .limit(1);

    if (existingBudget.length) {
      // Update existing budget
      const [updatedBudget] = await db
        .update(budgets)
        .set({ amount: input.amount, isLastAlertSent: false })
        .where(eq(budgets.userId, userId))
        .returning();
      return updatedBudget;
    } else {
      // Create new budget
      const [newBudget] = await db
        .insert(budgets)
        .values({ userId, amount: input.amount, isLastAlertSent: false })
        .returning();
      return newBudget;
    }
  } catch (error) {
    console.error("❌ Failed to update budget:", error);
    throw error;
  }
}
