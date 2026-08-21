import { describe, expect, it } from "vitest"

import { typeSlug } from "@/lib/item-type-slug"

describe("typeSlug", () => {
  it("lowercases and pluralizes the type name", () => {
    expect(typeSlug("Snippet")).toBe("snippets")
    expect(typeSlug("URL")).toBe("urls")
  })

  it("is a no-op case-wise on already-lowercase input", () => {
    expect(typeSlug("note")).toBe("notes")
  })
})
