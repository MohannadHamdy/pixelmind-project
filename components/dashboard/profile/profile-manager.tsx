"use client"

import { UserProfile } from "@clerk/nextjs"

export function ProfileManager() {
  return (
    <div className="w-full min-w-0 overflow-hidden rounded-4xl bg-card ring-1 ring-foreground/5">
      <div className="w-full min-w-0 overflow-x-auto">
        <UserProfile
          routing="hash"
          appearance={{
            elements: {
              rootBox: "w-full min-w-0",
              cardBox: "w-full min-w-0 shadow-none border-0",
              pageScrollBox: "border-0",
              scrollBox: "border-0",
            },
          }}
        />
      </div>
    </div>
  )
}
