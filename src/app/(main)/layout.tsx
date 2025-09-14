import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { UserButton } from "@clerk/nextjs";
import { ToggleTheme } from "@/components/toggle-theme";
import TransactionForm from "@/components/main/transaction-form";
import { Edit, LayoutDashboard } from "lucide-react";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="container mx-auto flex min-h-screen flex-col">
      {/* Navbar */}
      <Navbar />

      {/* Page Content */}
      <main className="flex-1">{children}</main>
    </div>
  );
}

const Navbar = () => {
  return (
    <nav className="bg-background sticky top-0 z-10 mb-5 flex items-center justify-between border-b px-6 py-4">
      {/* Left: App Name */}
      <Link href="/" className="text-primary text-2xl font-bold tracking-tight">
        Expense AI
      </Link>

      {/* Right: Actions */}
      <div className="flex items-center gap-3">
        <Button asChild variant="secondary">
          <Link href="/dashboard" className="flex items-center gap-2">
            <LayoutDashboard />
            Dashboard
          </Link>
        </Button>
        <TransactionForm>
          <Button variant="default" className="border border-dashed">
            <Edit />
            Add Transaction
          </Button>
        </TransactionForm>

        <ToggleTheme />
        <UserButton />
      </div>
    </nav>
  );
};
