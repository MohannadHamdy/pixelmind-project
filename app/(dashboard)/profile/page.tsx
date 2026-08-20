import Link from "next/link"
import { auth, currentUser } from "@clerk/nextjs/server"
import { ArrowLeftIcon, CalendarBlankIcon } from "@phosphor-icons/react/dist/ssr"

import { AccountActions } from "@/components/dashboard/profile/account-actions"
import { ProfileManager } from "@/components/dashboard/profile/profile-manager"
import { TypeBreakdown } from "@/components/dashboard/profile/type-breakdown"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { getDashboardStats, getItemCountsByType } from "@/lib/db/items"

export default async function ProfilePage() {
  const { userId } = await auth()
  if (!userId) return null

  const [user, { totalItems, totalCollections }, typeCounts] =
    await Promise.all([
      currentUser(),
      getDashboardStats(userId),
      getItemCountsByType(userId),
    ])

  return (
    <>
      <header className="flex h-18 shrink-0 items-center gap-4 border-b border-border px-6">
        <SidebarTrigger />
        <Button
          variant="ghost"
          size="icon-sm"
          render={<Link href="/dashboard" />}
          nativeButton={false}
        >
          <ArrowLeftIcon />
        </Button>
        <h1 className="font-heading text-lg font-semibold tracking-tight">
          Profile
        </h1>
      </header>
      <div className="flex-1 overflow-y-auto p-6">
        <div className="mx-auto flex w-full min-w-0 max-w-4xl flex-col gap-6">
          {user && (
            <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <CalendarBlankIcon className="size-4" />
              Joined{" "}
              {new Date(user.createdAt).toLocaleDateString(undefined, {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          )}

          <div className="grid grid-cols-2 gap-4">
            <Card size="sm" className="rounded-2xl">
              <CardContent>
                <span className="text-2xl font-semibold">{totalItems}</span>
                <p className="text-xs text-muted-foreground">Total items</p>
              </CardContent>
            </Card>
            <Card size="sm" className="rounded-2xl">
              <CardContent>
                <span className="text-2xl font-semibold">
                  {totalCollections}
                </span>
                <p className="text-xs text-muted-foreground">
                  Total collections
                </p>
              </CardContent>
            </Card>
          </div>

          <TypeBreakdown typeCounts={typeCounts} />

          <ProfileManager />

          <AccountActions />
        </div>
      </div>
    </>
  )
}
