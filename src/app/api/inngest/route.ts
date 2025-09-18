import { serve } from "inngest/next";
import { inngest } from "@/inngest";
import { syncUser } from "@/inngest/sync-user";
import { checkBudgetAlerts } from "@/inngest/budget-alert";
import {
  processRecurringTransaction,
  triggerRecurringTransaction,
} from "@/inngest/recurring-transaction";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    syncUser,
    checkBudgetAlerts,
    triggerRecurringTransaction,
    processRecurringTransaction,
  ],
});
