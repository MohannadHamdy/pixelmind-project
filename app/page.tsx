import Link from "next/link"
import { Show, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs"

import { Button } from "@/components/ui/button"

export default function Page() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 text-center">
      <h1 className="text-4xl font-semibold">PixelMind</h1>
      <p className="text-muted-foreground">Store Smarter. Build Faster.</p>
      <Show when="signed-out">
        <div className="flex gap-3">
          <SignInButton>
            <Button variant="outline">Sign in</Button>
          </SignInButton>
          <SignUpButton>
            <Button>Sign up</Button>
          </SignUpButton>
        </div>
      </Show>
      <Show when="signed-in">
        <div className="flex items-center gap-3">
          <Button render={<Link href="/dashboard" />}>Go to dashboard</Button>
          <UserButton />
        </div>
      </Show>
    </div>
  )
}
