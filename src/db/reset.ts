import { reset } from "drizzle-seed";
import { db } from "@/db";
import * as schema from "@/db/schema";

export async function main() {
  console.log("🔄 Resetting database...");
  await reset(db, schema);
}

main();
