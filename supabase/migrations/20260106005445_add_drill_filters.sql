/*
  # Add Drill Filter Fields

  1. Changes
    - Add `difficulty` column to drills table (Beginner, Intermediate, Advanced)
    - Add `equipment` column to drills table (text field for equipment list)
    - Set default values for existing drills
  
  2. Notes
    - Existing drills will default to 'Intermediate' difficulty
    - Equipment field defaults to 'Basic volleyball equipment'
*/

-- Add difficulty column
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'drills' AND column_name = 'difficulty'
  ) THEN
    ALTER TABLE drills ADD COLUMN difficulty text DEFAULT 'Intermediate';
  END IF;
END $$;

-- Add equipment column
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'drills' AND column_name = 'equipment'
  ) THEN
    ALTER TABLE drills ADD COLUMN equipment text DEFAULT 'Basic volleyball equipment';
  END IF;
END $$;

-- Update existing drills with appropriate difficulty based on age group
UPDATE drills SET difficulty = 'Beginner' WHERE age_group = 'U12' AND difficulty = 'Intermediate';
UPDATE drills SET difficulty = 'Advanced' WHERE age_group = 'U18' AND difficulty = 'Intermediate';