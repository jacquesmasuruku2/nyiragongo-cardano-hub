-- Configuration Storage simplifiée - à exécuter étape par étape
-- Créé le 28/02/2026

-- ÉTAPE 1: Créer les buckets (si vous avez les permissions)
-- Si erreur de permission, passez à l'étape 2 (création manuelle)

-- Créer bucket event-images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'event-images',
  'event-images',
  true,
  52428800,
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
);

-- Créer bucket team-photos
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'team-photos',
  'team-photos',
  true,
  52428800,
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
);

-- Créer bucket blog-images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'blog-images',
  'blog-images',
  true,
  52428800,
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
);

-- ÉTAPE 2: Configurer les politiques RLS
-- Activer RLS sur storage.objects
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Politiques pour event-images
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

-- Politiques pour team-photos
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

-- Politiques pour blog-images
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

-- ÉTAPE 3: Vérification
-- Vérifier que les buckets sont créés
SELECT 'Buckets créés: ' || COUNT(*) as resultat
FROM storage.buckets 
WHERE id IN ('event-images', 'team-photos', 'blog-images');

-- Vérifier que les politiques sont créées
SELECT 'Politiques créées: ' || COUNT(*) as resultat
FROM pg_policies 
WHERE tablename = 'objects' AND schemaname = 'storage';

SELECT 'Configuration storage terminée!';
