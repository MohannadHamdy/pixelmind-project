import { describe, expect, it } from "vitest"

import { getTagColorClass } from "@/lib/tag-colors"

describe("getTagColorClass", () => {
  it("returns the same class for the same tag name", () => {
    expect(getTagColorClass("react")).toBe(getTagColorClass("react"))
  })

  it("returns different classes for different tag names", () => {
    expect(getTagColorClass("react")).not.toBe(getTagColorClass("docker"))
  })

  it("returns a non-empty class for an empty string", () => {
    expect(getTagColorClass("")).toBeTruthy()
  })
})
