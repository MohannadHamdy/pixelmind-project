"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useUser } from "@clerk/nextjs"
import { TrashIcon } from "@phosphor-icons/react/dist/ssr"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { deleteAccountData } from "@/actions/account"

const CONFIRM_TEXT = "delete"

export function DeleteAccountDialog() {
  const { user } = useUser()
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [confirmText, setConfirmText] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  async function handleDelete() {
    if (!user) return

    setIsDeleting(true)
    setError(null)
    try {
      const result = await deleteAccountData()
      if (!result.success) {
        setError(result.error)
        setIsDeleting(false)
        return
      }
      await user.delete()
      router.push("/")
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to delete account"
      setError(message)
      setIsDeleting(false)
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next)
        if (!next) {
          setConfirmText("")
          setError(null)
        }
      }}
    >
      <DialogTrigger render={<Button variant="destructive" />}>
        <TrashIcon />
        Delete account
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete account</DialogTitle>
          <DialogDescription>
            This permanently deletes your account and all items, collections,
            and tags. This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="confirm-delete">
            Type <span className="font-semibold">{CONFIRM_TEXT}</span> to
            confirm
          </Label>
          <Input
            id="confirm-delete"
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            autoComplete="off"
          />
          {error && <p className="text-sm text-destructive">{error}</p>}
        </div>
        <DialogFooter>
          <DialogClose render={<Button type="button" variant="outline" />}>
            Cancel
          </DialogClose>
          <Button
            variant="destructive"
            disabled={confirmText !== CONFIRM_TEXT || isDeleting}
            onClick={handleDelete}
          >
            {isDeleting ? "Deleting..." : "Delete account"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
