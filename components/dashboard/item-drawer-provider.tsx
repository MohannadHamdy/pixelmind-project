"use client"

import { createContext, use, useState } from "react"

import { ItemDrawer } from "@/components/dashboard/item-drawer"

interface ItemDrawerContextValue {
  openItem: (id: string) => void
}

const ItemDrawerContext = createContext<ItemDrawerContextValue | null>(null)

export function useItemDrawer() {
  const context = use(ItemDrawerContext)
  if (!context) {
    throw new Error("useItemDrawer must be used within an ItemDrawerProvider")
  }
  return context
}

export function ItemDrawerProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [itemId, setItemId] = useState<string | null>(null)
  const [open, setOpen] = useState(false)

  return (
    <ItemDrawerContext
      value={{
        openItem: (id) => {
          setItemId(id)
          setOpen(true)
        },
      }}
    >
      {children}
      <ItemDrawer itemId={itemId} open={open} onOpenChange={setOpen} />
    </ItemDrawerContext>
  )
}
