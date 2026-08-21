"use server"

import { auth } from "@clerk/nextjs/server"
import { and, eq } from "drizzle-orm"
import { z } from "zod"

import { db } from "@/db"
import { items } from "@/db/schema"
import {
  getCreatableItemTypes,
  type ItemTypeSummary,
} from "@/lib/db/item-types"
import {
  createItem as createItemQuery,
  getDistinctLanguages,
  getItemById,
  updateItem as updateItemQuery,
  type ItemDetail,
} from "@/lib/db/items"

type ActionResult<T> =
  { success: true; data: T } | { success: false; error: string }

function toError(error: unknown, fallback: string): string {
  return error instanceof Error ? error.message : fallback
}

export async function getItemDetail(
  id: string
): Promise<ActionResult<ItemDetail>> {
  try {
    const { userId } = await auth.protect()
    const item = await getItemById(userId, id)
    if (!item) return { success: false, error: "Item not found" }
    return { success: true, data: item }
  } catch (error) {
    return { success: false, error: toError(error, "Failed to load item") }
  }
}

async function setItemFlag(
  id: string,
  field: "isFavorite" | "isPinned",
  value: boolean
): Promise<ActionResult<{ id: string }>> {
  try {
    const { userId } = await auth.protect()
    const [updated] = await db
      .update(items)
      .set({ [field]: value })
      .where(and(eq(items.id, id), eq(items.userId, userId)))
      .returning({ id: items.id })

    if (!updated) return { success: false, error: "Item not found" }
    return { success: true, data: { id: updated.id } }
  } catch (error) {
    return { success: false, error: toError(error, "Failed to update item") }
  }
}

export async function setItemFavorite(id: string, value: boolean) {
  return setItemFlag(id, "isFavorite", value)
}

export async function setItemPinned(id: string, value: boolean) {
  return setItemFlag(id, "isPinned", value)
}

export async function getLanguageOptions(): Promise<ActionResult<string[]>> {
  try {
    const { userId } = await auth.protect()
    const languages = await getDistinctLanguages(userId)
    return { success: true, data: languages }
  } catch (error) {
    return { success: false, error: toError(error, "Failed to load languages") }
  }
}

const updateItemSchema = z.object({
  title: z.string().trim().min(1, "Title is required"),
  description: z.string().nullable().optional(),
  content: z.string().nullable().optional(),
  url: z.url().nullable().optional(),
  language: z.string().nullable().optional(),
  tags: z.array(z.string().trim().min(1)),
})

export type UpdateItemData = z.infer<typeof updateItemSchema>

export async function updateItem(
  id: string,
  data: UpdateItemData
): Promise<ActionResult<ItemDetail>> {
  try {
    const parsed = updateItemSchema.safeParse(data)
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0].message }
    }

    const { userId } = await auth.protect()
    const updated = await updateItemQuery(userId, id, {
      title: parsed.data.title,
      description: parsed.data.description ?? null,
      content: parsed.data.content ?? null,
      url: parsed.data.url ?? null,
      language: parsed.data.language ?? null,
      tags: parsed.data.tags,
    })

    if (!updated) return { success: false, error: "Item not found" }
    return { success: true, data: updated }
  } catch (error) {
    return { success: false, error: toError(error, "Failed to update item") }
  }
}

export async function getCreatableItemTypeOptions(): Promise<
  ActionResult<ItemTypeSummary[]>
> {
  try {
    const { userId } = await auth.protect()
    const types = await getCreatableItemTypes(userId)
    return { success: true, data: types }
  } catch (error) {
    return {
      success: false,
      error: toError(error, "Failed to load item types"),
    }
  }
}

const createItemSchema = z.object({
  typeId: z.string().trim().min(1, "Type is required"),
  title: z.string().trim().min(1, "Title is required"),
  description: z.string().nullable().optional(),
  content: z.string().nullable().optional(),
  url: z.url().nullable().optional(),
  language: z.string().nullable().optional(),
  tags: z.array(z.string().trim().min(1)),
})

export type CreateItemData = z.infer<typeof createItemSchema>

export async function createItem(
  data: CreateItemData
): Promise<ActionResult<ItemDetail>> {
  try {
    const parsed = createItemSchema.safeParse(data)
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0].message }
    }

    const { userId } = await auth.protect()
    const created = await createItemQuery(userId, {
      typeId: parsed.data.typeId,
      title: parsed.data.title,
      description: parsed.data.description ?? null,
      content: parsed.data.content ?? null,
      url: parsed.data.url ?? null,
      language: parsed.data.language ?? null,
      tags: parsed.data.tags,
    })

    return { success: true, data: created }
  } catch (error) {
    return { success: false, error: toError(error, "Failed to create item") }
  }
}

export async function deleteItem(id: string): Promise<ActionResult<null>> {
  try {
    const { userId } = await auth.protect()
    const [deleted] = await db
      .delete(items)
      .where(and(eq(items.id, id), eq(items.userId, userId)))
      .returning({ id: items.id })

    if (!deleted) return { success: false, error: "Item not found" }
    return { success: true, data: null }
  } catch (error) {
    return { success: false, error: toError(error, "Failed to delete item") }
  }
}
