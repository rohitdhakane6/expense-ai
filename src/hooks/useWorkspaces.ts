import { createWorkspace, getWorkspaces } from "@/app/actions/workspaces";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// React Query hooks
export function useWorkspaces() {
  return useQuery({
    queryKey: ["workspaces"],
    queryFn: async () => {
      const res = await getWorkspaces();
      return res;
    },
  });
}

export function useCreateWorkspace() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createWorkspace,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
    },
  });
}
