import { or, eq, isNull } from "drizzle-orm"

import { db } from "@/db"
import { itemTypes } from "@/db/schema"

export interface ItemTypeSummary {
  id: string
  name: string
  icon: string
  color: string
}

export async function getItemTypesForUser(
  userId: string
): Promise<ItemTypeSummary[]> {
  const rows = await db.query.itemTypes.findMany({
    where: or(isNull(itemTypes.userId), eq(itemTypes.userId, userId)),
    orderBy: [itemTypes.name],
  })

  return rows.map((type) => ({
    id: type.id,
    name: type.name,
    icon: type.icon ?? "File",
    color: type.color ?? "#6b7280",
  }))
}
