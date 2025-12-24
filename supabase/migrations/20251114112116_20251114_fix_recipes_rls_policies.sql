/*
  # Fix recipes RLS policies

  1. Security
    - Add public SELECT policy to allow reading all recipes
    - Add public INSERT policy to allow adding recipes
    - Add public UPDATE policy to allow updating recipes
    - Add public DELETE policy to allow deleting recipes
*/

CREATE POLICY "Enable read access for all users"
  ON recipes FOR SELECT
  USING (true);

CREATE POLICY "Enable insert for all users"
  ON recipes FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Enable update for all users"
  ON recipes FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Enable delete for all users"
  ON recipes FOR DELETE
  USING (true);