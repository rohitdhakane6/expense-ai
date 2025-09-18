import { db } from "@/db";
import { transactions } from "@/db/schema";
import { inngest } from "@/inngest";
import { getNextRecurringDate } from "@/lib/calculateNextRecurringDate";
import { and, eq, isNull, lte, or } from "drizzle-orm";
export const triggerRecurringTransaction = inngest.createFunction(
  {
    id: "trigger-recurring-transactions",
    name: "Trigger Recurring Transactions",
  },
  { cron: "0 0 * * *" },
  async ({ step }) => {
    // Step 1: Fetch transactions that are due OR haven't been processed yet
    const recurringTxns = await step.run(
      "fetch-recurring-transaction",
      async () => {
        return db
          .select()
          .from(transactions)
          .where(
            and(
              eq(transactions.isRecurring, true),
              or(
                isNull(transactions.nextRecurringDate),
                lte(transactions.nextRecurringDate, new Date()),
              ),
            ),
          );
      },
    );
    if (!recurringTxns.length) return "No transactions due";
    const events = recurringTxns.map((transaction) => ({
      name: "transaction.recurring.process",
      data: { transactionId: transaction.id, userId: transaction.userId },
    }));
    await inngest.send(events);
    return { triggered: recurringTxns.length };
  },
);

export const processRecurringTransaction = inngest.createFunction(
  {
    id: "process-recurring-transaction",
    name: "Process Recurring Transaction",
    throttle: {
      limit: 10,
      period: "1m",
      key: "event.data.userId",
    },
  },
  { event: "transaction.recurring.process" },
  async ({ event, step }) => {
    const { transactionId } = event.data;

    // Step 1: Fetch original transaction
    const originalTransaction = await step.run(
      "fetch-original-transaction",
      async () => {
        const result = await db
          .select()
          .from(transactions)
          .where(eq(transactions.id, transactionId))
          .limit(1);

        return result[0];
      },
    );

    if (!originalTransaction) {
      throw new Error(`Transaction ${transactionId} not found`);
    }

    if (
      !originalTransaction.isRecurring ||
      originalTransaction.recurringInterval === null
    ) {
      throw new Error(`Transaction ${transactionId} is not recurring`);
    }

    // Step 2: Create new transaction & update previous in one DB transaction
    const newTransaction = await step.run(
      "create-new-transaction",
      async () => {
        return db.transaction(async (tx) => {
          // Update previous recurring txn (optional – depends on logic)
          await tx
            .update(transactions)
            .set({
              isRecurring: false,
              nextRecurringDate: null,
              recurringInterval: null,
            })
            .where(eq(transactions.id, transactionId));

          // Insert new recurring txn
          const created = await tx
            .insert(transactions)
            .values({
              userId: originalTransaction.userId,
              amount: originalTransaction.amount,
              name: originalTransaction.name,
              description: originalTransaction.description,
              category: originalTransaction.category,
              type: originalTransaction.type,
              transactionDate: new Date(),
              isRecurring: true,
              nextRecurringDate: getNextRecurringDate({
                interval: originalTransaction.recurringInterval!,
              }),
              recurringInterval: originalTransaction.recurringInterval,
            })
            .returning();

          return created[0];
        });
      },
    );

    return {
      success: true,
      newTransactionId: newTransaction.id,
    };
  },
);
