/**
 * Minimal test for AuthContext.tsx
 * This test verifies that the AuthContext provides default values.
 */
import React from "react";
import { renderHook } from "@testing-library/react";
import { AuthProvider, useAuth } from "../src/context/AuthContext";
import { describe, it, expect } from "vitest";
import { MemoryRouter } from "react-router";
import { JSDOM } from "jsdom";

// Initialize jsdom environment
const dom = new JSDOM("<html><body></body></html>", {
  url: "http://localhost",
});
global.document = dom.window.document;
global.window = dom.window;
Object.defineProperty(global, "navigator", {
  value: dom.window.navigator,
  configurable: true,
});

/**
 * Test suite for AuthContext
 */
describe("AuthContext", () => {
  it("should provide default values", () => {
    // Render the hook within the AuthProvider context wrapped in a MemoryRouter
    const { result } = renderHook(() => useAuth(), {
      wrapper: ({ children }) => (
        <MemoryRouter>
          <AuthProvider>{children}</AuthProvider>
        </MemoryRouter>
      ),
    });

    // Debug statement to log the type of the document object
    console.log("Document object:", typeof document);

    // Assert default values
    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
  });
});
