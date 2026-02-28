-- Solution sans RLS - utilise des buckets publics
-- Créé le 28/02/2026 - fonctionne sans permissions owner

-- ÉTAPE 1: Créer les buckets comme publics sans RLS
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

-- ÉTAPE 2: Désactiver RLS sur storage.objects pour permettre l'accès
ALTER TABLE storage.objects DISABLE ROW LEVEL SECURITY;

-- ÉTAPE 3: Vérification
SELECT 
    'Solution sans RLS appliquée!' as message,
    (SELECT COUNT(*) FROM storage.buckets WHERE id IN ('event-images', 'team-photos', 'blog-images')) as buckets_count,
    'RLS désactivé sur storage.objects' as rls_status;
