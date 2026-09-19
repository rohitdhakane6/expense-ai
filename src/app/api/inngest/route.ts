import { serve } from "inngest/next";
import { inngest } from "@/inngest";
import { checkBudgetAlerts } from "@/inngest/budget-alert";
import {
  processRecurringTransaction,
  triggerRecurringTransaction,
} from "@/inngest/recurring-transaction";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    checkBudgetAlerts,
    triggerRecurringTransaction,
    processRecurringTransaction,
  ],
});
