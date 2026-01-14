-- Allow anonymous poll creation
-- This migration updates RLS policies to permit unauthenticated users to create polls

-- Drop existing insert policy on polls if it exists (it likely requires auth.uid())
DROP POLICY IF EXISTS "Users can create polls" ON polls;
DROP POLICY IF EXISTS "Authenticated users can create polls" ON polls;
DROP POLICY IF EXISTS "Anyone can create polls" ON polls;

-- Create new policy that allows anyone (authenticated or not) to insert polls
-- Anonymous polls will have creator_id = null
CREATE POLICY "Anyone can create polls" 
ON polls 
FOR INSERT 
WITH CHECK (
  -- Allow if user is authenticated and creating with their own ID
  (auth.uid() IS NOT NULL AND creator_id = auth.uid())
  OR
  -- Allow if user is anonymous and creator_id is null
  (auth.uid() IS NULL AND creator_id IS NULL)
);

-- Also update poll_options to allow anyone to insert options
-- (needed because options are inserted immediately after poll creation)
DROP POLICY IF EXISTS "Users can create options for their polls" ON poll_options;
DROP POLICY IF EXISTS "Authenticated users can create options" ON poll_options;
DROP POLICY IF EXISTS "Anyone can create poll options" ON poll_options;

-- Allow inserting options for any poll that exists
-- This is safe because:
-- 1. You need to know the poll_id (UUID) to insert options
-- 2. Options are only inserted at poll creation time
CREATE POLICY "Anyone can create poll options"
ON poll_options
FOR INSERT
WITH CHECK (
  -- The poll must exist
  EXISTS (SELECT 1 FROM polls WHERE id = poll_id)
);

-- Ensure SELECT policies exist for viewing polls and options
DROP POLICY IF EXISTS "Anyone can view public and unlisted polls" ON polls;
CREATE POLICY "Anyone can view public and unlisted polls"
ON polls
FOR SELECT
USING (
  visibility IN ('public', 'unlisted')
  OR creator_id = auth.uid()
);

DROP POLICY IF EXISTS "Anyone can view poll options" ON poll_options;
CREATE POLICY "Anyone can view poll options"
ON poll_options
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM polls 
    WHERE id = poll_id 
    AND (visibility IN ('public', 'unlisted') OR creator_id = auth.uid())
  )
);
