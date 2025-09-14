import {
  createTransaction,
  deleteTransaction,
  getTransactions,
  updateTransaction,
} from "@/actions/transactions";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";

// ✅ Hook for fetching transactions
export function useTransactions() {
  return useSuspenseQuery({
    queryKey: ["transactions"],
    queryFn: async () => {
      const res = await getTransactions();
      return res;
    },
  });
}

// ✅ Hook for creating a transaction
export function useCreateTransaction() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
  });
}

export function useDeleteTransaction() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
  });
}
export function useUpdateTransaction() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
  });
}
