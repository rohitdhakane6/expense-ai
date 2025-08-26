"use client";

import * as React from "react";
import { ChevronsUpDown, GalleryVerticalEnd, Plus } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useWorkspaceStore } from "@/stores/workspace-store";
import { useWorkspaces, useCreateWorkspace } from "@/hooks/useWorkspaces";

export function WorkspaceSwitcher() {
  const [isOpen, setIsOpen] = React.useState(false);
  const { isMobile } = useSidebar();
  const { data: workspaces = [], isLoading, isSuccess } = useWorkspaces();

  const { selectedWorkspaceId, setSelectedWorkspace } = useWorkspaceStore();

  React.useEffect(() => {
    if (isSuccess && workspaces.length > 0) {
      setSelectedWorkspace(workspaces[0].id);
    }
  }, [isSuccess, workspaces, setSelectedWorkspace]);

  const activeWorkspace = workspaces.find(
    (ws) => ws.id === selectedWorkspaceId,
  );

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              disabled={isLoading}
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                <GalleryVerticalEnd />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium capitalize">
                  {activeWorkspace ? activeWorkspace.name : "Select workspace"}
                </span>
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-muted-foreground text-xs">
              Workspaces
            </DropdownMenuLabel>

            {isLoading && (
              <DropdownMenuItem disabled>Loading...</DropdownMenuItem>
            )}

            {isSuccess &&
              workspaces.map((workspace) => (
                <DropdownMenuItem
                  key={workspace.id}
                  onClick={() => setSelectedWorkspace(workspace.id)}
                  className="cursor-pointer gap-2 p-2 capitalize"
                >
                  <div className="flex size-6 items-center justify-center rounded-md border">
                    <span className="text-lg font-bold">
                      {workspace.name?.charAt(0)}
                    </span>
                  </div>
                  {workspace.name}
                </DropdownMenuItem>
              ))}

            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="cursor-pointer gap-2 p-2"
              onSelect={(e) => {
                setIsOpen(true);
              }}
            >
              <div className="flex size-6 items-center justify-center rounded-md border bg-transparent">
                <Plus className="size-4" />
              </div>
              <div className="text-muted-foreground font-medium">
                Add Workspace
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* ✅ Dialog for creating workspace */}
        <AddWorkspace isOpen={isOpen} setIsOpen={setIsOpen} />
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

// ✅ Dialog with form + mutation
function AddWorkspace({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [name, setName] = React.useState("");
  const { mutate: createWorkspace, isPending } = useCreateWorkspace();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    createWorkspace(
      name, // send payload to server action
      {
        onSuccess: () => {
          setName("");
          setIsOpen(false); // close dialog after success
        },
      },
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a new workspace</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            placeholder="Workspace name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Button type="submit" disabled={isPending}>
            {isPending ? "Creating..." : "Create"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
