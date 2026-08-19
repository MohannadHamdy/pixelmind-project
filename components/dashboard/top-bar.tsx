"use client"

import { MagnifyingGlassIcon, PlusIcon } from "@phosphor-icons/react/dist/ssr"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar"

export function TopBar() {
  const { state, isMobile } = useSidebar()
  const showTrigger = isMobile || state === "collapsed"

  return (
    <header className="flex h-16 shrink-0 items-center gap-4 border-b border-border px-6">
      {showTrigger && <SidebarTrigger />}
      <div className="relative max-w-md flex-1">
        <MagnifyingGlassIcon className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search snippets, prompts, tags..."
          className="bg-muted pl-9"
        />
      </div>
      <Button data-icon="inline-start">
        <PlusIcon />
        New
      </Button>
    </header>
  )
}
