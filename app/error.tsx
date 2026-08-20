"use client"

import { useEffect } from "react"
import { WarningIcon } from "@phosphor-icons/react/dist/ssr"

import { Button } from "@/components/ui/button"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-4 p-6 text-center">
      <div className="flex size-12 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
        <WarningIcon className="size-6" weight="fill" />
      </div>
      <div className="flex flex-col gap-1.5">
        <h1 className="font-heading text-xl font-semibold tracking-tight">
          Something went wrong
        </h1>
        <p className="text-sm text-muted-foreground">
          An unexpected error occurred. Try again, or come back later.
        </p>
      </div>
      <Button onClick={reset}>Try again</Button>
    </div>
  )
}
