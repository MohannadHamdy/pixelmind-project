import { beforeEach, describe, expect, it, vi } from "vitest"

import { testUser } from "@/test/fixtures/user"

const authProtect = vi.fn()
const dbWhere = vi.fn()
const dbDelete = vi.fn(() => ({ where: dbWhere }))

vi.mock("@clerk/nextjs/server", () => ({
  auth: { protect: authProtect },
}))

vi.mock("@/db", () => ({
  db: { delete: dbDelete },
}))

describe("deleteAccountData", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("deletes the authenticated user's row and reports success", async () => {
    authProtect.mockResolvedValue({ userId: testUser.id })
    dbWhere.mockResolvedValue(undefined)

    const { deleteAccountData } = await import("@/actions/account")
    const result = await deleteAccountData()

    expect(result).toEqual({ success: true })
    expect(dbDelete).toHaveBeenCalled()
    expect(dbWhere).toHaveBeenCalled()
  })

  it("returns a failure result when the user is not authenticated", async () => {
    authProtect.mockRejectedValue(new Error("Unauthorized"))

    const { deleteAccountData } = await import("@/actions/account")
    const result = await deleteAccountData()

    expect(result).toEqual({ success: false, error: "Unauthorized" })
    expect(dbDelete).not.toHaveBeenCalled()
  })

  it("returns a generic failure message for non-Error rejections", async () => {
    authProtect.mockRejectedValue("boom")

    const { deleteAccountData } = await import("@/actions/account")
    const result = await deleteAccountData()

    expect(result).toEqual({
      success: false,
      error: "Failed to delete account data",
    })
  })
})
