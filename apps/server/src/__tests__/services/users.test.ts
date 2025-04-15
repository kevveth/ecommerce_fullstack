import { describe, it, expect, vi, beforeEach } from "vitest";
import { getWithEmail, getWithUsername } from "../../services/users";
import * as db from "../../database/database";

// Mock the database
vi.mock("../../database/database", () => ({
  query: vi.fn(),
}));

describe("User Service", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  describe("getWithEmail", () => {
    it("should return a user when found by email", async () => {
      // Arrange
      const mockUser = {
        user_id: 1,
        username: "testuser",
        email: "test@example.com",
        password_hash: "hashed_password",
        role: "user",
      };

      vi.mocked(db.query).mockResolvedValueOnce({
        rows: [mockUser],
        rowCount: 1,
      } as any);

      // Act
      const result = await getWithEmail("test@example.com");

      // Assert
      expect(db.query).toHaveBeenCalledWith(expect.stringContaining("SELECT"), [
        "test@example.com",
      ]);
      expect(result).toEqual(mockUser);
    });

    it("should return null when user is not found", async () => {
      // Arrange
      vi.mocked(db.query).mockResolvedValueOnce({
        rows: [],
        rowCount: 0,
      } as any);

      // Act
      const result = await getWithEmail("nonexistent@example.com");

      // Assert
      expect(db.query).toHaveBeenCalledWith(expect.stringContaining("SELECT"), [
        "nonexistent@example.com",
      ]);
      expect(result).toBeNull();
    });
  });

  describe("getWithUsername", () => {
    it("should return a user when found by username", async () => {
      // Arrange
      const mockUser = {
        user_id: 1,
        username: "testuser",
        email: "test@example.com",
      };

      vi.mocked(db.query).mockResolvedValueOnce({
        rows: [mockUser],
        rowCount: 1,
      } as any);

      // Act
      const result = await getWithUsername("testuser");

      // Assert
      expect(db.query).toHaveBeenCalledWith(expect.stringContaining("SELECT"), [
        "testuser",
      ]);
      expect(result).toEqual(mockUser);
    });
  });
});
