import { reset, seed } from "drizzle-seed";
import { db } from "@/db";
import { users, workspaces, usersToWorkspaces } from "@/db/schema";
import * as schema from "@/db/schema";

async function main() {
  console.log("🔄 Resetting database...");
  await reset(db, schema);
  console.log("✅ Database reset successfully.");

  console.log("🌱 Seeding database...");

  // 1. Seed 10 users (we don’t need the result here)
  await seed(db, { users }).refine((r) => ({
    users: {
      columns: {
        name: r.fullName(),
        phone: r.phoneNumber(),
      },
      count: 10,
    },
  }));

  // 2. Grab one user manually as creator
  const creator = await db.select().from(users);

  // 3. Insert workspace with creator
  const [workspace] = await db
    .insert(workspaces)
    .values({
      name: "Acme Corp",
      createdBy: creator[0].id,
      description: " Default workspace for Acme Corp",
    })
    .returning();

  // 4. Add creator as admin in junction table
  await db.insert(usersToWorkspaces).values({
    userId: creator[0].id,
    workspaceId: workspace.id,
    role: "admin",
  });

  await db.insert(usersToWorkspaces).values(
    creator.slice(1).map((user) => ({
      userId: user.id,
      workspaceId: workspace.id,
      role: "member" as "member",
    })),
  );

  console.log("✅ Database seeded successfully.");
}

main();
