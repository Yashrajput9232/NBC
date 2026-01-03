/*
  # Fix recipes table RLS policies for public access
  
  Removes all conflicting policies and creates clean public access policies
  for all operations (SELECT, INSERT, UPDATE, DELETE).
  
  1. Removed Policies
    - All authenticated user policies
    - All conflicting public policies
    
  2. New Policies
    - Public SELECT access
    - Public INSERT access
    - Public UPDATE access
    - Public DELETE access
*/

DO $$
BEGIN
  DROP POLICY IF EXISTS "Authenticated users can create recipes" ON recipes;
  DROP POLICY IF EXISTS "Users can update their own recipes" ON recipes;
  DROP POLICY IF EXISTS "Users can delete their own recipes" ON recipes;
  DROP POLICY IF EXISTS "Anyone can read recipes" ON recipes;
  DROP POLICY IF EXISTS "Anyone can create recipes" ON recipes;
  DROP POLICY IF EXISTS "Enable read access for all users" ON recipes;
  DROP POLICY IF EXISTS "Enable insert for all users" ON recipes;
  DROP POLICY IF EXISTS "Enable update for all users" ON recipes;
  DROP POLICY IF EXISTS "Enable delete for all users" ON recipes;
  
  CREATE POLICY "recipes_public_select"
    ON recipes FOR SELECT
    TO public
    USING (true);

  CREATE POLICY "recipes_public_insert"
    ON recipes FOR INSERT
    TO public
    WITH CHECK (true);

  CREATE POLICY "recipes_public_update"
    ON recipes FOR UPDATE
    TO public
    USING (true)
    WITH CHECK (true);

  CREATE POLICY "recipes_public_delete"
    ON recipes FOR DELETE
    TO public
    USING (true);
END $$;
