-- Fix profiles RLS to allow public viewing of profiles
-- This allows unauthenticated users to view poll creator information

-- Add policy to allow everyone to view profiles
CREATE POLICY "Public profiles are viewable by everyone" 
ON profiles 
FOR SELECT 
USING (true);

-- This policy is needed so that when anonymous users view a poll,
-- they can see the creator's profile information (name, avatar).
-- The existing policy only allowed users to view their own profile,
-- which blocked poll queries that join with the profiles table.
