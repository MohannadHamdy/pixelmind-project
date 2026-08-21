import { defineConfig } from "vitest/config"

export default defineConfig({
  resolve: {
    tsconfigPaths: true,
  },
  test: {
    environment: "node",
    include: ["actions/**/*.test.ts", "lib/**/*.test.ts"],
  },
})
