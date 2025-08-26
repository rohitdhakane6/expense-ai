"use client";

import { type LucideIcon } from "lucide-react";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

interface ProjectProps {
  title: string;
  url: string;
  icon: LucideIcon;
  isActive?: boolean;
}

export function Project({ projects }: { projects: ProjectProps[] }) {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Projects</SidebarGroupLabel>
      <SidebarMenu>
        {projects.map((project) => (
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              tooltip={project.title}
              className={cn({
                "bg-primary hover:bg-primary": project.isActive,
              })}
            >
              <a href={project.url}>
                <project.icon />
                <span>{project.title}</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
