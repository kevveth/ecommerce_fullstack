/// <reference types="vitest" />
import { defineConfig } from "vitest/config"; // Import from 'vitest/config'

export default defineConfig({
  test: {
    globals: true, // Enable global test functions like 'describe' and 'it'
    environment: "node", // Use 'node' for server-side tests
    setupFiles: ["./test/setup.ts"], // Ensure the setup file is correctly linked
    coverage: {
      provider: "v8", // or 'istanbul' - for code coverage
      reporter: ["text", "json", "html"], // Example reporters
      exclude: ["dist/**", "**/__tests__/**", "**/*.spec.ts"],
    },
    testTimeout: 10000, // Increase timeout for API tests
  },
});
