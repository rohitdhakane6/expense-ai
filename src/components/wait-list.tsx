"use client";
import { BackgroundBeams } from "@/components/ui/background-beams";
import Link from "next/link";
import { useState } from "react";
import z from "zod";

export function Waitlist() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(false);

    const emailSchema = z.string().email();
    const validation = emailSchema.safeParse(email);
    if (!validation.success) {
      setError(true);
      return;
    }

    setIsSubmitting(true);

    try {
      await fetch("/api/waitlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      setIsSubmitted(true);
      setEmail("");
    } catch (_err) {
      setError(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen w-full bg-neutral-950 relative flex flex-col items-center justify-center antialiased">
        <FloatingLogo />
        <div className="max-w-2xl w-full mx-auto p-4 z-10 text-center">
          <div className="mb-6">
            <div className="w-16 h-16 bg-teal-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-teal-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          </div>

          <h1 className="text-3xl md:text-5xl font-bold bg-clip-text  bg-gradient-to-b text-neutral-400 mb-4">
            You're In! 🎉
          </h1>
          <p className="text-neutral-400 text-lg mb-6 max-w-md mx-auto">
            Thanks for joining the ExpenseAI waitlist. We'll notify you as soon
            as we launch!
          </p>
        </div>
        <BackgroundBeams />
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-neutral-950 relative flex flex-col items-center justify-center antialiased">
      <FloatingLogo />
      <div className="max-w-2xl w-full mx-auto p-4 z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-teal-500/10 border border-teal-500/20 rounded-full px-4 py-2 mb-6">
            <div className="w-2 h-2 bg-teal-400 rounded-full animate-pulse"></div>
            <span className="text-teal-300 text-sm font-medium">
              Coming Soon
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-600 mb-4 leading-tight">
            Join the <span className="text-teal-400">ExpenseAI</span> Waitlist
          </h1>
          <p className="text-neutral-400 text-lg md:text-xl leading-relaxed max-w-xl mx-auto">
            Text your expenses. We'll do the math.{" "}
            <br className="hidden sm:block" />
            Send receipts on WhatsApp and unlock powerful billing insights.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          noValidate
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <div className="flex-1 max-w-sm w-full">
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (error) setError(false);
              }}
              required
              disabled={isSubmitting}
              className={`w-full rounded-lg bg-neutral-900 border text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent px-4 py-3 transition-all duration-200 ${
                error
                  ? "border-red-500/50 focus:ring-red-500"
                  : "border-neutral-700 hover:border-neutral-600"
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-3 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed min-w-[120px] cursor-pointer"
          >
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Joining...</span>
              </div>
            ) : (
              "Notify Me"
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-xs text-neutral-500">
            No spam. Just one email when we're live.
          </p>
        </div>

        {/* Feature highlights */}
        <div className="mt-12  grid-cols-3 hidden md:grid gap-6 text-center ">
          <div className="space-y-2">
            <div className="w-10 h-10 bg-teal-500/20 rounded-lg flex items-center justify-center mx-auto">
              <svg
                className="w-5 h-5 text-teal-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
            </div>
            <h3 className="text-white font-medium">WhatsApp Integration</h3>
            <p className="text-neutral-500 text-sm">
              Send receipts directly via WhatsApp
            </p>
          </div>

          <div className="space-y-2">
            <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center mx-auto">
              <svg
                className="w-5 h-5 text-blue-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
            <h3 className="text-white font-medium">Smart Analytics</h3>
            <p className="text-neutral-500 text-sm">
              AI-powered expense insights
            </p>
          </div>

          <div className="space-y-2">
            <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center mx-auto">
              <svg
                className="w-5 h-5 text-purple-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <h3 className="text-white font-medium">Instant Processing</h3>
            <p className="text-neutral-500 text-sm">
              Real-time expense categorization
            </p>
          </div>
        </div>
      </div>
      <BackgroundBeams />
    </div>
  );
}

// Floating Logo Component
const FloatingLogo = () => (
  <Link href="/" className="fixed top-6 left-6 z-50 flex items-center gap-3">
    {/* Logo */}
    <div className="w-10 h-10 bg-gradient-to-br from-teal-400 to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
      <svg
        className="w-6 h-6 text-white"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
        />
      </svg>
    </div>
    {/* Brand Name */}
    <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-neutral-300">
      ExpenseAI
    </span>
  </Link>
);
