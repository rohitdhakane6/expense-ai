"use client";

import { ArrowRight, BellRing, PieChart, ScanLine } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useSession } from "@/lib/auth-client";

export function HeroSection() {
  const { data: session, isPending } = useSession();
  const signedIn = Boolean(session?.user);

  return (
    <section className="mx-auto max-w-3xl px-6 pt-24 pb-20 text-center sm:pt-32 sm:pb-28">
      <p className="mb-4 font-medium text-muted-foreground text-sm uppercase tracking-wide">
        Personal finance, simplified
      </p>
      <h1 className="text-balance font-semibold text-4xl text-foreground tracking-tight sm:text-6xl">
        Know where your money goes.
      </h1>
      <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg text-muted-foreground sm:text-xl">
        Snap a receipt and let AI log it. Set a budget and get an email before
        you blow through it. See your whole month at a glance.
      </p>

      <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
        {isPending ? null : signedIn ? (
          <Button asChild size="lg">
            <Link href="/dashboard">
              Open dashboard
              <ArrowRight />
            </Link>
          </Button>
        ) : (
          <>
            <Button asChild size="lg">
              <Link href="/sign-up">
                Get started
                <ArrowRight />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/sign-in">Sign in</Link>
            </Button>
          </>
        )}
      </div>
    </section>
  );
}

const features = [
  {
    icon: ScanLine,
    title: "Scan receipts with AI",
    description:
      "Photograph a receipt and the merchant, amount, date and category are extracted and filed as a transaction. No typing.",
  },
  {
    icon: BellRing,
    title: "Budget alerts that arrive in time",
    description:
      "Set a monthly budget. When spending crosses 80%, you get an email — while there's still something you can do about it.",
  },
  {
    icon: PieChart,
    title: "Your month at a glance",
    description:
      "A category breakdown, recent activity and spending trends on one screen. Recurring expenses are logged for you.",
  },
] as const;

export function FeaturesSection() {
  return (
    <section className="border-t">
      <div className="mx-auto grid max-w-6xl gap-px px-6 py-20 sm:grid-cols-3 sm:py-24">
        {features.map(({ icon: Icon, title, description }) => (
          <div key={title} className="flex flex-col gap-4 py-8 sm:px-8 sm:py-0">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted text-foreground">
              <Icon className="h-5 w-5" aria-hidden />
            </div>
            <h2 className="font-semibold text-foreground text-lg">{title}</h2>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="border-t">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-6 py-8 text-muted-foreground text-sm sm:flex-row">
        <span>ExpenseAI</span>
        <span>
          Built by{" "}
          <a
            href="https://www.rohitdhakane.in"
            className="text-foreground underline-offset-4 hover:underline"
            target="_blank"
            rel="noreferrer"
          >
            Rohit Dhakane
          </a>
        </span>
      </div>
    </footer>
  );
}
