-- Update the users table schema
ALTER TABLE users 
  ADD COLUMN IF NOT EXISTS "firstName" TEXT,
  ADD COLUMN IF NOT EXISTS "lastName" TEXT,
  ADD COLUMN IF NOT EXISTS "isApproved" BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS "role" TEXT DEFAULT 'STUDENT',
  ADD COLUMN IF NOT EXISTS "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  ADD COLUMN IF NOT EXISTS "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP;

-- Create a trigger to automatically update the updatedAt timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW."updatedAt" = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
