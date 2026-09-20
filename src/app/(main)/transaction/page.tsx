import { Suspense } from "react";
import TransactionChart from "@/components/main/transaction-chart";
import TransactionTable from "@/components/main/transaction-table";
import { PageHeader } from "@/components/page-header";
import { Skeleton } from "@/components/ui/skeleton";

export default function Page() {
  return (
    <>
      <PageHeader
        title="Transactions"
        description="Every income and expense, with trends over time."
      />
      <div className="space-y-8">
        <Suspense
          fallback={
            <div className="space-y-8">
              <div className="space-y-3">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-40 w-full rounded-xl" />
              </div>
              <div className="space-y-3">
                <Skeleton className="h-6 w-40" />
                <div className="space-y-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    // biome-ignore lint/suspicious/noArrayIndexKey: static skeleton rows
                    <div key={i} className="flex space-x-3">
                      <Skeleton className="h-6 w-1/4 rounded-md" />
                      <Skeleton className="h-6 w-1/6 rounded-md" />
                      <Skeleton className="h-6 w-1/6 rounded-md" />
                      <Skeleton className="h-6 w-1/4 rounded-md" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          }
        >
          <TransactionChart />
          <TransactionTable />
        </Suspense>
      </div>
    </>
  );
}
