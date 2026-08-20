import { NextResponse } from "next/server"
import { Webhook } from "svix"
import type { WebhookEvent } from "@clerk/nextjs/server"
import { db } from "@/db"
import { users } from "@/db/schema"
import { eq } from "drizzle-orm"

async function verifyWebhook(request: Request): Promise<WebhookEvent> {
  const secret = process.env.CLERK_WEBHOOK_SECRET
  if (!secret) throw new Error("CLERK_WEBHOOK_SECRET is not set")

  const svixId = request.headers.get("svix-id")
  const svixTimestamp = request.headers.get("svix-timestamp")
  const svixSignature = request.headers.get("svix-signature")
  if (!svixId || !svixTimestamp || !svixSignature) {
    throw new Error("Missing svix headers")
  }

  const body = await request.text()
  const webhook = new Webhook(secret)

  return webhook.verify(body, {
    "svix-id": svixId,
    "svix-timestamp": svixTimestamp,
    "svix-signature": svixSignature,
  }) as WebhookEvent
}

export async function POST(request: Request) {
  let event: WebhookEvent
  try {
    event = await verifyWebhook(request)
  } catch {
    return NextResponse.json({ error: "Invalid webhook" }, { status: 400 })
  }

  try {
    switch (event.type) {
      case "user.created":
      case "user.updated": {
        const { id, email_addresses, primary_email_address_id } = event.data
        const primaryEmail = email_addresses.find(
          (e) => e.id === primary_email_address_id
        )?.email_address

        if (!primaryEmail) break

        await db
          .insert(users)
          .values({ id, email: primaryEmail })
          .onConflictDoUpdate({
            target: users.id,
            set: { email: primaryEmail },
          })
        break
      }
      case "user.deleted": {
        if (event.data.id) {
          await db.delete(users).where(eq(users.id, event.data.id))
        }
        break
      }
    }
  } catch (error) {
    console.error(
      `Clerk webhook handler failed for event ${event.type}:`,
      error
    )
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    )
  }

  return NextResponse.json({ received: true })
}
