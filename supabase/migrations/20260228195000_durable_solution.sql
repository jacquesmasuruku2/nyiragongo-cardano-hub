-- Solution durable pour les permissions storage
-- Créé le 28/02/2026 - utilise les buckets existants avec permissions adaptées

-- ÉTAPE 1: Vérifier les buckets existants
DO $$
BEGIN
    -- Vérifier si les buckets existent, sinon les créer avec permissions limitées
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

-- ÉTAPE 2: Configurer les politiques avec une approche différente
-- Utiliser des politiques plus simples qui ne nécessitent pas de permissions owner

-- Supprimer les anciennes politiques si elles existent
DROP POLICY IF EXISTS "Public read access for event-images" ON storage.objects;
DROP POLICY IF EXISTS "Admin full access for event-images" ON storage.objects;
DROP POLICY IF EXISTS "Public read access for team-photos" ON storage.objects;
DROP POLICY IF EXISTS "Admin full access for team-photos" ON storage.objects;
DROP POLICY IF EXISTS "Public read access for blog-images" ON storage.objects;
DROP POLICY IF EXISTS "Admin full access for blog-images" ON storage.objects;

-- ÉTAPE 3: Créer des politiques simplifiées
-- Politiques pour event-images
CREATE POLICY "event-images-public-read" ON storage.objects
FOR SELECT USING (bucket_id = 'event-images');

CREATE POLICY "event-images-admin-access" ON storage.objects
FOR ALL USING (
    bucket_id = 'event-images' AND 
    auth.role() = 'authenticated'
);

-- Politiques pour team-photos
CREATE POLICY "team-photos-public-read" ON storage.objects
FOR SELECT USING (bucket_id = 'team-photos');

CREATE POLICY "team-photos-admin-access" ON storage.objects
FOR ALL USING (
    bucket_id = 'team-photos' AND 
    auth.role() = 'authenticated'
);

-- Politiques pour blog-images
CREATE POLICY "blog-images-public-read" ON storage.objects
FOR SELECT USING (bucket_id = 'blog-images');

CREATE POLICY "blog-images-admin-access" ON storage.objects
FOR ALL USING (
    bucket_id = 'blog-images' AND 
    auth.role() = 'authenticated'
);

-- ÉTAPE 4: Activer RLS si nécessaire
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- ÉTAPE 5: Vérification
SELECT 
    'Configuration durable terminée!' as message,
    (SELECT COUNT(*) FROM storage.buckets WHERE id IN ('event-images', 'team-photos', 'blog-images')) as buckets_count,
    (SELECT COUNT(*) FROM pg_policies WHERE tablename = 'objects' AND schemaname = 'storage') as policies_count;
