import Link from "next/link"
import { useUser, UserButton } from "@clerk/nextjs"
import { GearIcon } from "@phosphor-icons/react/dist/ssr"

import { SidebarFooter } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"

export function SidebarUserFooter({ isPro }: { isPro: boolean }) {
  const { user } = useUser()

  return (
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
          <span className="truncate text-sm font-medium">{user?.fullName}</span>
          <span className="truncate text-xs text-muted-foreground">
            {user?.primaryEmailAddress?.emailAddress}
          </span>
        </div>
        <Button
          variant="ghost"
          size="icon-sm"
          className="shrink-0 group-data-[collapsible=icon]:hidden"
          render={<Link href="/profile" />}
          nativeButton={false}
        >
          <GearIcon />
        </Button>
      </div>
    </SidebarFooter>
  )
}
