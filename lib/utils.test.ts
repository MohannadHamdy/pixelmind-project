import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { cn, formatRelativeTime } from "@/lib/utils"

describe("cn", () => {
  it("merges class names and resolves tailwind conflicts", () => {
    expect(cn("px-2", "px-4")).toBe("px-4")
  })

  it("drops falsy values", () => {
    expect(cn("a", false, undefined, "b")).toBe("a b")
  })
})

describe("formatRelativeTime", () => {
  const now = new Date("2026-08-21T12:00:00.000Z")

  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(now)
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it("returns 'just now' for sub-minute differences", () => {
    expect(formatRelativeTime(now.toISOString())).toBe("just now")
  })

  it("formats minutes", () => {
    const date = new Date(now.getTime() - 5 * 60 * 1000).toISOString()
    expect(formatRelativeTime(date)).toBe("5m ago")
  })

  it("formats hours", () => {
    const date = new Date(now.getTime() - 3 * 60 * 60 * 1000).toISOString()
    expect(formatRelativeTime(date)).toBe("3h ago")
  })

  it("formats days", () => {
    const date = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString()
    expect(formatRelativeTime(date)).toBe("2d ago")
  })

  it("formats weeks", () => {
    const date = new Date(
      now.getTime() - 3 * 7 * 24 * 60 * 60 * 1000
    ).toISOString()
    expect(formatRelativeTime(date)).toBe("3w ago")
  })
})
