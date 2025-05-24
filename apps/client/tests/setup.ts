import { expect, afterEach } from "vitest";
import { cleanup } from "@testing-library/react";
import { JSDOM } from "jsdom";

// Automatically clean up the DOM after each test to prevent test interference
afterEach(() => {
  cleanup();
});

// Set up a global jsdom environment
const dom = new JSDOM("<html><body></body></html>", {
  url: "http://localhost",
});
global.document = dom.window.document;
global.window = dom.window;
global.navigator = dom.window.navigator;

console.log("Setup file loaded successfully");

// Extend Vitest's expect with additional matchers if needed
expect.extend({});
