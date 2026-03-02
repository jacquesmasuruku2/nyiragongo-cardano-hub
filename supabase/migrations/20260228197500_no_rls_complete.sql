-- Solution complète sans RLS - utilise buckets existants
-- Créé le 28/02/2026 - fonctionne sans permissions owner

-- ÉTAPE 1: Créer les buckets storage sans RLS (si permissions disponibles)
-- Si erreur de permissions, passer à l'étape 2

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

    -- Créer gallery-photos si inexistant
    IF NOT EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'gallery-photos') THEN
        INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
        VALUES (
            'gallery-photos',
            'gallery-photos',
            true,
            52428800,
            ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
        );
    END IF;

    -- Créer avatars si inexistant
    IF NOT EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'avatars') THEN
        INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
        VALUES (
            'avatars',
            'avatars',
            true,
            52428800,
            ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
        );
    END IF;
END $$;

-- ÉTAPE 2: Créer uniquement les tables qui n'existent pas (sans RLS)
-- Table des commentaires d'événements
CREATE TABLE IF NOT EXISTS event_comments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    author_name VARCHAR(255) NOT NULL,
    author_email VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    is_approved BOOLEAN DEFAULT TRUE
);

-- Index pour optimisation
CREATE INDEX IF NOT EXISTS idx_event_comments_event_id ON event_comments(event_id);
CREATE INDEX IF NOT EXISTS idx_event_comments_created_at ON event_comments(created_at DESC);

-- ÉTAPE 3: Vérification des buckets existants
SELECT 
    'Configuration sans RLS terminée!' as message,
    (SELECT COUNT(*) FROM storage.buckets WHERE id IN ('event-images', 'team-photos', 'blog-images', 'gallery-photos', 'avatars')) as buckets_count,
    (SELECT COUNT(*) FROM information_schema.tables WHERE table_name = 'event_comments' AND table_schema = 'public') as tables_count,
    'Solution fonctionnelle sans RLS' as status;
