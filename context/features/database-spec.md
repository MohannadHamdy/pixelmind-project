# Drizzle + Neon PostgreSQL Setup

## Overview

Set up Drizzle ORM with Neon PostgreSQL database.

## Requirements

- Use Neon PostgreSQL (serverless) via the `@neondatabase/serverless` driver with `drizzle-orm/neon-http` (or `neon-serverless` if you need transactions/sessions)
- Create initial schema based on the data models in project-overview.md (this will evolve)
- No Account/Session/VerificationToken models needed — Clerk manages auth and sessions itself. Instead, sync a minimal `users` table keyed by Clerk's user ID via Clerk webhooks (`user.created`, `user.updated`, `user.deleted`)
- Add appropriate indexes and cascade deletes

## References

- Initial data models: `@context/project-overview.md`
- Database standards: `@context/coding-standards.md`
- Drizzle ORM docs: https://orm.drizzle.team/docs/overview
- Drizzle + Neon guide: https://orm.drizzle.team/docs/connect-neon
- Clerk webhook user sync guide: https://clerk.com/docs/webhooks/sync-data

## Notes

We will have a development branch that we work on that will be in DATABASE_URL and then we will have a production branch. So we ALWAYS create migrations (`drizzle-kit generate`) and never push directly (`drizzle-kit push`) unless specified.

IMPORTANT! Clerk webhook delivery is not guaranteed and is eventually consistent — the sync handler must be idempotent (upsert on the Clerk user ID, not insert), and you should be able to tolerate a short delay between a user signing up in Clerk and their row existing in your `users` table.
