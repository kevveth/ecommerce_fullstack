-- Add google_id column to users table
ALTER TABLE users ADD COLUMN google_id VARCHAR(255) UNIQUE;

-- Make password_hash nullable to support OAuth users
ALTER TABLE users ALTER COLUMN password_hash DROP NOT NULL;