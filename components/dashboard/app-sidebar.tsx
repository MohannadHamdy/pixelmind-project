"use client"

import Link from "next/link"
import {
  CaretDownIcon,
  ChatCircleIcon,
  ClockIcon,
  CodeIcon,
  FileIcon,
  FolderIcon,
  GearIcon,
  ImageIcon,
  LinkIcon,
  NoteIcon,
  PlusIcon,
  SquaresFourIcon,
  StarIcon,
  TerminalIcon,
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
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { cn } from "@/lib/utils"
import { useLocalStorage } from "@/hooks/use-local-storage"
import { collections, currentUser, items, itemTypes } from "@/lib/mock-data"

const typeStyles: Record<string, { icon: typeof CodeIcon; className: string }> =
  {
    type_snippet: { icon: CodeIcon, className: "text-emerald-500" },
    type_prompt: { icon: ChatCircleIcon, className: "text-blue-500" },
    type_note: { icon: NoteIcon, className: "text-amber-500" },
    type_command: { icon: TerminalIcon, className: "text-violet-500" },
    type_file: { icon: FileIcon, className: "text-rose-500" },
    type_image: { icon: ImageIcon, className: "text-sky-500" },
    type_url: { icon: LinkIcon, className: "text-emerald-500" },
  }

function typeSlug(name: string) {
  return `${name.toLowerCase()}s`
}

function getTags(limit: number) {
  return Array.from(new Set(items.flatMap((item) => item.tags))).slice(0, limit)
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
  const [open, setOpen] = useLocalStorage(
    `sidebar-section-${storageKey}`,
    true
  )

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

export function AppSidebar() {
  const favoriteCount = items.filter((item) => item.isFavorite).length
  const tags = getTags(8)
  const initials = currentUser.name
    .split(" ")
    .map((part) => part[0])
    .join("")

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
              {currentUser.isPro ? "Pro" : "Free"} · {currentUser.itemCount} /{" "}
              {currentUser.itemLimit} items
            </span>
          </div>
          <SidebarTrigger className="group-data-[collapsible=icon]:hidden" />
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
                <SidebarMenuBadge>{currentUser.itemCount}</SidebarMenuBadge>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="Favorites">
                  <StarIcon />
                  <span>Favorites</span>
                </SidebarMenuButton>
                <SidebarMenuBadge>{favoriteCount}</SidebarMenuBadge>
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
                <SidebarMenuBadge>{collection.itemCount}</SidebarMenuBadge>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarSection>

        <SidebarSection title="Types" storageKey="types">
          <SidebarMenu>
            {itemTypes.map((type) => {
              const { icon: Icon, className } = typeStyles[type.id] ?? {
                icon: FileIcon,
                className: "",
              }
              return (
                <SidebarMenuItem key={type.id}>
                  <SidebarMenuButton
                    render={
                      <Link href={`/items/${typeSlug(type.name)}`} />
                    }
                    tooltip={type.name}
                  >
                    <Icon className={className} />
                    <span>{type.name}</span>
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
        {!currentUser.isPro && (
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
          <Avatar size="sm" className="shrink-0">
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div className="flex min-w-0 flex-1 flex-col group-data-[collapsible=icon]:hidden">
            <span className="truncate text-sm font-medium">
              {currentUser.name}
            </span>
            <span className="truncate text-xs text-muted-foreground">
              {currentUser.email}
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
