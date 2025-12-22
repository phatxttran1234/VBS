/*
  # Add example field to vocabulary_terms table

  1. Changes
    - Add `example` column (text, nullable) to `vocabulary_terms` table
    - This will store example usage sentences for each vocabulary term
  
  2. Notes
    - Making it nullable so existing records don't break
    - Default value is NULL for existing records
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'vocabulary_terms' AND column_name = 'example'
  ) THEN
    ALTER TABLE vocabulary_terms ADD COLUMN example text;
  END IF;
END $$;