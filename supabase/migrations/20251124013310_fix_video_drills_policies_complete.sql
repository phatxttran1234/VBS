/*
  # Fix video drills RLS policies completely

  1. Changes
    - Drop ALL existing video_drills policies to start clean
    - Create separate policies for SELECT, INSERT, UPDATE, DELETE operations
    - INSERT policy requires WITH CHECK clause (not USING)
    - UPDATE policy requires both USING and WITH CHECK
    - DELETE policy requires only USING clause
  
  2. Security
    - Only authenticated admin users can insert, update, or delete video drills
    - All authenticated users can view video drills
    - Policies check admin role via profiles table join
*/

-- Drop ALL existing policies on video_drills
DROP POLICY IF EXISTS "Video drills are readable by authenticated users" ON video_drills;
DROP POLICY IF EXISTS "Admins can manage video drills" ON video_drills;
DROP POLICY IF EXISTS "Admins can insert video drills" ON video_drills;
DROP POLICY IF EXISTS "Admins can update video drills" ON video_drills;
DROP POLICY IF EXISTS "Admins can delete video drills" ON video_drills;
DROP POLICY IF EXISTS "Authenticated users can insert video drills temporarily" ON video_drills;

-- Create SELECT policy (all authenticated users can view)
CREATE POLICY "Video drills are readable by authenticated users"
  ON video_drills
  FOR SELECT
  TO authenticated
  USING (true);

-- Create INSERT policy (only admins can insert)
CREATE POLICY "Admins can insert video drills"
  ON video_drills
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Create UPDATE policy (only admins can update)
CREATE POLICY "Admins can update video drills"
  ON video_drills
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Create DELETE policy (only admins can delete)
CREATE POLICY "Admins can delete video drills"
  ON video_drills
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );
