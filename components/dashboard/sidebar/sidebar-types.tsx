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
import { iconsByName } from "@/lib/type-icons"

function typeSlug(name: string) {
  return `${name.toLowerCase()}s`
}

export function SidebarTypes({ itemTypes }: { itemTypes: ItemTypeSummary[] }) {
  return (
    <SidebarSection title="Types" storageKey="types">
      <SidebarMenu>
        {itemTypes.map((type) => {
          const TypeIcon = iconsByName[type.icon] ?? FileIcon
          const isProType =
            type.name.toLowerCase() === "file" ||
            type.name.toLowerCase() === "image"
          return (
            <SidebarMenuItem key={type.id}>
              <SidebarMenuButton
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
