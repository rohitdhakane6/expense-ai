"use client";

import { format } from "date-fns";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTransactions } from "@/hooks/useTransaction";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/utils/format";

export function RecentTransactions() {
  const { data: transactions } = useTransactions();

  // Fallback if no transactions
  const recentTransactions = (transactions ?? []).slice(0, 5);

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="font-semibold text-base">
          <div className="flex items-center justify-between">
            <div>Recent Transactions</div>
            <Button asChild variant="link">
              <Link href="/transaction">View All</Link>
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {recentTransactions.length === 0 ? (
          <p className="py-6 text-center text-muted-foreground text-sm">
            No recent transactions
          </p>
        ) : (
          <div className="divide-y">
            {recentTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between py-3"
              >
                <div>
                  <p className="font-medium text-sm capitalize">
                    {transaction.name}
                  </p>
                  <p className="text-muted-foreground text-xs">
                    {format(new Date(transaction.transactionDate), "PP")}
                  </p>
                </div>
                <div
                  className={cn(
                    "flex items-center font-medium text-sm",
                    transaction.type === "expense"
                      ? "text-red-500"
                      : "text-green-500",
                  )}
                >
                  {transaction.type === "expense" ? (
                    <ArrowDownRight className="mr-1 h-4 w-4" />
                  ) : (
                    <ArrowUpRight className="mr-1 h-4 w-4" />
                  )}
                  {formatCurrency(transaction.amount)}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
