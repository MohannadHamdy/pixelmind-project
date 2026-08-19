# Current Feature

## Status

In Progress

## Goals

Drizzle + Neon PostgreSQL Setup:

- Set up Drizzle ORM with Neon PostgreSQL via `@neondatabase/serverless` + `drizzle-orm/neon-http`
- Create initial schema based on the data models in project-overview.md
- Sync a minimal `users` table via Clerk webhooks (idempotent upsert, no Account/Session models)
- Add appropriate indexes and cascade deletes

See @context/features/database-spec.md for full spec.

## Notes

<!-- Any extra notes -->

## History

<!-- Keep this updated. Earliest to latest -->

- Project setup and boilerplate cleanup
- Dashboard UI Phase 1: route, layout, top bar, placeholders
- Dashboard UI Phase 2: collapsible Shadcn sidebar (collections, types, tags as collapsible groups), user avatar footer, mobile drawer
- Dashboard UI Phase 3: recent collections, pinned items, recent items, stats cards (mock data)
