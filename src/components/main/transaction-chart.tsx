"use client";

import { endOfDay, format, startOfDay, subDays } from "date-fns";
import { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTransactions } from "@/hooks/useTransaction";
import { formatCurrency } from "@/utils/format";

const DATE_RANGES = {
  "7D": { label: "Last 7 Days", days: 7 },
  "1M": { label: "Last Month", days: 30 },
  "3M": { label: "Last 3 Months", days: 90 },
  "6M": { label: "Last 6 Months", days: 180 },
  ALL: { label: "All Time", days: null },
};

type DateRangeKey = keyof typeof DATE_RANGES;

// Custom Tooltip Component
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload?.length) {
    return (
      <div className="rounded-lg border border-border bg-popover p-3 shadow-lg">
        <p className="mb-2 font-medium text-foreground">{label}</p>
        {payload.map((entry: any) => (
          <div key={entry.name} className="flex items-center gap-2">
            <div
              className="h-3 w-3 rounded-sm"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-muted-foreground text-sm">{entry.name}:</span>
            <span className="font-medium text-foreground text-sm">
              {formatCurrency(entry.value)}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function TransactionChart() {
  const { data: transactions } = useTransactions();
  const [dateRange, setDateRange] = useState<DateRangeKey>("1M");
  const [view, setView] = useState<"a" | "b">("b");
  const [showIncome, setShowIncome] = useState(true);
  const [showExpense, setShowExpense] = useState(true);

  const filteredData = useMemo(() => {
    const range = DATE_RANGES[dateRange];
    const now = new Date();
    const startDate = range.days
      ? startOfDay(subDays(now, range.days))
      : startOfDay(new Date(0));

    if (!transactions) return [];

    const filtered = transactions.filter(
      (t) =>
        new Date(t.transactionDate) >= startDate &&
        new Date(t.transactionDate) <= endOfDay(now),
    );

    type GroupedType = {
      [date: string]: { date: string; income: number; expense: number };
    };

    const grouped = filtered.reduce((acc: GroupedType, transaction) => {
      const date = format(new Date(transaction.transactionDate), "MMM dd");
      if (!acc[date]) {
        acc[date] = { date, income: 0, expense: 0 };
      }
      if (transaction.type === "income") {
        acc[date].income += Number(transaction.amount);
      } else {
        acc[date].expense += Number(transaction.amount);
      }
      return acc;
    }, {} as GroupedType);

    // Sort by actual date
    return Object.values(grouped).sort((a, b) => {
      const aDate = filtered.find(
        (t) => format(new Date(t.transactionDate), "MMM dd") === a.date,
      )?.transactionDate;
      const bDate = filtered.find(
        (t) => format(new Date(t.transactionDate), "MMM dd") === b.date,
      )?.transactionDate;
      // Every group came from `filtered`, so the lookups always succeed.
      return new Date(aDate ?? 0).getTime() - new Date(bDate ?? 0).getTime();
    });
  }, [transactions, dateRange]);

  const totals = useMemo(() => {
    return filteredData.reduce(
      (acc, day) => ({
        income: acc.income + day.income,
        expense: acc.expense + day.expense,
      }),
      { income: 0, expense: 0 },
    );
  }, [filteredData]);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="font-normal text-base">
          Transaction Overview
        </CardTitle>

        <div className="flex items-center gap-3">
          <Select
            defaultValue={dateRange}
            onValueChange={(value) => setDateRange(value as DateRangeKey)}
          >
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Select range" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(DATE_RANGES).map(([key, { label }]) => (
                <SelectItem key={key} value={key}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            defaultValue={view}
            onValueChange={(value) => setView(value as "a" | "b")}
          >
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Select view" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="a">Stacked View</SelectItem>
              <SelectItem value="b">Grouped View</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>

      <CardContent>
        {/* Totals */}
        <div className="mb-4 flex items-center justify-around">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground text-sm">Total Income</span>
            <span className="font-medium text-lg text-success">
              {formatCurrency(totals.income)}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground text-sm">Total Expense</span>
            <span className="font-medium text-destructive text-lg">
              {formatCurrency(totals.expense)}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground text-sm">Net Total</span>
            <span
              className={`font-medium text-lg ${
                totals.income - totals.expense >= 0
                  ? "text-success"
                  : "text-destructive"
              }`}
            >
              {formatCurrency(totals.income - totals.expense)}
            </span>
          </div>
        </div>

        {/* Chart */}
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={filteredData}
              margin={{ top: 10, right: 10, left: 10, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="date"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value, index) => (index % 2 === 0 ? value : "")}
              />
              <YAxis
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={formatCurrency}
              />
              <Tooltip
                content={<CustomTooltip />}
                cursor={{
                  fill: "rgba(59, 130, 246, 0.1)", // Light blue instead of gray
                  stroke: "rgba(59, 130, 246, 0.3)",
                  strokeWidth: 1,
                  radius: "4 4 0 0",
                  strokeDasharray: "4 2",
                }}
              />
              <Legend />

              {showIncome && (
                <Bar
                  dataKey="income"
                  name="Income"
                  fill="var(--success)"
                  stackId={view === "a" ? "stack" : undefined}
                  radius={[4, 4, 0, 0]}
                  animationDuration={500}
                />
              )}
              {showExpense && (
                <Bar
                  dataKey="expense"
                  name="Expense"
                  fill="var(--destructive)"
                  stackId={view === "a" ? "stack" : undefined}
                  radius={[4, 4, 0, 0]}
                  animationDuration={500}
                />
              )}
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Checkboxes to toggle income/expense */}
        <div className="mt-4 flex items-center gap-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={showIncome}
              onChange={() => setShowIncome(!showIncome)}
              className="h-4 w-4 accent-success"
            />
            Income
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={showExpense}
              onChange={() => setShowExpense(!showExpense)}
              className="h-4 w-4 accent-destructive"
            />
            Expense
          </label>
        </div>
      </CardContent>
    </Card>
  );
}
