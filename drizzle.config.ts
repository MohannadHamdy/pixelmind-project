import { existsSync } from "fs"
import { defineConfig } from "drizzle-kit"

if (existsSync(".env.local")) {
  process.loadEnvFile(".env.local")
}

export default defineConfig({
  out: "./drizzle",
  schema: "./db/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
})
