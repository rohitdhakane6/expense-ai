"use client";

import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider, useTheme } from "next-themes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { dark } from "@clerk/themes";
import React from "react";
import { Toaster } from "@/components/ui/sonner";

function ClerkWithTheme({ children }: { children: React.ReactNode }) {
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Don’t render ClerkProvider until theme is known
    return null;
  }

  return (
    <ClerkProvider
      appearance={{
        baseTheme: (theme ?? resolvedTheme) === "dark" ? dark : undefined,
      }}
    >
      {children}
    </ClerkProvider>
  );
}

export default function Provider({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient();

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <QueryClientProvider client={queryClient}>
        <ClerkWithTheme>
          <Toaster richColors position="top-center" />
          {children}
        </ClerkWithTheme>
      </QueryClientProvider>
    </ThemeProvider>
  );
}
