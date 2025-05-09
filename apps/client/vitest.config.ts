import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true, // Enable global test functions like 'describe' and 'it'
    environment: "jsdom", // Use 'jsdom' for React component tests
    setupFiles: "./tests/setup.ts", // Correct relative path to the setup file
    include: ["**/tests/**/*.test.tsx"], // Adjusted to match all test files in the tests directory
    coverage: {
      provider: "v8", // Use V8 for coverage
      reporter: ["text", "html"], // Generate text and HTML coverage reports
    },
  },
});
