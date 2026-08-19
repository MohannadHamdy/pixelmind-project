import { CollectionsSection } from "@/components/dashboard/collections-section"
import { PinnedItemsSection } from "@/components/dashboard/pinned-items-section"
import { RecentItemsSection } from "@/components/dashboard/recent-items-section"
import { StatsCards } from "@/components/dashboard/stats-cards"
import { TopBar } from "@/components/dashboard/top-bar"
import { collections, currentUser, items } from "@/lib/mock-data"

function getGreeting() {
  const hour = new Date().getHours()
  if (hour < 12) return "Good morning"
  if (hour < 18) return "Good afternoon"
  return "Good evening"
}

export default function DashboardPage() {
  const firstName = currentUser.name.split(" ")[0]
  const favoriteCount = items.filter((item) => item.isFavorite).length
  const pinnedCount = items.filter((item) => item.isPinned).length

  return (
    <>
      <TopBar />
      <div className="border-b border-border px-4 py-7 sm:px-6">
        <h2 className="font-heading text-2xl font-semibold tracking-tight sm:text-3xl">
          {getGreeting()}, {firstName}
        </h2>
        <p className="mt-1.5 text-sm text-muted-foreground">
          {items.length} items across {collections.length} collections ·{" "}
          {favoriteCount} favorites · {pinnedCount} pinned
        </p>
      </div>
      <div className="flex-1 overflow-y-auto p-6">
        <div className="mx-auto flex max-w-6xl flex-col gap-8">
          <StatsCards />
          <CollectionsSection />
          <PinnedItemsSection />
          <RecentItemsSection />
        </div>
      </div>
    </>
  )
}
