"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { UserButton } from "@/components/user-button";
import { useSession } from "@/lib/auth-client";

export function Navbar() {
  const { data: session, isPending } = useSession();

  return (
    <header className="bg-background/80 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40 border-b backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Logo />

        <nav className="flex items-center gap-3">
          {isPending ? null : session?.user ? (
            <>
              <Button asChild size="sm">
                <Link href="/dashboard">
                  Open dashboard
                  <ArrowRight />
                </Link>
              </Button>
              <UserButton />
            </>
          ) : (
            <>
              <Button asChild variant="ghost" size="sm">
                <Link href="/sign-in">Sign in</Link>
              </Button>
              <Button asChild size="sm">
                <Link href="/sign-up">
                  Get started
                  <ArrowRight />
                </Link>
              </Button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
