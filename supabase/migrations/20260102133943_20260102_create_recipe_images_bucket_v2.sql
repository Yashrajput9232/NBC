/*
  # Create and configure recipe-images storage bucket
  
  Creates the storage bucket for recipe images if it doesn't exist,
  and sets up RLS policies to allow public read and write access.
  
  1. Storage Setup
    - Creates `recipe-images` bucket
    - Enables public access
    
  2. Policies
    - Public read access to all images
    - Public upload capability
    - Public delete capability
*/

INSERT INTO storage.buckets (id, name, public)
VALUES ('recipe-images', 'recipe-images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

DO $$
BEGIN
  DROP POLICY IF EXISTS "Public read access to recipe images" ON storage.objects;
  DROP POLICY IF EXISTS "Public upload to recipe images" ON storage.objects;
  DROP POLICY IF EXISTS "Public delete from recipe images" ON storage.objects;
  
  CREATE POLICY "Public read access to recipe images"
    ON storage.objects
    FOR SELECT
    USING (bucket_id = 'recipe-images');

  CREATE POLICY "Public upload to recipe images"
    ON storage.objects
    FOR INSERT
    WITH CHECK (bucket_id = 'recipe-images');

  CREATE POLICY "Public delete from recipe images"
    ON storage.objects
    FOR DELETE
    USING (bucket_id = 'recipe-images');
END $$;
