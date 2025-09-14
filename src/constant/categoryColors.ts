import { categoryOptions } from "@/db/schema";

export const categoryColors: Record<
  (typeof categoryOptions)[number],
  { className: string; color: string }
> = {
  groceries: { className: "text-green-800 bg-green-100", color: "#22c55e" },
  utilities: { className: "text-blue-800 bg-blue-100", color: "#3b82f6" },
  rent: { className: "text-purple-800 bg-purple-100", color: "#9333ea" },
  entertainment: { className: "text-pink-800 bg-pink-100", color: "#ec4899" },
  transportation: {
    className: "text-yellow-800 bg-yellow-100",
    color: "#eab308",
  },
  dining: { className: "text-red-800 bg-red-100", color: "#ef4444" },
  health: { className: "text-teal-800 bg-teal-100", color: "#14b8a6" },
  shopping: { className: "text-indigo-800 bg-indigo-100", color: "#6366f1" },
  education: { className: "text-orange-800 bg-orange-100", color: "#f97316" },
  travel: { className: "text-cyan-800 bg-cyan-100", color: "#06b6d4" },
  other: { className: "text-gray-800 bg-gray-100", color: "#6b7280" },
};
