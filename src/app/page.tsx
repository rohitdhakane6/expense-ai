import { Metadata } from "next";
import { Waitlist } from "@/components/wait-list";

export const metadata: Metadata = {
  title: "ExpenseAI Waitlist – Get Notified on Launch",
  description:
    "Join the ExpenseAI waitlist to get notified when we launch! Be the first to access smart expense tracking, billing management, and AI-powered financial automation.",
};

export default function page() {
  return <Waitlist />;
}
