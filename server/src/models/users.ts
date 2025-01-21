import { pool } from '../../database/db/database';
import { QueryResult } from 'pg';
import { User } from '../types/user';

// Overload function definitions for getting a user by ID or username
function get(id: number): Promise<QueryResult>; // Function signature for getting a user by ID
function get(username: string): Promise<QueryResult>; // Function signature for getting a user by username
function get(identifier: number | string): Promise<QueryResult> { // Implementation of the overloaded get function
    // Determine the query based on the type of identifier
    const query = typeof identifier === 'number' ?
        "SELECT * FROM users WHERE user_id = $1" : // SQL query to select a user by ID
        "SELECT * FROM users WHERE username = $1"; // SQL query to select a user by username

    // Execute the query with the provided identifier
    return pool.query(query, [identifier]);
}

// users object containing the get function
const users = {
    get // The get function
}

// Export the users object as the default export
export default users;
