import { z } from "zod";
import { NextResponse } from "next/server";
import { db } from "@/db";
import { waitlist } from "@/db/schema";
import { eq } from "drizzle-orm";
import { resend } from "@/lib/resend";
import { ThankYouWaitlistEmail } from "../../../emails/wait-list";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    const emailSchema = z.string().email();
    const parseResult = emailSchema.safeParse(email);
    if (!parseResult.success) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    const existingEntries = await db
      .select()
      .from(waitlist)
      .where(eq(waitlist.email, email));

    if (existingEntries.length > 0) {
      return NextResponse.json(
        { error: "Email already exists" },
        { status: 409 }
      );
    }

    await db.insert(waitlist).values({ email });
    resend.emails.send({
      from: "Rohit from ExpenseAI  <rohit@expenseai.tech>",
      to: email,
      subject: "Thanks for joining the Expense AI waitlist!",
      react: ThankYouWaitlistEmail(),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Waitlist POST error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
