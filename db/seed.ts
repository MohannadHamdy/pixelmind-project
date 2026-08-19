process.loadEnvFile(".env.local")

import { drizzle } from "drizzle-orm/neon-http"
import {
  collections,
  itemTags,
  items,
  itemTypes,
  tags,
  users,
} from "./schema.ts"
import {
  collections as mockCollections,
  currentUser,
  items as mockItems,
  itemTypes as mockItemTypes,
} from "../lib/mock-data.ts"

const db = drizzle(process.env.DATABASE_URL!)

const userId = process.argv[2] ?? process.env.SEED_USER_ID

if (!userId) {
  console.error(
    "Usage: node db/seed.ts <clerk-user-id>\n" +
      "(or set SEED_USER_ID in .env.local)\n\n" +
      "Grab a user ID from your Clerk dashboard, or from the `user` table\n" +
      "after a webhook sync has run."
  )
  process.exit(1)
}

async function seed() {
  console.log(`Seeding data for user ${userId}...`)

  await db
    .insert(users)
    .values({ id: userId, email: currentUser.email, isPro: currentUser.isPro })
    .onConflictDoUpdate({
      target: users.id,
      set: { email: currentUser.email, isPro: currentUser.isPro },
    })

  await db
    .insert(itemTypes)
    .values(
      mockItemTypes.map((type) => ({
        id: type.id,
        name: type.name,
        icon: type.icon,
        isSystem: true,
        userId: null,
      }))
    )
    .onConflictDoNothing()

  await db
    .insert(collections)
    .values(
      mockCollections.map((collection) => ({
        id: collection.id,
        name: collection.name,
        description: collection.description,
        isFavorite: collection.isFavorite,
        userId,
      }))
    )
    .onConflictDoUpdate({
      target: collections.id,
      set: { userId },
    })

  const fileTypeIds = new Set(["type_file", "type_image"])

  await db
    .insert(items)
    .values(
      mockItems.map((item) => ({
        id: item.id,
        title: item.title,
        contentType: fileTypeIds.has(item.typeId) ? "file" : "text",
        content: item.typeId === "type_url" ? null : item.content,
        url: item.typeId === "type_url" ? item.content : null,
        fileName: fileTypeIds.has(item.typeId) ? item.content : null,
        isFavorite: item.isFavorite,
        isPinned: item.isPinned,
        userId,
        typeId: item.typeId,
        collectionId: item.collectionId,
        createdAt: new Date(item.updatedAt),
        updatedAt: new Date(item.updatedAt),
      }))
    )
    .onConflictDoUpdate({
      target: items.id,
      set: { userId },
    })

  const uniqueTagNames = [...new Set(mockItems.flatMap((item) => item.tags))]
  const tagIdByName = new Map<string, string>(
    uniqueTagNames.map((name) => [name, `tag_${name}`])
  )

  await db
    .insert(tags)
    .values(
      uniqueTagNames.map((name) => ({
        id: tagIdByName.get(name)!,
        name,
        userId,
      }))
    )
    .onConflictDoNothing()

  await db
    .insert(itemTags)
    .values(
      mockItems.flatMap((item) =>
        item.tags.map((tagName) => ({
          itemId: item.id,
          tagId: tagIdByName.get(tagName)!,
        }))
      )
    )
    .onConflictDoNothing()

  console.log(
    `Done: ${mockItemTypes.length} item types, ${mockCollections.length} collections, ${mockItems.length} items, ${uniqueTagNames.length} tags.`
  )
}

seed()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
