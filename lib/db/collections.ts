import { cache } from "react"
import { desc, eq, inArray, count } from "drizzle-orm"

import { db } from "@/db"
import { collections, items, itemTypes } from "@/db/schema"

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

export const getAllCollectionsWithCounts = cache(
  async (userId: string): Promise<CollectionSummary[]> => {
    const rows = await db
      .select({
        id: collections.id,
        name: collections.name,
        itemCount: count(items.id),
      })
      .from(collections)
      .leftJoin(items, eq(items.collectionId, collections.id))
      .where(eq(collections.userId, userId))
      .groupBy(collections.id)
      .orderBy(desc(collections.createdAt))

    return rows.map((row) => ({
      id: row.id,
      name: row.name,
      itemCount: Number(row.itemCount),
    }))
  }
)

export const getRecentCollections = cache(
  async (userId: string): Promise<CollectionWithStats[]> => {
    const collectionRows = await db
      .select({
        id: collections.id,
        name: collections.name,
        description: collections.description,
        isFavorite: collections.isFavorite,
      })
      .from(collections)
      .where(eq(collections.userId, userId))
      .orderBy(desc(collections.createdAt))
      .limit(6)

    if (collectionRows.length === 0) return []

    const collectionIds = collectionRows.map((row) => row.id)

    const typeCountRows = await db
      .select({
        collectionId: items.collectionId,
        typeId: itemTypes.id,
        typeIcon: itemTypes.icon,
        typeColor: itemTypes.color,
        count: count(items.id),
      })
      .from(items)
      .innerJoin(itemTypes, eq(items.typeId, itemTypes.id))
      .where(inArray(items.collectionId, collectionIds))
      .groupBy(
        items.collectionId,
        itemTypes.id,
        itemTypes.icon,
        itemTypes.color
      )

    const typeCountsByCollection = new Map<
      string,
      (CollectionTypeSummary & { count: number })[]
    >()
    for (const row of typeCountRows) {
      if (!row.collectionId) continue
      const entry = {
        id: row.typeId,
        icon: row.typeIcon ?? "File",
        color: row.typeColor ?? "#6b7280",
        count: Number(row.count),
      }
      const existing = typeCountsByCollection.get(row.collectionId)
      if (existing) {
        existing.push(entry)
      } else {
        typeCountsByCollection.set(row.collectionId, [entry])
      }
    }

    return collectionRows.map((collection) => {
      const typeCounts = typeCountsByCollection.get(collection.id) ?? []
      const itemCount = typeCounts.reduce((sum, t) => sum + t.count, 0)
      const dominant = typeCounts.reduce<
        (CollectionTypeSummary & { count: number }) | null
      >(
        (max, current) => (!max || current.count > max.count ? current : max),
        null
      )

      return {
        id: collection.id,
        name: collection.name,
        description: collection.description,
        isFavorite: collection.isFavorite,
        itemCount,
        dominantType: dominant
          ? { id: dominant.id, icon: dominant.icon, color: dominant.color }
          : null,
        types: typeCounts.map(({ id, icon, color }) => ({ id, icon, color })),
      }
    })
  }
)
