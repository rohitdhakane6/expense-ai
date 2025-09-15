"use client";

import { Button } from "@/components/ui/button";
import { MoonStarIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";
import React, { useCallback } from "react";

export function ToggleTheme() {
  const { resolvedTheme, setTheme } = useTheme();

  const handleToggle = useCallback(() => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  }, [resolvedTheme, setTheme]);

  return (
    <Button
      className="c cursor-pointer"
      variant="outline"
      size="icon"
      onClick={handleToggle}
    >
      <MoonStarIcon className="hidden dark:block" />
      <SunIcon className="block dark:hidden" />
      <span className="sr-only">Toggle Theme</span>
    </Button>
  );
}
