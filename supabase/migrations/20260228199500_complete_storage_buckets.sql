-- Script complet de création des buckets storage pour Cardano Nyiragongo Hub
-- Créé le 28/02/2026 - À exécuter dans l'éditeur SQL Supabase
-- Version finale sans RLS pour éviter les erreurs de permissions

-- ÉTAPE 1: Création des buckets storage
-- Note: Utilisation de INSERT ON CONFLICT pour éviter les erreurs si les buckets existent déjà

-- Bucket pour les images des événements
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'event-images',
    'event-images',
    true,
    5242880, -- 5MB
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO UPDATE SET
    public = EXCLUDED.public,
    file_size_limit = EXCLUDED.file_size_limit,
    allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Bucket pour les photos des membres de l'équipe
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'team-photos',
    'team-photos',
    true,
    5242880, -- 5MB
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO UPDATE SET
    public = EXCLUDED.public,
    file_size_limit = EXCLUDED.file_size_limit,
    allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Bucket pour les images des articles de blog
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'blog-images',
    'blog-images',
    true,
    5242880, -- 5MB
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO UPDATE SET
    public = EXCLUDED.public,
    file_size_limit = EXCLUDED.file_size_limit,
    allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Bucket pour les photos de la galerie
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'gallery-photos',
    'gallery-photos',
    true,
    10485760, -- 10MB (plus grand pour les photos de galerie)
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO UPDATE SET
    public = EXCLUDED.public,
    file_size_limit = EXCLUDED.file_size_limit,
    allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Bucket pour les avatars des utilisateurs
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'avatars',
    'avatars',
    true,
    2097152, -- 2MB (plus petit pour les avatars)
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO UPDATE SET
    public = EXCLUDED.public,
    file_size_limit = EXCLUDED.file_size_limit,
    allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Bucket pour les documents et fichiers divers (optionnel mais utile)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'documents',
    'documents',
    true,
    10485760, -- 10MB
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'application/pdf', 'text/plain']
)
ON CONFLICT (id) DO UPDATE SET
    public = EXCLUDED.public,
    file_size_limit = EXCLUDED.file_size_limit,
    allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Bucket pour les logos et bannières (optionnel)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'branding',
    'branding',
    true,
    5242880, -- 5MB
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml', 'image/gif']
)
ON CONFLICT (id) DO UPDATE SET
    public = EXCLUDED.public,
    file_size_limit = EXCLUDED.file_size_limit,
    allowed_mime_types = EXCLUDED.allowed_mime_types;

-- ÉTAPE 2: Vérification des buckets créés
SELECT 
    id,
    name,
    public,
    file_size_limit,
    created_at,
    CASE 
        WHEN name IN ('event-images', 'team-photos', 'blog-images', 'gallery-photos', 'avatars', 'documents', 'branding') 
        THEN '✅ Bucket requis créé'
        ELSE '⚠️ Bucket additionnel'
    END as status
FROM storage.buckets 
WHERE name IN ('event-images', 'team-photos', 'blog-images', 'gallery-photos', 'avatars', 'documents', 'branding')
ORDER BY id;

-- ÉTAPE 3: Informations sur les URLs publiques
SELECT 
    'Informations des URLs publiques pour les buckets:' as information,
    'event-images' as bucket_name,
    '/storage/v1/object/public/event-images/' as public_url_prefix
UNION ALL
SELECT 
    'Informations des URLs publiques pour les buckets:' as information,
    'team-photos' as bucket_name,
    '/storage/v1/object/public/team-photos/' as public_url_prefix
UNION ALL
SELECT 
    'Informations des URLs publiques pour les buckets:' as information,
    'blog-images' as bucket_name,
    '/storage/v1/object/public/blog-images/' as public_url_prefix
UNION ALL
SELECT 
    'Informations des URLs publiques pour les buckets:' as information,
    'gallery-photos' as bucket_name,
    '/storage/v1/object/public/gallery-photos/' as public_url_prefix
UNION ALL
SELECT 
    'Informations des URLs publiques pour les buckets:' as information,
    'avatars' as bucket_name,
    '/storage/v1/object/public/avatars/' as public_url_prefix
UNION ALL
SELECT 
    'Informations des URLs publiques pour les buckets:' as information,
    'documents' as bucket_name,
    '/storage/v1/object/public/documents/' as public_url_prefix
UNION ALL
SELECT 
    'Informations des URLs publiques pour les buckets:' as information,
    'branding' as bucket_name,
    '/storage/v1/object/public/branding/' as public_url_prefix;

-- ÉTAPE 4: Résumé final
SELECT 
    'Configuration des buckets storage terminée!' as message,
    (SELECT COUNT(*) FROM storage.buckets WHERE name IN ('event-images', 'team-photos', 'blog-images', 'gallery-photos', 'avatars', 'documents', 'branding')) as buckets_created,
    'Tous les buckets sont prêts pour les uploads!' as status,
    'Tailles limites: 2MB (avatars), 5MB (standard), 10MB (galerie/documents)' as limits_info;
