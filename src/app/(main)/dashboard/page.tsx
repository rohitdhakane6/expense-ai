import BudgetOverview from "@/components/main/budget-overview";
import { RecentTransactions } from "@/components/main/recent-transaction";
import TransactionPieChart from "@/components/main/transaction-PieChart";
import { PageHeader } from "@/components/page-header";

export default function Page() {
  return (
    <>
      <PageHeader
        title="Dashboard"
        description="Your budget and spending for this month."
      />
      <BudgetOverview />
      <div className="grid gap-6 md:grid-cols-2">
        <RecentTransactions />
        <TransactionPieChart />
      </div>
    </>
  );
}
