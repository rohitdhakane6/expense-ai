import { create } from "zustand";

interface WorkspaceStore {
  selectedWorkspaceId: string | null;
  setSelectedWorkspace: (id: string | null) => void;
}

export const useWorkspaceStore = create<WorkspaceStore>((set) => ({
  selectedWorkspaceId: null,
  setSelectedWorkspace: (id) => set({ selectedWorkspaceId: id }),
}));
