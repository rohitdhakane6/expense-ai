"use client";

import { Check, Pencil, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { useBudget, useBudgetUpdate } from "@/hooks/useBudget";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/utils/format";

export default function BudgetOverview() {
  const { data } = useBudget();
  const { mutateAsync: updateBudget, isPending } = useBudgetUpdate();
  const [isEditing, setIsEditing] = useState(false);
  const [newBudget, setNewBudget] = useState("");

  // Seed the draft from the current budget when entering edit mode
  function startEditing() {
    setNewBudget(data?.amount ? String(data.amount) : "");
    setIsEditing(true);
  }

  const percentUsed = data
    ? Math.min(
        (Number(data.currentExpenses) / Math.max(Number(data.amount), 1)) * 100,
        100,
      )
    : 0;

  async function handleUpdate() {
    const amount = parseFloat(newBudget);
    if (Number.isNaN(amount) || amount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    await updateBudget({ amount: String(amount) });
    setIsEditing(false);
  }

  return (
    <div className="mb-6 rounded-2xl border p-6">
      <h2 className="font-semibold text-xl">Budget Overview</h2>
      <p className="mt-1 text-muted-foreground text-sm">Monthly Budget</p>

      <div className="mt-4">
        {isEditing ? (
          <div className="flex max-w-sm items-center gap-2">
            <Input
              placeholder="Enter new budget"
              value={newBudget}
              onChange={(e) => setNewBudget(e.target.value)}
            />
            <Button size="icon" onClick={handleUpdate} disabled={isPending}>
              <Check className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsEditing(false)}
              disabled={isPending}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : data?.amount ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-medium text-lg">
                {formatCurrency(data.amount)}
              </span>
              <span className="font-medium text-lg">
                {formatCurrency(data.currentExpenses)}
              </span>
              <Button variant="ghost" size="icon" onClick={startEditing}>
                <Pencil className="h-4 w-4" />
              </Button>
            </div>
            <Progress
              value={percentUsed}
              className={cn(
                percentUsed > 90
                  ? "bg-red-500"
                  : percentUsed > 80
                    ? "bg-yellow-400"
                    : "",
              )}
            />

            <p className="text-muted-foreground text-xs">
              {percentUsed.toFixed(1)}% used
            </p>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground text-sm">No budget set</span>
            <Button size="sm" onClick={startEditing}>
              Set Budget
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
