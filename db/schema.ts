import {
  pgTable,
  text,
  boolean,
  integer,
  timestamp,
  primaryKey,
  index,
} from "drizzle-orm/pg-core"
import { relations } from "drizzle-orm"
import { createId } from "@paralleldrive/cuid2"

export const users = pgTable("user", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  isPro: boolean("is_pro").notNull().default(false),
  stripeCustomerId: text("stripe_customer_id"),
  stripeSubscriptionId: text("stripe_subscription_id"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
})

export const itemTypes = pgTable(
  "item_type",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => createId()),
    name: text("name").notNull(),
    icon: text("icon"),
    color: text("color"),
    isSystem: boolean("is_system").notNull().default(false),
    userId: text("user_id").references(() => users.id, {
      onDelete: "cascade",
    }),
  },
  (table) => [index("item_type_user_id_idx").on(table.userId)]
)

export const collections = pgTable(
  "collection",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => createId()),
    name: text("name").notNull(),
    description: text("description"),
    isFavorite: boolean("is_favorite").notNull().default(false),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at")
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [index("collection_user_id_idx").on(table.userId)]
)

export const items = pgTable(
  "item",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => createId()),
    title: text("title").notNull(),
    contentType: text("content_type").notNull(), // "text" | "file"
    content: text("content"),
    fileUrl: text("file_url"),
    fileName: text("file_name"),
    fileSize: integer("file_size"),
    url: text("url"),
    description: text("description"),
    isFavorite: boolean("is_favorite").notNull().default(false),
    isPinned: boolean("is_pinned").notNull().default(false),
    language: text("language"),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    typeId: text("type_id")
      .notNull()
      .references(() => itemTypes.id, { onDelete: "cascade" }),
    collectionId: text("collection_id").references(() => collections.id, {
      onDelete: "set null",
    }),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at")
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    index("item_user_id_idx").on(table.userId),
    index("item_type_id_idx").on(table.typeId),
    index("item_collection_id_idx").on(table.collectionId),
  ]
)

export const tags = pgTable(
  "tag",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => createId()),
    name: text("name").notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
  },
  (table) => [index("tag_user_id_idx").on(table.userId)]
)

export const itemTags = pgTable(
  "item_tag",
  {
    itemId: text("item_id")
      .notNull()
      .references(() => items.id, { onDelete: "cascade" }),
    tagId: text("tag_id")
      .notNull()
      .references(() => tags.id, { onDelete: "cascade" }),
  },
  (table) => [
    primaryKey({ columns: [table.itemId, table.tagId] }),
    index("item_tag_tag_id_idx").on(table.tagId),
  ]
)

// --- Relations ---

export const usersRelations = relations(users, ({ many }) => ({
  items: many(items),
  itemTypes: many(itemTypes),
  collections: many(collections),
  tags: many(tags),
}))

export const itemsRelations = relations(items, ({ one, many }) => ({
  user: one(users, { fields: [items.userId], references: [users.id] }),
  type: one(itemTypes, {
    fields: [items.typeId],
    references: [itemTypes.id],
  }),
  collection: one(collections, {
    fields: [items.collectionId],
    references: [collections.id],
  }),
  tags: many(itemTags),
}))

export const itemTypesRelations = relations(itemTypes, ({ one, many }) => ({
  user: one(users, { fields: [itemTypes.userId], references: [users.id] }),
  items: many(items),
}))

export const collectionsRelations = relations(collections, ({ one, many }) => ({
  user: one(users, { fields: [collections.userId], references: [users.id] }),
  items: many(items),
}))

export const tagsRelations = relations(tags, ({ one, many }) => ({
  user: one(users, { fields: [tags.userId], references: [users.id] }),
  items: many(itemTags),
}))

export const itemTagsRelations = relations(itemTags, ({ one }) => ({
  item: one(items, { fields: [itemTags.itemId], references: [items.id] }),
  tag: one(tags, { fields: [itemTags.tagId], references: [tags.id] }),
}))
