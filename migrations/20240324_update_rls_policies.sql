-- Temporarily disable RLS to allow schema modifications
ALTER TABLE users DISABLE ROW LEVEL SECURITY;

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

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Users can view their own data" ON users;
DROP POLICY IF EXISTS "Users can insert their own data" ON users;
DROP POLICY IF EXISTS "Users can update their own data" ON users;
DROP POLICY IF EXISTS "Admins can view all data" ON users;
DROP POLICY IF EXISTS "Service role can manage all data" ON users;

-- Create RLS policies
CREATE POLICY "Users can view their own data" 
  ON users
  FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own data" 
  ON users
  FOR INSERT 
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own data" 
  ON users
  FOR UPDATE 
  USING (auth.uid() = id);

CREATE POLICY "Admins can view all data" 
  ON users
  FOR SELECT 
  USING (auth.jwt() ->> 'role' = 'ADMIN');

CREATE POLICY "Service role can manage all data" 
  ON users
  USING (auth.jwt() ->> 'role' = 'service_role');

-- Grant necessary permissions
GRANT ALL ON users TO service_role;
GRANT ALL ON users TO postgres;
