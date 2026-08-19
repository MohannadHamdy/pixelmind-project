import {
  FolderIcon,
  SquaresFourIcon,
  StarIcon,
} from "@phosphor-icons/react/dist/ssr"
import type { Icon } from "@phosphor-icons/react"

import { Card, CardContent } from "@/components/ui/card"
import { collections, items } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

function StatCard({
  label,
  value,
  icon: Icon,
  className,
}: {
  label: string
  value: number
  icon: Icon
  className?: string
}) {
  return (
    <Card size="sm" className="rounded-2xl">
      <CardContent className="flex items-center gap-3">
        <div
          className={cn(
            "flex size-9 shrink-0 items-center justify-center rounded-xl",
            className
          )}
        >
          <Icon className="size-4.5" />
        </div>
        <div className="flex flex-col">
          <span className="text-lg font-semibold">{value}</span>
          <span className="text-xs text-muted-foreground">{label}</span>
        </div>
      </CardContent>
    </Card>
  )
}

export function StatsCards() {
  const stats = [
    {
      label: "Items",
      value: items.length,
      icon: SquaresFourIcon,
      className: "bg-emerald-500/10 text-emerald-500",
    },
    {
      label: "Collections",
      value: collections.length,
      icon: FolderIcon,
      className: "bg-blue-500/10 text-blue-500",
    },
    {
      label: "Favorite items",
      value: items.filter((item) => item.isFavorite).length,
      icon: StarIcon,
      className: "bg-amber-500/10 text-amber-500",
    },
    {
      label: "Favorite collections",
      value: collections.filter((collection) => collection.isFavorite).length,
      icon: StarIcon,
      className: "bg-rose-500/10 text-rose-500",
    },
  ]

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {stats.map((stat) => (
        <StatCard key={stat.label} {...stat} />
      ))}
    </div>
  )
}
