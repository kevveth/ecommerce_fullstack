import { describe, test, expect, vi } from "vitest";
import { User } from "../models/user.model";
import { getWithId } from "../services/users";

const testUser: User = {
  user_id: 3,
  username: "testuser",
  email: "testuser@example.com",
  password_hash: "hashed_password",
  street_address: "789 Pine Ln",
  city: "Anytown",
  state: "CA",
  zip_code: "54321",
  country: "USA",
  role: "user",
};

describe("User Queries", () => {
  test("Get a user by ID ", async () => {
    const response = await getWithId(3);
    expect(response.user_id).toEqual(testUser.user_id);
  });
});
