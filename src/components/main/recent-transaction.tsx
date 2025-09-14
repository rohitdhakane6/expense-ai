"use client";

import { format } from "date-fns";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useTransactions } from "@/hooks/useTransaction";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { formatCurrency } from "@/utils/format";

export function RecentTransactions() {
  const { data: transactions } = useTransactions();

  // Fallback if no transactions
  const recentTransactions = (transactions ?? []).slice(0, 5);

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold">
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
          <p className="text-muted-foreground py-6 text-center text-sm">
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
                  <p className="text-sm font-medium capitalize">
                    {transaction.name}
                  </p>
                  <p className="text-muted-foreground text-xs">
                    {format(new Date(transaction.transactionDate), "PP")}
                  </p>
                </div>
                <div
                  className={cn(
                    "flex items-center text-sm font-medium",
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
