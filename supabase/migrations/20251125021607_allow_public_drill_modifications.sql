/*
  # Allow Public Modification Access to Drills

  1. Changes
    - Update UPDATE policy to allow anonymous users (for demo admin)
    - Update DELETE policy to allow anonymous users (for demo admin)
  
  2. Security
    - Full CRUD access for demo purposes
    - In production, these should require authentication and admin role
*/

-- Drop the existing authenticated-only policies
DROP POLICY IF EXISTS "Admins can update drills" ON drills;
DROP POLICY IF EXISTS "Admins can delete drills" ON drills;

-- Create new policies that allow anyone to modify drills (for demo purposes)
CREATE POLICY "Anyone can update drills"
  ON drills
  FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anyone can delete drills"
  ON drills
  FOR DELETE
  TO public
  USING (true);
