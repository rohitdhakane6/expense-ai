import {
  pgTable,
  uuid,
  varchar,
  text,
  decimal,
  timestamp,
} from "drizzle-orm/pg-core";
import { email } from "zod";

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 100 }),
  email: varchar("email", { length: 150 }).notNull().unique(),
  phone: varchar("phone", { length: 15 }).unique(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

// Project
export const projects = pgTable("projects", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 150 }).notNull(),
  description: text("description"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

// Expense
export const expenses = pgTable("expenses", {
  id: uuid("id").primaryKey().defaultRandom(),
  projectId: uuid("project_id")
    .notNull()
    .references(() => projects.id, { onDelete: "cascade" }),
  title: varchar("title", { length: 150 }).notNull(), // e.g., "cement"
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  note: text("note"),
  date: timestamp("date", { withTimezone: true }).defaultNow(),
  receiptUrl: varchar("receipt_url", { length: 500 }), // Cloudflare R2 URL if uploaded
});

