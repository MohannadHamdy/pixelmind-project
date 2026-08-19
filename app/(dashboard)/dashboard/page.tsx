import { auth, currentUser } from "@clerk/nextjs/server"

import { CollectionsSection } from "@/components/dashboard/collections-section"
import { PinnedItemsSection } from "@/components/dashboard/pinned-items-section"
import { RecentItemsSection } from "@/components/dashboard/recent-items-section"
import { StatsCards } from "@/components/dashboard/stats-cards"
import { TopBar } from "@/components/dashboard/top-bar"
import { getDashboardStats } from "@/lib/db/items"

function getGreeting() {
  const hour = new Date().getHours()
  if (hour < 12) return "Good morning"
  if (hour < 18) return "Good afternoon"
  return "Good evening"
}

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ view?: string }>
}) {
  const { userId } = await auth()
  if (!userId) return null

  const user = await currentUser()
  const firstName = user?.firstName ?? "there"
  const { totalItems, favoriteItems, pinnedItems, totalCollections } =
    await getDashboardStats(userId)
  const view = (await searchParams).view === "list" ? "list" : "grid"

  return (
    <>
      <TopBar />
      <div className="border-b border-border px-4 py-7 sm:px-6">
        <h2 className="font-heading text-2xl font-semibold tracking-tight sm:text-3xl">
          {getGreeting()}, {firstName}
        </h2>
        <p className="mt-1.5 text-sm text-muted-foreground">
          {totalItems} items across {totalCollections} collections ·{" "}
          {favoriteItems} favorites · {pinnedItems} pinned
        </p>
      </div>
      <div className="flex-1 overflow-y-auto p-6">
        <div className="mx-auto flex max-w-6xl flex-col gap-8">
          <StatsCards />
          <CollectionsSection />
          <PinnedItemsSection view={view} />
          <RecentItemsSection view={view} />
        </div>
      </div>
    </>
  )
}
