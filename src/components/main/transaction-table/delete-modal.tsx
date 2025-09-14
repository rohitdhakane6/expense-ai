import React from "react";
import { Trash2, Loader2 } from "lucide-react";
import { useDeleteTransaction } from "@/hooks/useTransaction";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

export default function DeleteDialog({
  rowIds,
  onDelete,
}: {
  rowIds: string[];
  onDelete?: () => void;
}) {
  const { isPending, mutateAsync: deleteTransaction } = useDeleteTransaction();
  async function handleDelete() {
    if (rowIds.length === 0) return;

    await deleteTransaction({ id: rowIds });
    if (onDelete) {
      onDelete();
    }
  }

  return (
    <div>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="destructive" size="sm" disabled={isPending}>
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deleting... {rowIds.length}
              </>
            ) : (
              <>
                <Trash2 className="mr-2 h-4 w-4" />
                Delete {rowIds.length}
              </>
            )}
          </Button>
        </AlertDialogTrigger>

        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Delete {rowIds.length} transaction?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. These transactions will be
              permanently removed from your account.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="border-destructive/50 bg-destructive/10 text-destructive rounded-md border p-3 text-sm">
            ⚠️ Please confirm carefully. Once deleted, data cannot be recovered.
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction asChild>
              <Button disabled={isPending} onClick={handleDelete}>
                {isPending ? "Deleting..." : "Confirm"}
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
