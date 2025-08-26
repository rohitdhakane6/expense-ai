"use client";

import * as React from "react";
import {
  Home,
  CreditCard,
  PieChart,
  FolderKanban,
  Settings,
  LifeBuoy,
  Send,
} from "lucide-react";

import { Project } from "@/components/dashboard/project";
import { NavSecondary } from "@/components/dashboard/nav-secondary";
import { NavUser } from "@/components/dashboard/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { WorkspaceSwitcher } from "@/components/dashboard/workspace-swicher";

const data = {
  user: {
    name: "Rohit Dhakane",
    email: "rohit@example.com",
    avatar: "/avatars/user.jpg",
  },

  projects: [
    {
      title: "Project Alpha",
      url: "/projects/alpha",
      isActive: true,
      icon: Home,
    },
    {
      title: "Project Beta",
      url: "/projects/beta",
      icon: CreditCard,
    },
    {
      title: "Project Gamma",
      url: "/projects/gamma",
      icon: PieChart,
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "/settings",
      icon: Settings,
    },
    {
      title: "Support",
      url: "/support",
      icon: LifeBuoy,
    },
    {
      title: "Feedback",
      url: "/feedback",
      icon: Send,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar
      className="bg-background top-[var(--header-height)] h-[calc(100svh-var(--header-height))]"
      {...props}
      collapsible="icon"
      variant="inset"
    >
      <SidebarHeader>
        <WorkspaceSwitcher />
      </SidebarHeader>
      <SidebarContent>
        <Project projects={data.projects} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>

      {/* User Info */}
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
