CREATE TABLE "waitlist" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar(150) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "waitlist_email_unique" UNIQUE("email")
);
