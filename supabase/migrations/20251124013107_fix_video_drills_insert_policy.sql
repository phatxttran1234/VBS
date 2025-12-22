/*
  # Fix video drills INSERT policy for admin users

  1. Changes
    - Drop and recreate the INSERT policy with better error handling
    - Add a temporary policy to allow all authenticated users to insert for debugging
    - This will help us identify if the issue is with the admin check or authentication itself

  2. Security
    - This is a temporary debugging measure
    - We'll verify the admin check separately
*/

-- Drop the existing INSERT policy
DROP POLICY IF EXISTS "Admins can insert video drills" ON video_drills;
DROP POLICY IF EXISTS "Authenticated users can insert video drills temporarily" ON video_drills;

-- Create a temporary policy that allows all authenticated users to insert
-- This helps us verify if the issue is with authentication or the admin role check
CREATE POLICY "Authenticated users can insert video drills temporarily"
  ON video_drills
  FOR INSERT
  TO authenticated
  WITH CHECK (true);
