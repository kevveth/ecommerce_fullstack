/// <reference types="vitest" />
import { defineConfig } from "vitest/config"; // Import from 'vitest/config'

export default defineConfig({
  test: {
    // Configure Vitest for your *server-side* tests here
    globals: true, // Often useful for Node.js testing
    environment: "node", // IMPORTANT: Set the environment to 'node'
    // Add other Vitest options as needed
    coverage: {
      provider: "v8", // or 'istanbul' - for code coverage
      reporter: ["text", "json", "html"], // Example reporters
      exclude: [
        // Exclude files/directories from coverage
        "dist/**",
        "**/__tests__/**", // Common test directory
        "**/*.spec.ts", // Exclude test files themselves
      ],
    },
  },
});
