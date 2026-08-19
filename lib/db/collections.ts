import { desc, eq } from "drizzle-orm"

import { db } from "@/db"
import { collections } from "@/db/schema"

export interface CollectionTypeSummary {
  id: string
  icon: string
  color: string
}

export interface CollectionWithStats {
  id: string
  name: string
  description: string | null
  isFavorite: boolean
  itemCount: number
  dominantType: CollectionTypeSummary | null
  types: CollectionTypeSummary[]
}

export interface CollectionSummary {
  id: string
  name: string
  itemCount: number
}

export async function getAllCollectionsWithCounts(
  userId: string
): Promise<CollectionSummary[]> {
  const rows = await db.query.collections.findMany({
    where: eq(collections.userId, userId),
    orderBy: [desc(collections.createdAt)],
    with: {
      items: { columns: { id: true } },
    },
  })

  return rows.map((collection) => ({
    id: collection.id,
    name: collection.name,
    itemCount: collection.items.length,
  }))
}

export async function getRecentCollections(
  userId: string
): Promise<CollectionWithStats[]> {
  const rows = await db.query.collections.findMany({
    where: eq(collections.userId, userId),
    orderBy: [desc(collections.createdAt)],
    limit: 6,
    with: {
      items: {
        with: { type: true },
      },
    },
  })

  return rows.map((collection) => {
    const typeCounts = new Map<
      string,
      CollectionTypeSummary & { count: number }
    >()

    for (const item of collection.items) {
      if (!item.type) continue
      const existing = typeCounts.get(item.type.id)
      if (existing) {
        existing.count += 1
      } else {
        typeCounts.set(item.type.id, {
          id: item.type.id,
          icon: item.type.icon ?? "File",
          color: item.type.color ?? "#6b7280",
          count: 1,
        })
      }
    }

    const types = Array.from(typeCounts.values()).map(
      ({ id, icon, color }) => ({ id, icon, color })
    )
    const dominant = Array.from(typeCounts.values()).reduce<
      (CollectionTypeSummary & { count: number }) | null
    >((max, current) => (!max || current.count > max.count ? current : max), null)

    return {
      id: collection.id,
      name: collection.name,
      description: collection.description,
      isFavorite: collection.isFavorite,
      itemCount: collection.items.length,
      dominantType: dominant
        ? { id: dominant.id, icon: dominant.icon, color: dominant.color }
        : null,
      types,
    }
  })
}
