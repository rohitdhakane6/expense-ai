import { getBudget, updateBudget } from "@/actions/budget";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
export function useBudget() {
  return useQuery({
    queryKey: ["budget"],
    queryFn: async () => {
      const res = await getBudget();
      return res;
    },
  });
}

export function useBudgetUpdate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateBudget,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["budget"] });
    },
  });
}
