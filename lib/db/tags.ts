import { count, desc, eq } from "drizzle-orm"

import { db } from "@/db"
import { itemTags, tags } from "@/db/schema"

export async function getTopTags(userId: string, limit = 8): Promise<string[]> {
  const rows = await db
    .select({ name: tags.name, usageCount: count(itemTags.itemId) })
    .from(tags)
    .leftJoin(itemTags, eq(itemTags.tagId, tags.id))
    .where(eq(tags.userId, userId))
    .groupBy(tags.id)
    .orderBy(desc(count(itemTags.itemId)))
    .limit(limit)

  return rows.map((row) => row.name)
}
