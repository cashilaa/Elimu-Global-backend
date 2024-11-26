-- Drop existing policies
DROP POLICY IF EXISTS "Users can view their own data" ON users;
DROP POLICY IF EXISTS "Users can update their own data" ON users;

-- Create new policies for users table
CREATE POLICY "Enable insert for authentication" ON users
    FOR INSERT WITH CHECK (true);  -- Allows new user creation

CREATE POLICY "Users can view their own data and public profiles" ON users
    FOR SELECT USING (
        auth.uid() = id OR  -- Can view own data
        role = 'instructor' -- Can view instructor profiles
    );

CREATE POLICY "Users can update their own data" ON users
    FOR UPDATE USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- Add policy for admin users
CREATE POLICY "Admins have full access" ON users
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.role = 'admin'
        )
    );
