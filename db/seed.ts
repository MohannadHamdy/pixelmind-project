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
  collections as seedCollections,
  items as seedItems,
  itemTypes as seedItemTypes,
} from "./seed-data.ts"

const db = drizzle(process.env.DATABASE_URL!)

const DEFAULT_USER_ID = "user_3I8lPX3WJ8iOSGDRqs5lkCujWks"
const DEFAULT_USER_EMAIL = "moe@thecoachingmasters.com"

const userId = process.argv[2] ?? process.env.SEED_USER_ID ?? DEFAULT_USER_ID
const userEmail = process.env.SEED_USER_EMAIL ?? DEFAULT_USER_EMAIL

async function seed() {
  console.log(`Seeding data for user ${userId}...`)

  await db
    .insert(users)
    .values({ id: userId, email: userEmail })
    .onConflictDoUpdate({
      target: users.id,
      set: { email: userEmail },
    })

  await db
    .insert(itemTypes)
    .values(
      seedItemTypes.map((type) => ({
        id: type.id,
        name: type.name,
        icon: type.icon,
        color: type.color,
        isSystem: true,
        userId: null,
      }))
    )
    .onConflictDoUpdate({
      target: itemTypes.id,
      set: { isSystem: true, userId: null },
    })

  await db
    .insert(collections)
    .values(
      seedCollections.map((collection) => ({
        id: collection.id,
        name: collection.name,
        description: collection.description,
        userId,
      }))
    )
    .onConflictDoUpdate({
      target: collections.id,
      set: { userId },
    })

  await db
    .insert(items)
    .values(
      seedItems.map((item) => ({
        id: item.id,
        title: item.title,
        contentType: item.contentType,
        content: item.content,
        url: item.url,
        language: item.language,
        userId,
        typeId: item.typeId,
        collectionId: item.collectionId,
      }))
    )
    .onConflictDoUpdate({
      target: items.id,
      set: { userId },
    })

  const uniqueTagNames = [...new Set(seedItems.flatMap((item) => item.tags))]
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
      seedItems.flatMap((item) =>
        item.tags.map((tagName) => ({
          itemId: item.id,
          tagId: tagIdByName.get(tagName)!,
        }))
      )
    )
    .onConflictDoNothing()

  console.log(
    `Done: ${seedItemTypes.length} item types, ${seedCollections.length} collections, ${seedItems.length} items, ${uniqueTagNames.length} tags.`
  )
}

seed()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
