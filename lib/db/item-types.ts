import { cache } from "react"
import { or, eq, isNull } from "drizzle-orm"

import { db } from "@/db"
import { itemTypes } from "@/db/schema"
import { CREATABLE_TYPE_NAMES } from "@/lib/item-field-types"
import { typeSlug } from "@/lib/item-type-slug"

export interface ItemTypeSummary {
  id: string
  name: string
  icon: string
  color: string
}

export const getItemTypesForUser = cache(
  async (userId: string): Promise<ItemTypeSummary[]> => {
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
)

export const getCreatableItemTypes = cache(
  async (userId: string): Promise<ItemTypeSummary[]> => {
    const types = await getItemTypesForUser(userId)
    return CREATABLE_TYPE_NAMES.map((name) =>
      types.find((type) => type.name.toLowerCase() === name)
    ).filter((type): type is ItemTypeSummary => Boolean(type))
  }
)

export const getItemTypeBySlug = cache(
  async (userId: string, slug: string): Promise<ItemTypeSummary | null> => {
    const types = await getItemTypesForUser(userId)
    return types.find((type) => typeSlug(type.name) === slug) ?? null
  }
)
