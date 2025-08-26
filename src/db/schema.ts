import {
  pgTable,
  uuid,
  varchar,
  text,
  decimal,
  timestamp,
  primaryKey,
  boolean,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";

// =============================================================================
// CONSTANTS & TYPES
// =============================================================================

export const USER_WORKSPACE_ROLES = ["admin", "member"] as const;
export type UserWorkspaceRole = (typeof USER_WORKSPACE_ROLES)[number];

// =============================================================================
// TABLES
// =============================================================================

// Users Table
export const users = pgTable("users", {
  id: varchar("id", { length: 255 }).primaryKey(),
  name: varchar("name", { length: 100 }),
  email: varchar("email", { length: 150 }).notNull().unique(),
  phone: varchar("phone", { length: 20 }).unique(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

// Workspaces Table
export const workspaces = pgTable("workspaces", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 150 }).notNull(),
  description: text("description"),
  createdBy: varchar("created_by", { length: 255 })
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

// Junction Table - Users to Workspaces (Many-to-Many)
export const usersToWorkspaces = pgTable(
  "users_to_workspaces",
  {
    userId: varchar("user_id", { length: 255 })
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),

    workspaceId: uuid("workspace_id")
      .notNull()
      .references(() => workspaces.id, { onDelete: "cascade" }),

    role: varchar("role", { length: 50, enum: USER_WORKSPACE_ROLES })
      .notNull()
      .default("member"),

    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),

    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.userId, table.workspaceId] }),
  }),
);

// =============================================================================
// RELATIONS
// =============================================================================

// Users to Workspaces Relations (Junction Table)
export const usersRelations = relations(users, ({ many }) => ({
  workspaces: many(usersToWorkspaces),
}));

export const workspacesRelations = relations(workspaces, ({ many, one }) => ({
  users: many(usersToWorkspaces),
  creator: one(users, {
    fields: [workspaces.createdBy],
    references: [users.id],
  }),
}));

export const usersToWorkspacesRelations = relations(
  usersToWorkspaces,
  ({ one }) => ({
    user: one(users, {
      fields: [usersToWorkspaces.userId],
      references: [users.id],
    }),
    workspace: one(workspaces, {
      fields: [usersToWorkspaces.workspaceId],
      references: [workspaces.id],
    }),
  }),
);

// =============================================================================
// SCHEMAS
// =============================================================================

export const WorkspacesCreateSchema = createInsertSchema(workspaces, {
  name: (schema) => schema.min(3).max(150),
  description: (schema) => schema.max(500).optional(),
  createdBy: (schema) => schema.optional(),
});
