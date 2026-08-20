import { CaretDownIcon } from "@phosphor-icons/react/dist/ssr"

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
} from "@/components/ui/sidebar"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { cn } from "@/lib/utils"
import { useLocalStorage } from "@/hooks/use-local-storage"

export function SidebarSection({
  storageKey,
  className,
  title,
  children,
}: {
  storageKey: string
  className?: string
  title: string
  children: React.ReactNode
}) {
  const [open, setOpen] = useLocalStorage(`sidebar-section-${storageKey}`, true)

  return (
    <Collapsible
      open={open}
      onOpenChange={setOpen}
      className={cn("group/collapsible", className)}
    >
      <SidebarGroup>
        <SidebarGroupLabel
          className="group/trigger"
          render={<CollapsibleTrigger />}
        >
          {title}
          <CaretDownIcon className="ml-auto transition-transform duration-200 group-data-panel-open/trigger:rotate-180" />
        </SidebarGroupLabel>
        <CollapsibleContent>
          <SidebarGroupContent>{children}</SidebarGroupContent>
        </CollapsibleContent>
      </SidebarGroup>
    </Collapsible>
  )
}
