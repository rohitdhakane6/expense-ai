import BudgetOverview from "@/components/main/budget-overview";
import { RecentTransactions } from "@/components/main/recent-transaction";
import TransactionPieChart from "@/components/main/transaction-PieChart";

export default function page() {
  return (
    <div>
      <BudgetOverview />
      <div className="grid gap-6 md:grid-cols-2">
        <RecentTransactions />
        <TransactionPieChart />
      </div>
    </div>
  );
}
