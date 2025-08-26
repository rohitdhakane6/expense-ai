"use client";

import { SidebarIcon } from "lucide-react";

import { SearchForm } from "@/components/dashboard/search-form";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useSidebar } from "@/components/ui/sidebar";
import { ToggleTheme } from "@/components/toggle-theme";

export function SiteHeader() {
  const { toggleSidebar } = useSidebar();

  return (
    <header className="bg-background sticky top-0 z-50 flex w-full items-center">
      <div className="flex h-(--header-height) w-full items-center gap-2 px-4">
        <Button
          className="h-8 w-8"
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
        >
          <SidebarIcon />
        </Button>
        <h1
          className="text-lg font-semibold tracking-tight sm:text-xl"
          title="Expense AI"
        >
          Expense AI
        </h1>
        <div className="w-full sm:ml-auto sm:w-auto"></div>

        <SearchForm />
        <ToggleTheme />
      </div>
    </header>
  );
}
