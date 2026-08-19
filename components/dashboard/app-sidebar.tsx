"use client"

import Link from "next/link"
import { useUser, UserButton } from "@clerk/nextjs"
import {
  ArrowLineLeftIcon,
  CaretDownIcon,
  ClockIcon,
  FileIcon,
  FolderIcon,
  GearIcon,
  PlusIcon,
  SquaresFourIcon,
  StarIcon,
} from "@phosphor-icons/react/dist/ssr"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { cn } from "@/lib/utils"
import { useLocalStorage } from "@/hooks/use-local-storage"
import { FREE_ITEM_LIMIT } from "@/lib/constants"
import type { CollectionSummary } from "@/lib/db/collections"
import type { ItemTypeSummary } from "@/lib/db/item-types"
import { iconsByName } from "@/lib/type-icons"

function typeSlug(name: string) {
  return `${name.toLowerCase()}s`
}

function SidebarCountBadge({ count }: { count: number }) {
  return (
    <Badge className="pointer-events-none absolute top-1/2 right-2 -translate-y-1/2 group-data-[collapsible=icon]:hidden">
      {count}
    </Badge>
  )
}

function SidebarSection({
  storageKey,
  className,
  title,
  children,
}: {
  storageKey: string
  className?: string
  title: string
  children: React.ReactNode
}) {
  const [open, setOpen] = useLocalStorage(`sidebar-section-${storageKey}`, true)

  return (
    <Collapsible
      open={open}
      onOpenChange={setOpen}
      className={cn("group/collapsible", className)}
    >
      <SidebarGroup>
        <SidebarGroupLabel
          className="group/trigger"
          render={<CollapsibleTrigger />}
        >
          {title}
          <CaretDownIcon className="ml-auto transition-transform duration-200 group-data-panel-open/trigger:rotate-180" />
        </SidebarGroupLabel>
        <CollapsibleContent>
          <SidebarGroupContent>{children}</SidebarGroupContent>
        </CollapsibleContent>
      </SidebarGroup>
    </Collapsible>
  )
}

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
  const { user } = useUser()

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="gap-3 border-b border-sidebar-border p-3">
        <div className="flex items-center gap-2">
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
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton isActive tooltip="All items">
                  <SquaresFourIcon />
                  <span>All items</span>
                </SidebarMenuButton>
                <SidebarCountBadge count={itemCount} />
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="Favorites">
                  <StarIcon />
                  <span>Favorites</span>
                </SidebarMenuButton>
                <SidebarCountBadge count={favoriteCount} />
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="Recently used">
                  <ClockIcon />
                  <span>Recently used</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSection title="Collections" storageKey="collections">
          <SidebarMenu>
            {collections.map((collection) => (
              <SidebarMenuItem key={collection.id}>
                <SidebarMenuButton tooltip={collection.name}>
                  <FolderIcon />
                  <span>{collection.name}</span>
                </SidebarMenuButton>
                <SidebarCountBadge count={collection.itemCount} />
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarSection>

        <SidebarSection title="Types" storageKey="types">
          <SidebarMenu>
            {itemTypes.map((type) => {
              const TypeIcon = iconsByName[type.icon] ?? FileIcon
              return (
                <SidebarMenuItem key={type.id}>
                  <SidebarMenuButton
                    render={<Link href={`/items/${typeSlug(type.name)}`} />}
                    tooltip={type.name}
                  >
                    <TypeIcon style={{ color: type.color }} />
                    <span className="capitalize">{type.name}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )
            })}
          </SidebarMenu>
        </SidebarSection>

        <SidebarSection
          title="Tags"
          storageKey="tags"
          className="group-data-[collapsible=icon]:hidden"
        >
          <SidebarGroupContent className="flex flex-wrap gap-1.5 px-1">
            {tags.map((tag) => (
              <Badge key={tag} variant="secondary">
                #{tag}
              </Badge>
            ))}
          </SidebarGroupContent>
        </SidebarSection>
      </SidebarContent>

      <SidebarFooter className="gap-3 border-t border-sidebar-border p-3">
        {!isPro && (
          <div className="flex flex-col gap-2 rounded-xl bg-secondary p-3 group-data-[collapsible=icon]:hidden">
            <div className="flex flex-col gap-0.5">
              <span className="text-sm font-medium">Upgrade to Pro</span>
              <span className="text-xs text-muted-foreground">
                Unlimited items, AI tagging, exports.
              </span>
            </div>
            <Button variant="outline" size="sm">
              $8 / month
            </Button>
          </div>
        )}
        <div className="flex items-center gap-2">
          <UserButton />
          <div className="flex min-w-0 flex-1 flex-col group-data-[collapsible=icon]:hidden">
            <span className="truncate text-sm font-medium">
              {user?.fullName}
            </span>
            <span className="truncate text-xs text-muted-foreground">
              {user?.primaryEmailAddress?.emailAddress}
            </span>
          </div>
          <Button
            variant="ghost"
            size="icon-sm"
            className="shrink-0 group-data-[collapsible=icon]:hidden"
          >
            <GearIcon />
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
