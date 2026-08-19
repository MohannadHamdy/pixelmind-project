"use client"

import { MoonIcon, SunIcon } from "@phosphor-icons/react/dist/ssr"
import { useTheme } from "next-themes"

import { cn } from "@/lib/utils"

export function ThemeToggle() {
  const { setTheme } = useTheme()

  return (
    <div className="hidden items-center rounded-lg border border-border p-0.5 sm:flex">
      <button
        type="button"
        onClick={() => setTheme("light")}
        aria-label="Light mode"
        className={cn(
          "rounded-md p-1.5 transition-colors",
          "bg-accent text-foreground",
          "dark:bg-transparent dark:text-muted-foreground dark:hover:text-foreground"
        )}
      >
        <SunIcon className="size-4" />
      </button>
      <button
        type="button"
        onClick={() => setTheme("dark")}
        aria-label="Dark mode"
        className={cn(
          "rounded-md p-1.5 transition-colors",
          "text-muted-foreground hover:text-foreground",
          "dark:bg-accent dark:text-foreground"
        )}
      >
        <MoonIcon className="size-4" />
      </button>
    </div>
  )
}
