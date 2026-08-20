import { FolderIcon } from "@phosphor-icons/react/dist/ssr"

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { SidebarCountBadge } from "@/components/dashboard/sidebar/sidebar-count-badge"
import { SidebarSection } from "@/components/dashboard/sidebar/sidebar-section"
import type { CollectionSummary } from "@/lib/db/collections"

export function SidebarCollections({
  collections,
}: {
  collections: CollectionSummary[]
}) {
  return (
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
  )
}
