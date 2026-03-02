-- Correction et vérification des buckets storage
-- Script pour s'assurer que tous les buckets nécessaires existent avec les bonnes politiques

-- Vérifier et créer les buckets s'ils n'existent pas
DO $$
BEGIN
  -- Créer event-images si inexistant
  IF NOT EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'event-images') THEN
    INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
    VALUES (
      'event-images',
      'event-images',
      true,
      52428800,
      ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
    );
  END IF;

  -- Créer team-photos si inexistant
  IF NOT EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'team-photos') THEN
    INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
    VALUES (
      'team-photos',
      'team-photos',
      true,
      52428800,
      ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
    );
  END IF;

  -- Créer blog-images si inexistant
  IF NOT EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'blog-images') THEN
    INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
    VALUES (
      'blog-images',
      'blog-images',
      true,
      52428800,
      ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
    );
  END IF;
END $$;

-- Supprimer les anciennes politiques si elles existent
DROP POLICY IF EXISTS "Public read access" ON storage.objects;
DROP POLICY IF EXISTS "Admin full access" ON storage.objects;

-- Créer les nouvelles politiques pour event-images
CREATE POLICY "Public read access for event-images" ON storage.objects
FOR SELECT USING (bucket_id = 'event-images');

CREATE POLICY "Admin full access for event-images" ON storage.objects
FOR ALL USING (
  bucket_id = 'event-images' AND 
  auth.role() = 'authenticated' AND
  EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_roles.user_id = auth.uid() AND user_roles.role = 'admin'
  )
);

-- Créer les nouvelles politiques pour team-photos
CREATE POLICY "Public read access for team-photos" ON storage.objects
FOR SELECT USING (bucket_id = 'team-photos');

CREATE POLICY "Admin full access for team-photos" ON storage.objects
FOR ALL USING (
  bucket_id = 'team-photos' AND 
  auth.role() = 'authenticated' AND
  EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_roles.user_id = auth.uid() AND user_roles.role = 'admin'
  )
);

-- Créer les nouvelles politiques pour blog-images
CREATE POLICY "Public read access for blog-images" ON storage.objects
FOR SELECT USING (bucket_id = 'blog-images');

CREATE POLICY "Admin full access for blog-images" ON storage.objects
FOR ALL USING (
  bucket_id = 'blog-images' AND 
  auth.role() = 'authenticated' AND
  EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_roles.user_id = auth.uid() AND user_roles.role = 'admin'
  )
);

-- S'assurer que RLS est activé
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;
