"use server"

import { auth } from "@clerk/nextjs/server"
import { and, eq } from "drizzle-orm"

import { db } from "@/db"
import { items } from "@/db/schema"
import { getItemById, type ItemDetail } from "@/lib/db/items"

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
