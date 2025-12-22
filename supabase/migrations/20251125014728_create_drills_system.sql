/*
  # Create Drills System

  1. New Tables
    - `drills`
      - `id` (uuid, primary key)
      - `title` (text, not null) - Drill name/title
      - `age_group` (text, not null) - U12, U14, U16, or U18
      - `category` (text, not null) - e.g., "Warm-up", "Passing", "Spiking", "Setting", "Serving", "Agility"
      - `description` (text, not null) - Full drill description
      - `duration` (text, optional) - e.g., "30 minutes", "15 min"
      - `setup` (text, optional) - Setup instructions
      - `execution` (text, optional) - Execution steps
      - `coaching_tips` (text, optional) - Coaching tips
      - `reps` (text, optional) - Recommended reps/sets
      - `order_index` (integer, default 0) - For ordering drills within category
      - `created_at` (timestamptz, default now())
      - `updated_at` (timestamptz, default now())
      - `created_by` (uuid, references profiles.id)

  2. Security
    - Enable RLS on `drills` table
    - Add policy for all authenticated users to read drills
    - Add policy for admins to insert, update, and delete drills

  3. Indexes
    - Index on age_group for faster filtering
    - Index on category for faster filtering
    - Index on created_by for admin queries
*/

CREATE TABLE IF NOT EXISTS drills (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  age_group text NOT NULL CHECK (age_group IN ('U12', 'U14', 'U16', 'U18')),
  category text NOT NULL,
  description text NOT NULL,
  duration text,
  setup text,
  execution text,
  coaching_tips text,
  reps text,
  order_index integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES profiles(id)
);

ALTER TABLE drills ENABLE ROW LEVEL SECURITY;

CREATE POLICY "All authenticated users can view drills"
  ON drills
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can insert drills"
  ON drills
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can update drills"
  ON drills
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

CREATE POLICY "Admins can delete drills"
  ON drills
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE INDEX IF NOT EXISTS idx_drills_age_group ON drills(age_group);
CREATE INDEX IF NOT EXISTS idx_drills_category ON drills(category);
CREATE INDEX IF NOT EXISTS idx_drills_created_by ON drills(created_by);