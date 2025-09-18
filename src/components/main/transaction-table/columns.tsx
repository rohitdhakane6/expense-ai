"use client";

import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTableColumnHeader } from "@/components/main/transaction-table/data-table-column-header";
import { transactions } from "@/db/schema";
import { DataTableRowActions } from "./data-table-row-actions";
import { categoryColors } from "@/constant/categoryColors";
import { formatCurrency } from "@/utils/format";
import { getRecurringIntervalDescription } from "@/lib/calculateNextRecurringDate";
import { RefreshCcw } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export type Transaction = typeof transactions.$inferSelect;

export const columns: ColumnDef<Transaction>[] = [
  // ✅ Select
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value: any) =>
          table.toggleAllPageRowsSelected(!!value)
        }
        aria-label="Select all"
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value: any) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },

  // ✅ Name
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("name")}</div>
    ),
  },

  // ✅ Category
  {
    accessorKey: "category",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Category" />
    ),
    cell: ({ row }) => {
      const category = row.getValue("category") as string;

      const colorClass =
        categoryColors[category as keyof typeof categoryColors].className;

      return (
        <Badge variant="outline" className={colorClass}>
          {category.charAt(0).toUpperCase() + category.slice(1)}
        </Badge>
      );
    },
    filterFn(row, id, value) {
      return value.includes(row.getValue(id));
    },
  },

  // ✅ Type (Income / Expense)
  {
    accessorKey: "type",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Type" />
    ),
    cell: ({ row }) => {
      const type = row.getValue("type") as string;
      return (
        <Badge
          variant="outline"
          className={
            type === "income"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }
        >
          {type.charAt(0).toUpperCase() + type.slice(1)}
        </Badge>
      );
    },
    filterFn(row, id, value) {
      return value.includes(row.getValue(id));
    },
  },

  // ✅ Amount (with colors)
  {
    accessorKey: "amount",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Amount" />
    ),
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"));
      const type = row.original.type;

      return (
        <div
          className={`font-semibold ${
            type === "income" ? "text-green-600" : "text-red-600"
          }`}
        >
          {type === "income"
            ? `+${formatCurrency(amount)}`
            : `-${formatCurrency(amount)}`}
        </div>
      );
    },
  },

  // ✅ Date
  {
    accessorKey: "transactionDate",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Date" />
    ),
    cell: ({ row }) => {
      const raw = row.getValue("transactionDate") as string;
      const date = new Date(raw);

      return (
        <div className="text-muted-foreground">
          {format(date, "MMM dd, yyyy - hh:mm a")}
        </div>
      );
    },
  },

  // ✅ Recurring
  {
    accessorKey: "isRecurring",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Recurring" />
    ),
    cell: ({ row }) => {
      const isRecurring = row.getValue("isRecurring") as boolean;
      const interval = row.original.recurringInterval;
      const nextDate = row.original.nextRecurringDate;

      if (!isRecurring && !interval) {
        return <Badge variant="outline">One-time</Badge>;
      }

      return (
        <div className="flex flex-col">
          <Tooltip>
            <TooltipTrigger asChild>
              <Badge className="bg-purple-100 text-purple-700">
                <RefreshCcw />
                {getRecurringIntervalDescription(interval!)}
              </Badge>
            </TooltipTrigger>
            {nextDate && (
              <TooltipContent>
                Next Date : {format(nextDate, "MMM dd, yyyy")}
              </TooltipContent>
            )}
          </Tooltip>
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];
