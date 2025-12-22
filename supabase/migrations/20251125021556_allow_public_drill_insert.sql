/*
  # Allow Public Insert Access to Drills

  1. Changes
    - Update INSERT policy to allow anonymous users (for demo admin)
    - Keep UPDATE and DELETE restricted to authenticated admins
  
  2. Security
    - Anyone can insert drills (for demo purposes)
    - Admin operations (update/delete) still require authentication
*/

-- Drop the existing authenticated-only INSERT policy
DROP POLICY IF EXISTS "Admins can insert drills" ON drills;

-- Create new policy that allows anyone to insert drills (for demo purposes)
CREATE POLICY "Anyone can insert drills"
  ON drills
  FOR INSERT
  TO public
  WITH CHECK (true);
