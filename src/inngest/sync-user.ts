import { inngest } from "@/inngest/client";
import { db } from "@/db";
import { users } from "@/db/schema";

export const syncUser = inngest.createFunction(
  { id: "sync-user-from-clerk" },
  { event: "clerk/user.created" },
  async ({ event }) => {
    try {
      const user = event.data;

      if (!user) {
        throw new Error("No user data received from Clerk");
      }

      const {
        id,
        first_name,
        last_name,
        email_addresses,
        primary_email_address_id,
      } = user;

      if (
        !id ||
        !first_name ||
        !last_name ||
        !email_addresses ||
        !primary_email_address_id
      ) {
        throw new Error("Missing required user fields");
      }

      const primaryEmail = email_addresses.find(
        (e: any) => e.id === primary_email_address_id,
      );

      if (!primaryEmail?.email_address) {
        throw new Error("Primary email address not found");
      }

      await db.insert(users).values({
        id,
        email: primaryEmail.email_address,
        name: `${first_name} ${last_name}`,
      });

      return {
        message: `User ${first_name} ${last_name} synced successfully`,
        email: primaryEmail.email_address,
      };
    } catch (error) {
      console.error("Error syncing user from Clerk:", error);

      return {
        error: true,
        message: "Failed to sync user from Clerk",
        details: (error as Error).message,
      };
    }
  },
);
