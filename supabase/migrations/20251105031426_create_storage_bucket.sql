/*
  # Create storage bucket for recipe images
  
  1. Storage Setup
    - Create `recipe-images` bucket for storing recipe photos
    - Enable public access for bucket
    - Set up policies for image access
    
  2. Security
    - Allow public read access to images
    - Allow insert/update/delete for images (simplified for this app)
*/

INSERT INTO storage.buckets (id, name, public)
VALUES ('recipe-images', 'recipe-images', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public Access"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'recipe-images');

CREATE POLICY "Allow uploads"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'recipe-images');

CREATE POLICY "Allow delete"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'recipe-images');