-- Création des politiques RLS pour les buckets storage existants
-- Créé le 28/02/2026 - suppose que les buckets existent déjà

-- Activer RLS sur storage.objects s'il ne l'est pas déjà
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Politiques pour event-images (bucket supposé exister)
CREATE POLICY "Public read access for event-images" ON storage.objects
FOR SELECT USING (
  bucket_id = 'event-images'
);

CREATE POLICY "Admin full access for event-images" ON storage.objects
FOR ALL USING (
  bucket_id = 'event-images' AND 
  auth.role() = 'authenticated' AND
  EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_roles.user_id = auth.uid() AND user_roles.role = 'admin'
  )
);

-- Politiques pour team-photos (bucket supposé exister)
CREATE POLICY "Public read access for team-photos" ON storage.objects
FOR SELECT USING (
  bucket_id = 'team-photos'
);

CREATE POLICY "Admin full access for team-photos" ON storage.objects
FOR ALL USING (
  bucket_id = 'team-photos' AND 
  auth.role() = 'authenticated' AND
  EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_roles.user_id = auth.uid() AND user_roles.role = 'admin'
  )
);

-- Politiques pour blog-images (bucket supposé exister)
CREATE POLICY "Public read access for blog-images" ON storage.objects
FOR SELECT USING (
  bucket_id = 'blog-images'
);

CREATE POLICY "Admin full access for blog-images" ON storage.objects
FOR ALL USING (
  bucket_id = 'blog-images' AND 
  auth.role() = 'authenticated' AND
  EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_roles.user_id = auth.uid() AND user_roles.role = 'admin'
  )
);

-- Vérification des politiques créées
SELECT 'Politiques RLS créées avec succès!' as message;
