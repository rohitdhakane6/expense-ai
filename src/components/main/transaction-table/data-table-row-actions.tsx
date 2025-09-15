"use client";

import * as React from "react";
import { Row } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { Copy, MoreHorizontal, Pencil, Trash2, Loader2 } from "lucide-react";
import { transactionSelectSchema } from "@/db/schema";
import { useDeleteTransaction } from "@/hooks/useTransaction";
import { toast } from "sonner";
import TransactionForm from "@/components/main/transaction-form";

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const [showDeleteDialog, setShowDeleteDialog] =
    React.useState<boolean>(false);
  const [dropdownOpen, setDropdownOpen] = React.useState(false);

  const { isPending, mutateAsync: deleteTransaction } = useDeleteTransaction();
  const transaction = transactionSelectSchema.parse(row.original);

  const handleDeleteClick = () => {
    setDropdownOpen(false);
    setShowDeleteDialog(true);
  };

  const handleDelete = async () => {
    try {
      toast.loading("Deleting transaction...", { position: "top-center" });
      await deleteTransaction({ id: [transaction.id] });
      setShowDeleteDialog(false);
      toast.dismiss();
      toast.success(`Transaction deleted successfully`, {
        position: "top-center",
      });
    } catch (error) {
      console.error("Failed to delete transaction:", error);
      toast.dismiss();
      toast.error("Failed to delete transaction", { position: "top-center" });
    }
  };

  const handleCopyId = () => {
    navigator.clipboard.writeText(transaction.id);
    toast.success("Transaction ID copied to clipboard", {
      position: "top-center",
    });
  };

  return (
    <>
      <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="data-[state=open]:bg-muted flex h-8 w-8 p-0"
          >
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[200px]">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>

          <DropdownMenuItem onClick={handleCopyId}>
            <Copy className="mr-2 h-4 w-4" />
            Copy Transaction ID
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <TransactionForm
            isEdit={true}
            transactionData={transaction}
            onSuccess={() => {
              setDropdownOpen(false);
              toast.success("Transaction updated successfully", {
                position: "top-center",
              });
            }}
          >
            <DropdownMenuItem
              onSelect={(e) => e.preventDefault()}
              className="cursor-pointer"
            >
              <Pencil className="mr-2 h-4 w-4" />
              Edit Details
            </DropdownMenuItem>
          </TransactionForm>

          <DropdownMenuItem
            className="text-destructive focus:text-destructive cursor-pointer"
            onClick={handleDeleteClick}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Transaction?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This transaction will be permanently
              removed from your account.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="border-destructive/50 bg-destructive/10 text-destructive rounded-md border p-3 text-sm">
            ⚠️ Please confirm carefully. Once deleted, data cannot be recovered.
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction asChild>
              <Button
                variant="destructive"
                disabled={isPending}
                onClick={handleDelete}
              >
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  "Confirm Delete"
                )}
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
