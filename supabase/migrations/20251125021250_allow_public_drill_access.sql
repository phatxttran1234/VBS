/*
  # Allow Public Access to Drills

  1. Changes
    - Add policy to allow anonymous users to view drills
    - This enables the demo app to show drills without requiring Supabase authentication
  
  2. Security
    - Read-only access for anonymous users
    - Admin operations still require authentication and admin role
*/

-- Drop the existing authenticated-only policy
DROP POLICY IF EXISTS "All authenticated users can view drills" ON drills;

-- Create new policy that allows both authenticated and anonymous users to view drills
CREATE POLICY "Anyone can view drills"
  ON drills
  FOR SELECT
  TO public
  USING (true);
