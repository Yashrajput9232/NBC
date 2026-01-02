/*
  # Fix storage bucket policies for recipe images
  
  The storage.objects table has RLS enabled but no policies were created,
  blocking all access. This migration adds the necessary policies to allow
  public read and write access to the recipe-images bucket.
*/

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
