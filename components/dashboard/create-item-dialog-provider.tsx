"use client"

import { createContext, use, useState } from "react"

import { CreateItemDialog } from "@/components/dashboard/create-item-dialog"

interface CreateItemDialogContextValue {
  openCreateDialog: () => void
}

const CreateItemDialogContext =
  createContext<CreateItemDialogContextValue | null>(null)

export function useCreateItemDialog() {
  const context = use(CreateItemDialogContext)
  if (!context) {
    throw new Error(
      "useCreateItemDialog must be used within a CreateItemDialogProvider"
    )
  }
  return context
}

export function CreateItemDialogProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [open, setOpen] = useState(false)

  return (
    <CreateItemDialogContext value={{ openCreateDialog: () => setOpen(true) }}>
      {children}
      <CreateItemDialog open={open} onOpenChange={setOpen} />
    </CreateItemDialogContext>
  )
}
