import { describe, test, expect, beforeAll, afterAll } from 'vitest';
import { User } from '../types/user';
import users from '../models/users';

describe("User Operations", () => {
    test("Get a user by ID ", async () => {
        const response = await users.get(3);
        console.log(response.rows)
        const user: User = response.rows[0]

        expect(user).toBeDefined();
    }),

    test("Get a user by username", async () => {
        const response = await users.get("testuser");
        const user: User = response.rows[0]

        expect(user).toBeDefined();
    })
})