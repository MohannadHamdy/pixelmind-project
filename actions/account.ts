"use server"

import { auth } from "@clerk/nextjs/server"
import { eq } from "drizzle-orm"

import { db } from "@/db"
import { users } from "@/db/schema"

export async function deleteAccountData(): Promise<
  { success: true } | { success: false; error: string }
> {
  try {
    const { userId } = await auth.protect()
    await db.delete(users).where(eq(users.id, userId))
    return { success: true }
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to delete account data",
    }
  }
}
