import { beforeEach, describe, expect, it, vi } from "vitest"

import { testUser } from "@/test/fixtures/user"

const authProtect = vi.fn()
const getItemById = vi.fn()
const dbReturning = vi.fn()
const dbWhere = vi.fn(() => ({ returning: dbReturning }))
const dbSet = vi.fn(() => ({ where: dbWhere }))
const dbUpdate = vi.fn(() => ({ set: dbSet }))
const dbDelete = vi.fn(() => ({ where: dbWhere }))

vi.mock("@clerk/nextjs/server", () => ({
  auth: { protect: authProtect },
}))

vi.mock("@/db", () => ({
  db: { update: dbUpdate, delete: dbDelete },
}))

vi.mock("@/lib/db/items", () => ({
  getItemById,
}))

const item = {
  id: "item_1",
  title: "Test item",
  contentType: "text",
  content: "console.log('hi')",
  fileUrl: null,
  fileName: null,
  fileSize: null,
  url: null,
  description: null,
  isFavorite: false,
  isPinned: false,
  language: "typescript",
  updatedAt: new Date(),
  type: { id: "type_1", name: "Snippet", icon: "Code", color: "#000" },
  collectionName: null,
  tags: [],
}

describe("getItemDetail", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("returns the item when found and owned by the user", async () => {
    authProtect.mockResolvedValue({ userId: testUser.id })
    getItemById.mockResolvedValue(item)

    const { getItemDetail } = await import("@/actions/items")
    const result = await getItemDetail(item.id)

    expect(result).toEqual({ success: true, data: item })
    expect(getItemById).toHaveBeenCalledWith(testUser.id, item.id)
  })

  it("returns a failure result when the item is not found", async () => {
    authProtect.mockResolvedValue({ userId: testUser.id })
    getItemById.mockResolvedValue(null)

    const { getItemDetail } = await import("@/actions/items")
    const result = await getItemDetail(item.id)

    expect(result).toEqual({ success: false, error: "Item not found" })
  })

  it("returns a failure result when the user is not authenticated", async () => {
    authProtect.mockRejectedValue(new Error("Unauthorized"))

    const { getItemDetail } = await import("@/actions/items")
    const result = await getItemDetail(item.id)

    expect(result).toEqual({ success: false, error: "Unauthorized" })
  })
})

describe("setItemFavorite", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("updates the favorite flag for an owned item", async () => {
    authProtect.mockResolvedValue({ userId: testUser.id })
    dbReturning.mockResolvedValue([{ id: item.id }])

    const { setItemFavorite } = await import("@/actions/items")
    const result = await setItemFavorite(item.id, true)

    expect(result).toEqual({ success: true, data: { id: item.id } })
    expect(dbSet).toHaveBeenCalledWith({ isFavorite: true })
  })

  it("returns a failure result when the item isn't found or owned", async () => {
    authProtect.mockResolvedValue({ userId: testUser.id })
    dbReturning.mockResolvedValue([])

    const { setItemFavorite } = await import("@/actions/items")
    const result = await setItemFavorite(item.id, true)

    expect(result).toEqual({ success: false, error: "Item not found" })
  })
})

describe("deleteItem", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("deletes an owned item", async () => {
    authProtect.mockResolvedValue({ userId: testUser.id })
    dbReturning.mockResolvedValue([{ id: item.id }])

    const { deleteItem } = await import("@/actions/items")
    const result = await deleteItem(item.id)

    expect(result).toEqual({ success: true, data: null })
    expect(dbDelete).toHaveBeenCalled()
  })

  it("returns a failure result when the item isn't found or owned", async () => {
    authProtect.mockResolvedValue({ userId: testUser.id })
    dbReturning.mockResolvedValue([])

    const { deleteItem } = await import("@/actions/items")
    const result = await deleteItem(item.id)

    expect(result).toEqual({ success: false, error: "Item not found" })
  })
})
