import { Badge } from "@/components/ui/badge"

export function SidebarCountBadge({ count }: { count: number }) {
  return (
    <Badge className="pointer-events-none absolute top-1/2 right-2 -translate-y-1/2 group-data-[collapsible=icon]:hidden">
      {count}
    </Badge>
  )
}
