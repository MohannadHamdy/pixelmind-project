import Link from "next/link"
import { FileIcon } from "@phosphor-icons/react/dist/ssr"

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Badge } from "@/components/ui/badge"
import { SidebarSection } from "@/components/dashboard/sidebar/sidebar-section"
import type { ItemTypeSummary } from "@/lib/db/item-types"
import { typeSlug } from "@/lib/item-type-slug"
import { iconsByName } from "@/lib/type-icons"

export function SidebarTypes({
  itemTypes,
  pathname,
}: {
  itemTypes: ItemTypeSummary[]
  pathname: string
}) {
  return (
    <SidebarSection title="Types" storageKey="types">
      <SidebarMenu>
        {itemTypes.map((type) => {
          const TypeIcon = iconsByName[type.icon] ?? FileIcon
          const isProType =
            type.name.toLowerCase() === "file" ||
            type.name.toLowerCase() === "image"
          const isActive = pathname === `/items/${typeSlug(type.name)}`
          return (
            <SidebarMenuItem key={type.id}>
              <SidebarMenuButton
                isActive={isActive}
                render={<Link href={`/items/${typeSlug(type.name)}`} />}
                tooltip={type.name}
              >
                <TypeIcon style={{ color: type.color }} />
                <span className="capitalize">{type.name}</span>
                {isProType && (
                  <Badge
                    variant="secondary"
                    className="ml-auto font-bold uppercase group-hover/menu-button:text-primary group-data-[collapsible=icon]:hidden"
                  >
                    Pro
                  </Badge>
                )}
              </SidebarMenuButton>
            </SidebarMenuItem>
          )
        })}
      </SidebarMenu>
    </SidebarSection>
  )
}
