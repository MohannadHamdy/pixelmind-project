import { beforeEach, describe, expect, it, vi } from "vitest"

import { testUser } from "@/test/fixtures/user"

const authProtect = vi.fn()
const getItemById = vi.fn()
const updateItem = vi.fn()
const createItemQuery = vi.fn()
const getDistinctLanguages = vi.fn()
const getCreatableItemTypes = vi.fn()
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
  updateItem,
  createItem: createItemQuery,
  getDistinctLanguages,
}))

vi.mock("@/lib/db/item-types", () => ({
  getCreatableItemTypes,
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

describe("updateItem", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  const validData = {
    title: "Updated title",
    description: "Updated description",
    content: "console.log('updated')",
    url: null,
    language: "typescript",
    tags: ["react", "hooks"],
  }

  it("updates an owned item with valid data", async () => {
    authProtect.mockResolvedValue({ userId: testUser.id })
    updateItem.mockResolvedValue({ ...item, ...validData })

    const { updateItem: updateItemAction } = await import("@/actions/items")
    const result = await updateItemAction(item.id, validData)

    expect(result).toEqual({
      success: true,
      data: { ...item, ...validData },
    })
    expect(updateItem).toHaveBeenCalledWith(testUser.id, item.id, validData)
  })

  it("rejects an empty title before hitting auth or the database", async () => {
    const { updateItem: updateItemAction } = await import("@/actions/items")
    const result = await updateItemAction(item.id, {
      ...validData,
      title: "   ",
    })

    expect(result).toEqual({ success: false, error: "Title is required" })
    expect(authProtect).not.toHaveBeenCalled()
    expect(updateItem).not.toHaveBeenCalled()
  })

  it("rejects an invalid url", async () => {
    const { updateItem: updateItemAction } = await import("@/actions/items")
    const result = await updateItemAction(item.id, {
      ...validData,
      url: "not-a-url",
    })

    expect(result.success).toBe(false)
    expect(updateItem).not.toHaveBeenCalled()
  })

  it("returns a failure result when the item isn't found or owned", async () => {
    authProtect.mockResolvedValue({ userId: testUser.id })
    updateItem.mockResolvedValue(null)

    const { updateItem: updateItemAction } = await import("@/actions/items")
    const result = await updateItemAction(item.id, validData)

    expect(result).toEqual({ success: false, error: "Item not found" })
  })

  it("returns a failure result when the user is not authenticated", async () => {
    authProtect.mockRejectedValue(new Error("Unauthorized"))

    const { updateItem: updateItemAction } = await import("@/actions/items")
    const result = await updateItemAction(item.id, validData)

    expect(result).toEqual({ success: false, error: "Unauthorized" })
  })
})

describe("getCreatableItemTypeOptions", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("returns the creatable item types for the authenticated user", async () => {
    authProtect.mockResolvedValue({ userId: testUser.id })
    getCreatableItemTypes.mockResolvedValue([item.type])

    const { getCreatableItemTypeOptions } = await import("@/actions/items")
    const result = await getCreatableItemTypeOptions()

    expect(result).toEqual({ success: true, data: [item.type] })
    expect(getCreatableItemTypes).toHaveBeenCalledWith(testUser.id)
  })

  it("returns a failure result when the user is not authenticated", async () => {
    authProtect.mockRejectedValue(new Error("Unauthorized"))

    const { getCreatableItemTypeOptions } = await import("@/actions/items")
    const result = await getCreatableItemTypeOptions()

    expect(result).toEqual({ success: false, error: "Unauthorized" })
  })
})

describe("createItem", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  const validData = {
    typeId: "type_1",
    title: "New item",
    description: "A description",
    content: "console.log('hi')",
    url: null,
    language: "typescript",
    tags: ["react"],
  }

  it("creates an item with valid data", async () => {
    authProtect.mockResolvedValue({ userId: testUser.id })
    createItemQuery.mockResolvedValue({ ...item, ...validData })

    const { createItem } = await import("@/actions/items")
    const result = await createItem(validData)

    expect(result).toEqual({ success: true, data: { ...item, ...validData } })
    expect(createItemQuery).toHaveBeenCalledWith(testUser.id, validData)
  })

  it("rejects an empty title before hitting auth or the database", async () => {
    const { createItem } = await import("@/actions/items")
    const result = await createItem({ ...validData, title: "   " })

    expect(result).toEqual({ success: false, error: "Title is required" })
    expect(authProtect).not.toHaveBeenCalled()
    expect(createItemQuery).not.toHaveBeenCalled()
  })

  it("rejects a missing type", async () => {
    const { createItem } = await import("@/actions/items")
    const result = await createItem({ ...validData, typeId: "" })

    expect(result).toEqual({ success: false, error: "Type is required" })
    expect(createItemQuery).not.toHaveBeenCalled()
  })

  it("returns a failure result when the user is not authenticated", async () => {
    authProtect.mockRejectedValue(new Error("Unauthorized"))

    const { createItem } = await import("@/actions/items")
    const result = await createItem(validData)

    expect(result).toEqual({ success: false, error: "Unauthorized" })
  })
})

describe("getLanguageOptions", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("returns the distinct languages for the authenticated user", async () => {
    authProtect.mockResolvedValue({ userId: testUser.id })
    getDistinctLanguages.mockResolvedValue(["typescript", "python"])

    const { getLanguageOptions } = await import("@/actions/items")
    const result = await getLanguageOptions()

    expect(result).toEqual({
      success: true,
      data: ["typescript", "python"],
    })
    expect(getDistinctLanguages).toHaveBeenCalledWith(testUser.id)
  })

  it("returns a failure result when the user is not authenticated", async () => {
    authProtect.mockRejectedValue(new Error("Unauthorized"))

    const { getLanguageOptions } = await import("@/actions/items")
    const result = await getLanguageOptions()

    expect(result).toEqual({ success: false, error: "Unauthorized" })
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
