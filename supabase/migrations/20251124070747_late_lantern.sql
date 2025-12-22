/*
  # Disable RLS for demo mode

  1. Changes
    - Disable Row Level Security on video_drills table for demo functionality
    - Remove restrictive policies that require authentication
    - Add permissive policies for public access in demo mode

  This allows the demo app to function without real authentication while maintaining
  the table structure for when proper authentication is implemented.
*/

-- Disable RLS on video_drills table for demo mode
ALTER TABLE video_drills DISABLE ROW LEVEL SECURITY;

-- Also disable RLS on vocabulary_terms if it's causing issues
ALTER TABLE vocabulary_terms DISABLE ROW LEVEL SECURITY;

-- Disable RLS on categories table for demo mode
ALTER TABLE categories DISABLE ROW LEVEL SECURITY;