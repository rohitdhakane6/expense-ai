import {
  pgTable,
  uuid,
  varchar,
  text,
  decimal,
  timestamp,
  boolean,
  pgEnum,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createSelectSchema, createInsertSchema } from "drizzle-zod";

// =============================================================================
// SHARED
// =============================================================================

const timestamps = {
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
    () => new Date(),
  ),
};

// =============================================================================
// TABLES
// =============================================================================

// Users Table
export const users = pgTable("users", {
  id: varchar("id", { length: 255 }).primaryKey(),
  name: varchar("name", { length: 100 }),
  email: varchar("email", { length: 150 }).notNull().unique(),
  phone: varchar("phone", { length: 20 }).unique(),
  ...timestamps,
});

// Budgets Table (1:1 with users)
export const budgets = pgTable("budgets", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: varchar("user_id", { length: 255 })
    .notNull()
    .references(() => users.id, { onDelete: "cascade" })
    .unique(), // ensures one budget per user
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  isLastAlertSent: boolean("is_last_alert_sent").default(false).notNull(),
  ...timestamps,
});

// Transactions Table (1:N with users)
export const typeEnum = pgEnum("transaction_type", ["income", "expense"]);
export const recurringIntervalEnum = pgEnum("recurring_interval", [
  "daily",
  "weekly",
  "monthly",
  "yearly",
]);
export const categoryEnum = pgEnum("transaction_category", [
  "groceries",
  "utilities",
  "rent",
  "entertainment",
  "transportation",
  "dining",
  "health",
  "shopping",
  "education",
  "travel",
  "other",
]);

export const transactions = pgTable("transactions", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: varchar("user_id", { length: 255 })
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  type: typeEnum().notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  name: varchar("name", { length: 200 }).notNull(),
  description: text("description"),
  category: categoryEnum().default("other").notNull(),
  isRecurring: boolean("is_recurring").default(false).notNull(),
  recurringInterval: recurringIntervalEnum(), // now enum instead of varchar
  nextRecurringDate: timestamp("next_recurring_date", { withTimezone: true }),
  lastProcessedDate: timestamp("last_processed_date", { withTimezone: true }),
  transactionDate: timestamp("transaction_date", { withTimezone: true })
    .notNull()
    .defaultNow(),
  ...timestamps,
});

// =============================================================================
// RELATIONS
// =============================================================================

export const usersRelations = relations(users, ({ one, many }) => ({
  budget: one(budgets), // 1:1
  transactions: many(transactions), // 1:N
}));

export const budgetsRelations = relations(budgets, ({ one }) => ({
  user: one(users, {
    fields: [budgets.userId],
    references: [users.id],
  }),
}));

export const transactionsRelations = relations(transactions, ({ one }) => ({
  user: one(users, {
    fields: [transactions.userId],
    references: [users.id],
  }),
}));

// =============================================================================
// TYPES
// =============================================================================

export const transactionSelectSchema = createSelectSchema(transactions);
export const transactionInsertSchema = createInsertSchema(transactions);

export const typeOptions = typeEnum.enumValues;
export const categoryOptions = categoryEnum.enumValues;
export const recurringIntervalOptions = recurringIntervalEnum.enumValues;
