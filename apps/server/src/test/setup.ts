/**
 * Setup file for Vitest tests
 * This file is loaded before any tests run as specified in vitest.config.ts
 */

// Set environment variables for testing
process.env.NODE_ENV = "test";
process.env.JWT_SECRET = "test_jwt_secret_for_testing_purposes_only";
process.env.JWT_REFRESH_SECRET =
  "test_jwt_refresh_secret_for_testing_purposes_only";
process.env.DB_DATABASE = "ecommerce_test";
