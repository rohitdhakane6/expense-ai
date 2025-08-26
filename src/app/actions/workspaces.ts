"use server";
import { db } from "@/db";
import { usersToWorkspaces, workspaces } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { desc, eq } from "drizzle-orm";

/*
 * Fetch all workspaces for the authenticated user
 */

export async function getWorkspaces() {
  try {
    const { userId } = await auth();

    if (!userId) throw new Error("Authentication required");

    const userWorkspaces = await db
      .select({
        id: workspaces.id,
        name: workspaces.name,
        description: workspaces.description,
        role: usersToWorkspaces.role,
      })
      .from(usersToWorkspaces)
      .leftJoin(workspaces, eq(workspaces.id, usersToWorkspaces.workspaceId))
      .where(eq(usersToWorkspaces.userId, userId))
      .orderBy(desc(workspaces.createdAt));

    return userWorkspaces;
  } catch (error) {
    console.error("Failed to fetch workspaces:", error);

    return [];
  }
}

/*
 * Create a new workspace
 * @
 */

export async function createWorkspace(name: string, description?: string) {
  try {
    const { userId } = await auth();

    if (!userId) throw new Error("Authentication required");

    // Create workspace in transaction
    const newWorkspace = await db.transaction(async (tx) => {
      try {
        // Insert workspace
        const [workspace] = await tx
          .insert(workspaces)
          .values({
            name,
            description,
            createdBy: userId,
          })
          .returning();

        if (!workspace) {
          throw new Error("Failed to create workspace");
        }

        // Link user to workspace as admin
        await tx.insert(usersToWorkspaces).values({
          userId,
          workspaceId: workspace.id,
          role: "admin",
        });

        return workspace;
      } catch (txError) {
        console.error("Transaction failed:", txError);
        throw txError;
      }
    });

    return;
  } catch (error) {
    console.error("Failed to create workspace:", error);
    throw error;
  }
}
