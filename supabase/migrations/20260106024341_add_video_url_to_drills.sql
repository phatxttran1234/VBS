/*
  # Add Video URL to Drills

  1. Changes
    - Add `video_url` column to `drills` table to store YouTube/video links
    - This allows drills to have optional video demonstrations
  
  2. Notes
    - Column is optional (nullable) since not all drills need videos
    - Supports YouTube, Instagram, and TikTok URLs
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'drills' AND column_name = 'video_url'
  ) THEN
    ALTER TABLE drills ADD COLUMN video_url text;
  END IF;
END $$;
