import { eq } from "drizzle-orm"

import { db } from "@/db"
import { users } from "@/db/schema"

export async function isUserPro(userId: string): Promise<boolean> {
  const user = await db.query.users.findFirst({
    where: eq(users.id, userId),
    columns: { isPro: true },
  })

  return user?.isPro ?? false
}
