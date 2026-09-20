import { relations } from "drizzle-orm";
import {
  boolean,
  decimal,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

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
// BETTER AUTH TABLES
// =============================================================================

// Users Table
export const users = pgTable("users", {
  id: varchar("id", { length: 255 }).primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  emailVerified: boolean("email_verified").default(false).notNull(),
  image: text("image"),
  phone: varchar("phone", { length: 20 }).unique(),
  ...timestamps,
});

// Sessions Table
export const sessions = pgTable("sessions", {
  id: varchar("id", { length: 255 }).primaryKey(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: varchar("user_id", { length: 255 })
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
});

// Accounts Table
export const accounts = pgTable("accounts", {
  id: varchar("id", { length: 255 }).primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: varchar("user_id", { length: 255 })
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at", {
    withTimezone: true,
  }),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at", {
    withTimezone: true,
  }),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }),
});

// Verifications Table
export const verifications = pgTable("verifications", {
  id: varchar("id", { length: 255 }).primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }),
  updatedAt: timestamp("updated_at", { withTimezone: true }),
});

// =============================================================================
// APP TABLES
// =============================================================================

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
  recurringInterval: recurringIntervalEnum(),
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
  budget: one(budgets),
  transactions: many(transactions),
  sessions: many(sessions),
  accounts: many(accounts),
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, {
    fields: [sessions.userId],
    references: [users.id],
  }),
}));

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, {
    fields: [accounts.userId],
    references: [users.id],
  }),
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
