/*
  # Add source link to recipes table

  1. Modified Tables
    - `recipes` table
      - Added `source_link` column (optional text field for recipe source links)
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'recipes' AND column_name = 'source_link'
  ) THEN
    ALTER TABLE recipes ADD COLUMN source_link text;
  END IF;
END $$;