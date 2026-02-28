-- Création des buckets storage pour les images
-- Créé le 28/02/2026 pour supporter l'upload d'images dans le Panel Admin

-- Bucket pour les images des événements
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'event-images',
  'event-images',
  true,
  52428800, -- 50MB
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
) ON CONFLICT (id) DO NOTHING;

-- Bucket pour les photos des membres de l'équipe
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'team-photos',
  'team-photos',
  true,
  52428800, -- 50MB
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
) ON CONFLICT (id) DO NOTHING;

-- Bucket pour les images des articles de blog
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'blog-images',
  'blog-images',
  true,
  52428800, -- 50MB
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
) ON CONFLICT (id) DO NOTHING;

-- Politiques RLS pour event-images
-- Lecture publique pour tout le monde
CREATE POLICY "Public read access for event-images" ON storage.objects
FOR SELECT USING (
  bucket_id = 'event-images'
);

-- Accès complet pour les administrateurs
CREATE POLICY "Admin full access for event-images" ON storage.objects
FOR ALL USING (
  bucket_id = 'event-images' AND
  auth.role() = 'authenticated' AND
  EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_roles.user_id = auth.uid() AND user_roles.role = 'admin'
  )
);

-- Politiques RLS pour team-photos
-- Lecture publique pour tout le monde
CREATE POLICY "Public read access for team-photos" ON storage.objects
FOR SELECT USING (
  bucket_id = 'team-photos'
);

-- Accès complet pour les administrateurs
CREATE POLICY "Admin full access for team-photos" ON storage.objects
FOR ALL USING (
  bucket_id = 'team-photos' AND
  auth.role() = 'authenticated' AND
  EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_roles.user_id = auth.uid() AND user_roles.role = 'admin'
  )
);

-- Politiques RLS pour blog-images
-- Lecture publique pour tout le monde
CREATE POLICY "Public read access for blog-images" ON storage.objects
FOR SELECT USING (
  bucket_id = 'blog-images'
);

-- Accès complet pour les administrateurs
CREATE POLICY "Admin full access for blog-images" ON storage.objects
FOR ALL USING (
  bucket_id = 'blog-images' AND
  auth.role() = 'authenticated' AND
  EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_roles.user_id = auth.uid() AND user_roles.role = 'admin'
  )
);

-- Activer RLS sur storage.objects
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;
