import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import TransactionChart from "@/components/main/transaction-chart";
import TransactionTable from "@/components/main/transaction-table";

export default function TransactionsSection() {
  return (
    <div className="space-y-8 px-5">
      <Suspense
        fallback={
          <div className="mt-4 space-y-8">
            {/* Chart Skeleton */}
            <div className="flex flex-col space-y-3">
              <Skeleton className="h-6 w-32" /> {/* Chart title */}
              <Skeleton className="h-40 w-full rounded-xl" /> {/* Chart area */}
            </div>

            {/* Table Skeleton */}
            <div className="space-y-3">
              <Skeleton className="h-6 w-40" /> {/* Table title */}
              <div className="space-y-2">
                {Array.from({ length: 5 }).map((_, i) => (
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
  );
}
