import { eq } from "drizzle-orm";
import { db } from "@/db/postgresql/connection";
import { user } from "@/db/postgresql/schema/user";

export async function checkUserId(userId: string): Promise<boolean> {
  const check = await db
    .select({ id: user.id })
    .from(user)
    .where(eq(user.id, parseInt(userId)))
    .limit(1)
    .execute();

  return check.length === 1;
}
