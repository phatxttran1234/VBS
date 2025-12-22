/*
  # Auto-create profiles on user signup

  1. Changes
    - Create a function to automatically create a profile when a user signs up
    - Create a trigger that calls this function on auth.users insert
    - This ensures every authenticated user has a profile record

  2. Security
    - Profile is automatically created with user's email and metadata
    - Default role is 'player'
    - Full name is taken from user metadata if provided
*/

-- Create function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    'player'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically create profile on signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
