import { inngest } from "@/inngest";
import { db } from "@/db";
import { budgets, transactions, users } from "@/db/schema";
import { sum, eq, and, gte, lte } from "drizzle-orm";
import { resend } from "@/lib/resend";
import BudgetAlertEmail from "@/emails/budget-alert-email";

export const checkBudgetAlerts = inngest.createFunction(
  { id: "check-budget-alerts", name: "Check-Budget-Alerts" },
  { cron: "0 */6 * * *" }, // Every 6 hours
  async ({ step }) => {
    try {
      // Step 1: Fetch all budgets
      const budgetList = await step.run("fetch-budgets", async () => {
        return db.select().from(budgets);
      });

      for (const b of budgetList) {
        if (b.isLastAlertSent) {
          continue;
        }

        // Step 2:Calculate total spent in the current month
        const totalSpent = await step.run("calculate-total-spent", async () => {
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

          const result = await db
            .select({ total: sum(transactions.amount) })
            .from(transactions)
            .where(
              and(
                eq(transactions.type, "expense"),
                eq(transactions.userId, b.userId),
                gte(transactions.transactionDate, startOfMonth),
                lte(transactions.transactionDate, endOfMonth),
              ),
            );

          return result[0]?.total || 0;
        });

        // Return early if no spending
        if (totalSpent == 0) {
          continue; // Skip to next budget instead of returning from entire function
        }

        const spentPercentage =
          (Number(totalSpent) / Math.max(1, Number(b.amount))) * 100;

        // Return early if budget usage is below 80%
        if (spentPercentage < 80) {
          // Reset alert flag if it was previously set
          if (b.isLastAlertSent) {
            await db
              .update(budgets)
              .set({ isLastAlertSent: false })
              .where(eq(budgets.id, b.id));
          }
          continue; // Skip to next budget
        }

        // Only proceed if spentPercentage >= 90%

        // Step 3 :Fetch user for notification
        const user = await step.run("fetch-user", async () => {
          const result = await db
            .select()
            .from(users)
            .where(eq(users.id, b.userId));
          return result[0];
        });

        // Send alert if not already sent
        if (!b.isLastAlertSent) {
          // Send alert (log for now, but replace with email/notification service)
          await step.run("send-alert", async () => {
            resend.emails.send({
              from: "Rohit from ExpenseAI  <rohit@expenseai.tech>",
              to: "dhakanerohit6@gmail.com",
              subject: "Budget Alert",
              react: BudgetAlertEmail({
                userName: user.name || "there",
                userEmail: user.email,
                budgetAmount: b.amount,
                totalSpent: totalSpent,
                spentPercentage: Math.round(spentPercentage),
                ctaUrl: "https://app.expenseai.tech/budgets",
                // currency: user.currency || "₹",
              }),
            });

            await db
              .update(budgets)
              .set({ isLastAlertSent: true })
              .where(eq(budgets.id, b.id));

            return {
              success: true,
              totalSpent,
              spentPercentage: Math.round(spentPercentage),
              budgetAmount: b.amount,
              userEmail: user.email,
            };
          });
        }
      }
    } catch (error) {
      console.error("Error checking budget alerts:", error);
    }
  },
);
