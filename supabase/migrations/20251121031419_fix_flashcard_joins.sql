/*
  # Fix flashcard vocabulary joins

  1. Changes
    - Split the ALL policy into separate SELECT, INSERT, UPDATE, DELETE policies
    - This ensures flashcard queries can properly join with vocabulary_terms and categories
    
  2. Security
    - Users can only access their own flashcards
    - All operations (SELECT, INSERT, UPDATE, DELETE) remain restricted to the flashcard owner
*/

-- Drop the existing ALL policy
DROP POLICY IF EXISTS "Users can manage own flashcards" ON user_flashcards;

-- Create separate policies for each operation
CREATE POLICY "Users can view own flashcards"
  ON user_flashcards
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own flashcards"
  ON user_flashcards
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own flashcards"
  ON user_flashcards
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own flashcards"
  ON user_flashcards
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);
