"use server";

import { db } from "@/db";
import { transactions } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { and, desc, eq, inArray } from "drizzle-orm";

/*
 * Fetch all transactions for the authenticated user
 */
export async function getTransactions() {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Authentication required");

    const userTransactions = await db
      .select()
      .from(transactions)
      .where(eq(transactions.userId, userId))
      .orderBy(desc(transactions.transactionDate));

    return userTransactions;
  } catch (error) {
    console.error("❌ Failed to fetch transactions:", error);
    return [];
  }
}

/*
 * Create a new transaction for the authenticated user
 */
export async function createTransaction(input: {
  type: (typeof transactions.type.enumValues)[number]; // "income" | "expense"
  amount: string; // decimal → stored as string
  name: string;
  transactionDate?: Date;
  description?: string;
  category?: (typeof transactions.category.enumValues)[number]; // "groceries" | "utilities" | "rent" | "entertainment" | "transportation" | "dining" | "health" | "shopping" | "education" | "travel" | "other"
  isRecurring?: boolean;
  recurringInterval?: (typeof transactions.recurringInterval.enumValues)[number]; // "daily" | "weekly" | "monthly" | "yearly"
}) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Authentication required");

    const [newTransaction] = await db
      .insert(transactions)
      .values({
        userId,
        type: input.type,
        amount: input.amount,
        name: input.name,
        transactionDate: input.transactionDate || new Date(),
        description: input.description,
        category: input.category,
        isRecurring: input.isRecurring ?? false,
        recurringInterval: input.isRecurring ? input.recurringInterval : null,
      })
      .returning();

    return newTransaction;
  } catch (error) {
    console.error("❌ Failed to create transaction:", error);
    throw error;
  }
}

interface DeleteTransactionParams {
  id: string[];
}

// Supports bulk or single delete

export async function deleteTransaction({ id }: DeleteTransactionParams) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Authentication required");

    await db
      .delete(transactions)
      .where(
        and(
          eq(transactions.userId, userId),
          id.length === 1
            ? eq(transactions.id, id[0])
            : inArray(transactions.id, id),
        ),
      );
    return { success: true };
  } catch (error) {
    console.error("❌ Failed to delete transaction:", error);
    return { success: false, message: "Failed to delete transaction" };
  }
}

// Update transaction
export async function updateTransaction(input: {
  id: string;
  type?: (typeof transactions.type.enumValues)[number]; // "income" | "expense"
  amount?: string; // decimal → stored as string
  name?: string;
  transactionDate?: Date;
  description?: string;
  category?: (typeof transactions.category.enumValues)[number]; // "groceries" | "utilities" | "rent" | "entertainment" | "transportation" | "dining" | "health" | "shopping" | "education" | "travel" | "other"
  isRecurring?: boolean;
  recurringInterval?: (typeof transactions.recurringInterval.enumValues)[number]; // "daily" | "weekly" | "monthly" | "yearly"
}) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Authentication required");

    const [updatedTransaction] = await db
      .update(transactions)
      .set({
        type: input.type,
        amount: input.amount,
        name: input.name,
        transactionDate: input.transactionDate,
        description: input.description,
        category: input.category,
        isRecurring: input.isRecurring,
        recurringInterval: input.isRecurring ? input.recurringInterval : null,
      })
      .where(
        and(eq(transactions.id, input.id), eq(transactions.userId, userId)),
      )
      .returning();

    return updatedTransaction;
  } catch (error) {
    console.error("❌ Failed to update transaction:", error);
    throw error;
  }
}
