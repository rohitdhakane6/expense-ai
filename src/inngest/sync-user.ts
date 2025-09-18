import { inngest } from "@/inngest";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { resend } from "@/lib/resend";
import WelcomeEmail from "@/emails/WelcomeEmail";

export const syncUser = inngest.createFunction(
  { id: "sync-user-from-clerk", name: "Sync user from clerk" },
  { event: "clerk/user.created" },
  async ({ event, step }) => {
    try {
      // Step 1: Validate and extract user data
      const userData = await step.run("validate-user-data", async () => {
        const user = event.data;

        if (!user) {
          throw new Error("No user data received from Clerk webhook");
        }

        const {
          id,
          first_name,
          last_name,
          email_addresses,
          primary_email_address_id,
        } = user;

        // Validate required fields
        if (!id) {
          throw new Error("User ID is missing");
        }

        if (
          !email_addresses ||
          !Array.isArray(email_addresses) ||
          email_addresses.length === 0
        ) {
          throw new Error("No email addresses found for user");
        }

        if (!primary_email_address_id) {
          throw new Error("Primary email address ID is missing");
        }

        // Find primary email
        const primaryEmail = email_addresses.find(
          (emailObj: any) => emailObj.id === primary_email_address_id,
        );

        if (!primaryEmail) {
          throw new Error(
            `Primary email with ID ${primary_email_address_id} not found`,
          );
        }

        if (
          !primaryEmail.email_address ||
          typeof primaryEmail.email_address !== "string"
        ) {
          throw new Error("Primary email address is invalid or empty");
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(primaryEmail.email_address)) {
          throw new Error(
            `Invalid email format: ${primaryEmail.email_address}`,
          );
        }

        // Handle names safely
        const firstName = (first_name || "").trim();
        const lastName = (last_name || "").trim();
        const fullName =
          [firstName, lastName].filter(Boolean).join(" ") || "Anonymous User";

        return {
          id,
          email: primaryEmail.email_address.toLowerCase(), // Normalize email
          name: fullName,
          firstName,
          lastName,
        };
      });

      // Step 2: Check if user already exists
      const existingUser = await step.run("check-existing-user", async () => {
        try {
          const [existing] = await db
            .select()
            .from(users)
            .where(eq(users.id, userData.id))
            .limit(1);

          return existing || null;
        } catch (dbError) {
          console.error(
            "Database error while checking existing user:",
            dbError,
          );
          throw new Error("Failed to check existing user in database");
        }
      });

      // Step 3: Insert or update user
      const dbResult = await step.run("sync-user-to-db", async () => {
        try {
          if (existingUser) {
            console.log(`User ${userData.id} already exists, skipping insert`);
            return {
              action: "skipped",
              user: existingUser,
              message: `User ${userData.name} already exists in database`,
            };
          }

          await db.insert(users).values({
            id: userData.id,
            email: userData.email,
            name: userData.name,
          });

          console.log(
            `Successfully inserted user: ${userData.id} (${userData.email})`,
          );

          return {
            action: "created",
            user: userData,
            message: `User ${userData.name} synced successfully`,
          };
        } catch (dbError: any) {
          console.error("Database error during user insert:", dbError);

          throw new Error(
            `Database insertion failed: ${dbError.message || "Unknown database error"}`,
          );
        }
      });

      // Step 4: Send email sending (placeholder for actual email service)
      const emailData = await step.run("send-welcome-email", async () => {
        try {
          if (dbResult.action === "created") {
            await resend.emails.send({
              from: "Rohit from ExpenseAI <rohit@expenseai.tech>",
              to: userData.email,
              subject: "Welcome to ExpenseAI!",
              react: WelcomeEmail({
                firstName: userData.firstName || "there",
              }),
            });
            return {
              emailLogged: true,
              message: `Welcome email sent to: ${userData.email}`,
            };
          } else {
            return {
              emailLogged: false,
              message: `User already existed, skipping welcome email for: ${userData.email}`,
            };
          }
        } catch (emailError) {
          console.error("Error sending welcome email:", emailError);
          // Don't fail the entire function if email logging fails
          return {
            emailLogged: false,
            error: (emailError as Error).message,
            message: "Failed to Send welcome email, but user sync completed",
          };
        }
      });

      // Return success response
      return {
        success: true,
        dbResult,
        emailData,
        timestamp: new Date().toISOString(),

        user: {
          id: userData.id,
          email: userData.email,
          name: userData.name,
        },
      };
    } catch (error: any) {
      const errorMessage = error.message || "Unknown error occurred";

      console.error("❌ Error in syncUser function:", {
        error: errorMessage,
        stack: error.stack,
        eventData: event.data,
        timestamp: new Date().toISOString(),
      });

      // Return error response (don't throw to prevent Inngest retries for validation errors)
      return {
        success: false,
        error: true,
        message: "Failed to sync user from Clerk",
        details: errorMessage,
        timestamp: new Date().toISOString(),
      };
    }
  },
);
