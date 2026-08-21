import { auth } from "@clerk/nextjs/server"

import { AppSidebar } from "@/components/dashboard/app-sidebar"
import { CreateItemDialogProvider } from "@/components/dashboard/create-item-dialog-provider"
import { ItemDrawerProvider } from "@/components/dashboard/item-drawer-provider"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { getAllCollectionsWithCounts } from "@/lib/db/collections"
import { getItemTypesForUser } from "@/lib/db/item-types"
import { getDashboardStats } from "@/lib/db/items"
import { getTopTags } from "@/lib/db/tags"
import { isUserPro } from "@/lib/db/users"

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const { userId } = await auth.protect()

  const [stats, collections, itemTypes, tags, isPro] = await Promise.all([
    getDashboardStats(userId),
    getAllCollectionsWithCounts(userId),
    getItemTypesForUser(userId),
    getTopTags(userId),
    isUserPro(userId),
  ])

  return (
    <SidebarProvider>
      <ItemDrawerProvider>
        <CreateItemDialogProvider>
          <AppSidebar
            isPro={isPro}
            itemCount={stats.totalItems}
            favoriteCount={stats.favoriteItems}
            collections={collections}
            itemTypes={itemTypes}
            tags={tags}
          />
          <SidebarInset className="bg-transparent">{children}</SidebarInset>
        </CreateItemDialogProvider>
      </ItemDrawerProvider>
    </SidebarProvider>
  )
}
