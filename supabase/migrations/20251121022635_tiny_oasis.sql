/*
  # Initial VBS Database Schema

  1. New Tables
    - `profiles`
      - `id` (uuid, primary key, references auth.users)
      - `email` (text)
      - `full_name` (text)
      - `role` (text) - 'player' or 'admin'
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `categories`
      - `id` (uuid, primary key)
      - `name` (text)
      - `description` (text)
      - `created_at` (timestamp)
    
    - `vocabulary_terms`
      - `id` (uuid, primary key)
      - `term` (text)
      - `definition` (text)
      - `category_id` (uuid, foreign key)
      - `difficulty_level` (integer, 1-5)
      - `created_at` (timestamp)
    
    - `video_drills`
      - `id` (uuid, primary key)
      - `title` (text)
      - `description` (text)
      - `video_url` (text)
      - `thumbnail_url` (text)
      - `category_id` (uuid, foreign key)
      - `duration` (integer, seconds)
      - `difficulty_level` (integer, 1-5)
      - `created_at` (timestamp)
    
    - `user_progress`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key)
      - `vocabulary_term_id` (uuid, foreign key)
      - `mastery_level` (integer, 0-100)
      - `last_reviewed` (timestamp)
      - `review_count` (integer)
      - `correct_answers` (integer)
      - `total_attempts` (integer)
    
    - `test_sessions`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key)
      - `score` (integer)
      - `total_questions` (integer)
      - `completed_at` (timestamp)
      - `duration` (integer, seconds)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
    - Profiles are readable by authenticated users
    - Users can only modify their own progress
    - Admins can manage vocabulary and videos
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  full_name text DEFAULT '',
  role text DEFAULT 'player' CHECK (role IN ('player', 'admin')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  description text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

-- Create vocabulary_terms table
CREATE TABLE IF NOT EXISTS vocabulary_terms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  term text NOT NULL,
  definition text NOT NULL,
  category_id uuid REFERENCES categories(id) ON DELETE SET NULL,
  difficulty_level integer DEFAULT 1 CHECK (difficulty_level BETWEEN 1 AND 5),
  created_at timestamptz DEFAULT now()
);

-- Create video_drills table
CREATE TABLE IF NOT EXISTS video_drills (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text DEFAULT '',
  video_url text NOT NULL,
  thumbnail_url text DEFAULT '',
  category_id uuid REFERENCES categories(id) ON DELETE SET NULL,
  duration integer DEFAULT 0,
  difficulty_level integer DEFAULT 1 CHECK (difficulty_level BETWEEN 1 AND 5),
  created_at timestamptz DEFAULT now()
);

-- Create user_progress table
CREATE TABLE IF NOT EXISTS user_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  vocabulary_term_id uuid REFERENCES vocabulary_terms(id) ON DELETE CASCADE,
  mastery_level integer DEFAULT 0 CHECK (mastery_level BETWEEN 0 AND 100),
  last_reviewed timestamptz DEFAULT now(),
  review_count integer DEFAULT 0,
  correct_answers integer DEFAULT 0,
  total_attempts integer DEFAULT 0,
  UNIQUE(user_id, vocabulary_term_id)
);

-- Create test_sessions table
CREATE TABLE IF NOT EXISTS test_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  score integer DEFAULT 0,
  total_questions integer DEFAULT 0,
  completed_at timestamptz DEFAULT now(),
  duration integer DEFAULT 0
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE vocabulary_terms ENABLE ROW LEVEL SECURITY;
ALTER TABLE video_drills ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE test_sessions ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can read all profiles"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Categories policies (readable by all, manageable by admins)
CREATE POLICY "Categories are readable by authenticated users"
  ON categories
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage categories"
  ON categories
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Vocabulary terms policies
CREATE POLICY "Vocabulary terms are readable by authenticated users"
  ON vocabulary_terms
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage vocabulary terms"
  ON vocabulary_terms
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Video drills policies
CREATE POLICY "Video drills are readable by authenticated users"
  ON video_drills
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage video drills"
  ON video_drills
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- User progress policies
CREATE POLICY "Users can read own progress"
  ON user_progress
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own progress"
  ON user_progress
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

-- Test sessions policies
CREATE POLICY "Users can read own test sessions"
  ON test_sessions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own test sessions"
  ON test_sessions
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_vocabulary_terms_category ON vocabulary_terms(category_id);
CREATE INDEX IF NOT EXISTS idx_video_drills_category ON video_drills(category_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_user ON user_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_term ON user_progress(vocabulary_term_id);
CREATE INDEX IF NOT EXISTS idx_test_sessions_user ON test_sessions(user_id);

-- Insert default categories
INSERT INTO categories (name, description) VALUES
  ('Basic Terms', 'Fundamental volleyball terminology'),
  ('Positions', 'Player positions and roles'),
  ('Techniques', 'Playing techniques and skills'),
  ('Rules', 'Game rules and regulations'),
  ('Equipment', 'Volleyball equipment and gear')
ON CONFLICT (name) DO NOTHING;

-- Insert sample vocabulary terms
INSERT INTO vocabulary_terms (term, definition, category_id, difficulty_level) VALUES
  ('Spike', 'An aggressive attacking shot hit downward into the opponent''s court', (SELECT id FROM categories WHERE name = 'Techniques'), 2),
  ('Set', 'A ball handling skill used to position the ball for an attack', (SELECT id FROM categories WHERE name = 'Techniques'), 1),
  ('Dig', 'A defensive move to prevent the ball from hitting the court after an attack', (SELECT id FROM categories WHERE name = 'Techniques'), 2),
  ('Libero', 'A specialized defensive player who cannot attack above net height', (SELECT id FROM categories WHERE name = 'Positions'), 3),
  ('Rotation', 'The clockwise movement of players around the court', (SELECT id FROM categories WHERE name = 'Rules'), 2),
  ('Ace', 'A serve that results directly in a point', (SELECT id FROM categories WHERE name = 'Basic Terms'), 1),
  ('Block', 'A defensive play at the net to deflect an attack', (SELECT id FROM categories WHERE name = 'Techniques'), 2),
  ('Bump', 'A pass made with the forearms', (SELECT id FROM categories WHERE name = 'Basic Terms'), 1),
  ('Kill', 'An attack that results in an immediate point', (SELECT id FROM categories WHERE name = 'Basic Terms'), 1),
  ('Side Out', 'When the receiving team wins the right to serve', (SELECT id FROM categories WHERE name = 'Rules'), 2)
ON CONFLICT DO NOTHING;