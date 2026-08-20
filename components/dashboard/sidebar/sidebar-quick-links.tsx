import Link from "next/link"
import {
  ClockIcon,
  SquaresFourIcon,
  StarIcon,
} from "@phosphor-icons/react/dist/ssr"

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { SidebarCountBadge } from "@/components/dashboard/sidebar/sidebar-count-badge"

export function SidebarQuickLinks({
  isDashboardActive,
  itemCount,
  favoriteCount,
}: {
  isDashboardActive: boolean
  itemCount: number
  favoriteCount: number
}) {
  return (
    <SidebarGroup>
      <SidebarGroupContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              isActive={isDashboardActive}
              tooltip="All items"
              render={<Link href="/dashboard" />}
            >
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
  )
}
