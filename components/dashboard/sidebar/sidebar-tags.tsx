import { SidebarGroupContent } from "@/components/ui/sidebar"
import { Badge } from "@/components/ui/badge"
import { SidebarSection } from "@/components/dashboard/sidebar/sidebar-section"

export function SidebarTags({ tags }: { tags: string[] }) {
  return (
    <SidebarSection
      title="Tags"
      storageKey="tags"
      className="group-data-[collapsible=icon]:hidden"
    >
      <SidebarGroupContent className="flex flex-wrap gap-1.5 px-1">
        {tags.map((tag) => (
          <Badge key={tag} variant="secondary">
            #{tag}
          </Badge>
        ))}
      </SidebarGroupContent>
    </SidebarSection>
  )
}
