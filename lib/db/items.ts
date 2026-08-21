import { cache } from "react"
import { and, count, desc, eq, or, isNull, sql } from "drizzle-orm"

import { db } from "@/db"
import { collections, items, itemTypes } from "@/db/schema"

export interface ItemTypeSummary {
  id: string
  name: string
  icon: string
  color: string
}

export interface ItemWithRelations {
  id: string
  title: string
  contentType: string
  content: string | null
  fileUrl: string | null
  fileName: string | null
  url: string | null
  isFavorite: boolean
  isPinned: boolean
  language: string | null
  updatedAt: Date
  type: ItemTypeSummary
  collectionName: string | null
  tags: string[]
}

async function findItems(
  userId: string,
  {
    pinnedOnly,
    limit,
    typeId,
  }: { pinnedOnly?: boolean; limit?: number; typeId?: string }
): Promise<ItemWithRelations[]> {
  const conditions = [eq(items.userId, userId)]
  if (pinnedOnly) conditions.push(eq(items.isPinned, true))
  if (typeId) conditions.push(eq(items.typeId, typeId))

  const rows = await db.query.items.findMany({
    where: and(...conditions),
    orderBy: [desc(items.updatedAt)],
    limit,
    with: {
      type: true,
      collection: true,
      tags: { with: { tag: true } },
    },
  })

  return rows.map((item) => ({
    id: item.id,
    title: item.title,
    contentType: item.contentType,
    content: item.content,
    fileUrl: item.fileUrl,
    fileName: item.fileName,
    url: item.url,
    isFavorite: item.isFavorite,
    isPinned: item.isPinned,
    language: item.language,
    updatedAt: item.updatedAt,
    type: {
      id: item.type.id,
      name: item.type.name,
      icon: item.type.icon ?? "File",
      color: item.type.color ?? "#6b7280",
    },
    collectionName: item.collection?.name ?? null,
    tags: item.tags.map((itemTag) => itemTag.tag.name),
  }))
}

export const getPinnedItems = cache((userId: string) =>
  findItems(userId, { pinnedOnly: true })
)

export const getRecentItems = cache((userId: string, limit = 10) =>
  findItems(userId, { limit })
)

export const getItemsByType = cache((userId: string, typeId: string) =>
  findItems(userId, { typeId })
)

export interface ItemDetail extends ItemWithRelations {
  description: string | null
  fileSize: number | null
}

export const getItemById = cache(
  async (userId: string, id: string): Promise<ItemDetail | null> => {
    const item = await db.query.items.findFirst({
      where: and(eq(items.id, id), eq(items.userId, userId)),
      with: {
        type: true,
        collection: true,
        tags: { with: { tag: true } },
      },
    })
    if (!item) return null

    return {
      id: item.id,
      title: item.title,
      contentType: item.contentType,
      content: item.content,
      fileUrl: item.fileUrl,
      fileName: item.fileName,
      fileSize: item.fileSize,
      url: item.url,
      description: item.description,
      isFavorite: item.isFavorite,
      isPinned: item.isPinned,
      language: item.language,
      updatedAt: item.updatedAt,
      type: {
        id: item.type.id,
        name: item.type.name,
        icon: item.type.icon ?? "File",
        color: item.type.color ?? "#6b7280",
      },
      collectionName: item.collection?.name ?? null,
      tags: item.tags.map((itemTag) => itemTag.tag.name),
    }
  }
)

export interface ItemStats {
  totalItems: number
  favoriteItems: number
  pinnedItems: number
  totalCollections: number
  favoriteCollections: number
}

export const getDashboardStats = cache(
  async (userId: string): Promise<ItemStats> => {
    const [[itemTotals], [collectionTotals]] = await Promise.all([
      db
        .select({
          totalItems: count(),
          favoriteItems: sql<number>`count(*) filter (where ${items.isFavorite})`,
          pinnedItems: sql<number>`count(*) filter (where ${items.isPinned})`,
        })
        .from(items)
        .where(eq(items.userId, userId)),
      db
        .select({
          totalCollections: count(),
          favoriteCollections: sql<number>`count(*) filter (where ${collections.isFavorite})`,
        })
        .from(collections)
        .where(eq(collections.userId, userId)),
    ])

    return {
      totalItems: itemTotals?.totalItems ?? 0,
      favoriteItems: Number(itemTotals?.favoriteItems ?? 0),
      pinnedItems: Number(itemTotals?.pinnedItems ?? 0),
      totalCollections: collectionTotals?.totalCollections ?? 0,
      favoriteCollections: Number(collectionTotals?.favoriteCollections ?? 0),
    }
  }
)

export interface ItemTypeCount extends ItemTypeSummary {
  count: number
}

export const getItemCountsByType = cache(
  async (userId: string): Promise<ItemTypeCount[]> => {
    const rows = await db
      .select({
        id: itemTypes.id,
        name: itemTypes.name,
        icon: itemTypes.icon,
        color: itemTypes.color,
        count: count(items.id),
      })
      .from(itemTypes)
      .leftJoin(
        items,
        and(eq(items.typeId, itemTypes.id), eq(items.userId, userId))
      )
      .where(or(isNull(itemTypes.userId), eq(itemTypes.userId, userId)))
      .groupBy(itemTypes.id)
      .orderBy(itemTypes.name)

    return rows.map((row) => ({
      id: row.id,
      name: row.name,
      icon: row.icon ?? "File",
      color: row.color ?? "#6b7280",
      count: Number(row.count),
    }))
  }
)
