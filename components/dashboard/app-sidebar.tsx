"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ArrowLineLeftIcon, PlusIcon } from "@phosphor-icons/react/dist/ssr"

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { SidebarQuickLinks } from "@/components/dashboard/sidebar/sidebar-quick-links"
import { SidebarCollections } from "@/components/dashboard/sidebar/sidebar-collections"
import { SidebarTypes } from "@/components/dashboard/sidebar/sidebar-types"
import { SidebarTags } from "@/components/dashboard/sidebar/sidebar-tags"
import { SidebarUserFooter } from "@/components/dashboard/sidebar/sidebar-user-footer"
import { FREE_ITEM_LIMIT } from "@/lib/constants"
import type { CollectionSummary } from "@/lib/db/collections"
import type { ItemTypeSummary } from "@/lib/db/item-types"

export function AppSidebar({
  isPro,
  itemCount,
  favoriteCount,
  collections,
  itemTypes,
  tags,
}: {
  isPro: boolean
  itemCount: number
  favoriteCount: number
  collections: CollectionSummary[]
  itemTypes: ItemTypeSummary[]
  tags: string[]
}) {
  const pathname = usePathname()

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="gap-3 border-b border-sidebar-border p-3">
        <div className="flex items-center gap-2">
          <Link
            href="/dashboard"
            className="flex min-w-0 flex-1 items-center gap-2"
          >
            <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary text-sm font-semibold text-primary-foreground">
              P
            </div>
            <div className="flex min-w-0 flex-1 flex-col group-data-[collapsible=icon]:hidden">
              <span className="truncate text-sm font-semibold">PixelMind</span>
              <span className="truncate text-xs text-muted-foreground">
                {isPro ? "Pro" : "Free"} · {itemCount}
                {!isPro && ` / ${FREE_ITEM_LIMIT}`} items
              </span>
            </div>
          </Link>
          <SidebarTrigger
            icon={<ArrowLineLeftIcon />}
            className="group-data-[collapsible=icon]:hidden"
          />
        </div>
        <Button className="w-full group-data-[collapsible=icon]:size-8 group-data-[collapsible=icon]:p-0">
          <PlusIcon />
          <span className="group-data-[collapsible=icon]:hidden">New item</span>
        </Button>
      </SidebarHeader>

      <SidebarContent>
        <SidebarQuickLinks
          isDashboardActive={pathname === "/dashboard"}
          itemCount={itemCount}
          favoriteCount={favoriteCount}
        />
        <SidebarCollections collections={collections} />
        <SidebarTypes itemTypes={itemTypes} pathname={pathname} />
        <SidebarTags tags={tags} />
      </SidebarContent>

      <SidebarUserFooter isPro={isPro} />
    </Sidebar>
  )
}
