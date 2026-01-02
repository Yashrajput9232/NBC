/*
  # Fix recipes insert policy
  
  Update the insert policy to allow unauthenticated users to create recipes
  since the application doesn't have authentication enabled.
*/

DROP POLICY IF EXISTS "Authenticated users can create recipes" ON recipes;

CREATE POLICY "Anyone can create recipes"
  ON recipes
  FOR INSERT
  TO public
  WITH CHECK (true);
