-- Rename columns in users table to use camelCase
ALTER TABLE users 
  RENAME COLUMN is_approved TO "isApproved",
  RENAME COLUMN created_at TO "createdAt",
  RENAME COLUMN updated_at TO "updatedAt";
