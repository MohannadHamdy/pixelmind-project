"use client"

import { GridFourIcon, ListIcon } from "@phosphor-icons/react/dist/ssr"
import { usePathname, useRouter, useSearchParams } from "next/navigation"

import { cn } from "@/lib/utils"

export function ViewToggle() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const view = searchParams.get("view") === "list" ? "list" : "grid"

  function setView(value: "grid" | "list") {
    const params = new URLSearchParams(searchParams)
    if (value === "grid") {
      params.delete("view")
    } else {
      params.set("view", value)
    }

    const query = params.toString()
    router.push(query ? `${pathname}?${query}` : pathname)
  }

  return (
    <div className="hidden items-center rounded-lg border border-border p-0.5 sm:flex">
      <button
        type="button"
        onClick={() => setView("grid")}
        aria-label="Grid view"
        className={cn(
          "rounded-md p-1.5 transition-colors",
          view === "grid"
            ? "bg-accent text-foreground"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        <GridFourIcon className="size-4" />
      </button>
      <button
        type="button"
        onClick={() => setView("list")}
        aria-label="List view"
        className={cn(
          "rounded-md p-1.5 transition-colors",
          view === "list"
            ? "bg-accent text-foreground"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        <ListIcon className="size-4" />
      </button>
    </div>
  )
}
