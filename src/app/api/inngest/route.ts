import { serve } from "inngest/next";
import { inngest } from "@/inngest/client";
import { syncUser } from "@/inngest/sync-user";
import { checkBudgetAlerts } from "@/inngest/budget-alert";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [syncUser, checkBudgetAlerts],
});
