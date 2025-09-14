import { ArrowDownRight, ArrowUpRight } from "lucide-react";

import { categoryOptions } from "@/db/schema";
export const category_options = categoryOptions.map((value: string) => ({
  value,
  label: value.charAt(0).toUpperCase() + value.slice(1),
}));

export const type_options = [
  {
    value: "income",
    label: "Income",
    icon: ArrowUpRight,
  },
  {
    value: "expense",
    label: "Expense",
    icon: ArrowDownRight,
  },
];
