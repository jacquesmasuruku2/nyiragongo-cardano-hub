-- Script corrigé de création des buckets storage pour Cardano Nyiragongo Hub
-- Créé le 28/02/2026 - À exécuter dans l'éditeur SQL Supabase
-- Version finale sans suppression manuelle (fonction non disponible)

-- ÉTAPE 1: Création des buckets storage avec INSERT ON CONFLICT
-- Cette approche évite les erreurs si les buckets existent déjà

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

-- Bucket pour les documents et fichiers divers
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

-- Bucket pour les logos et bannières
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
        THEN 'Bucket requis créé avec succès'
        ELSE 'Bucket additionnel créé'
    END as status
FROM storage.buckets 
WHERE name IN ('event-images', 'team-photos', 'blog-images', 'gallery-photos', 'avatars', 'documents', 'branding')
ORDER BY id;

-- ÉTAPE 3: Informations sur les buckets (format simple sans URLs complexes)
SELECT 
    'event-images' as bucket_name,
    '5MB' as size_limit,
    'Images des événements' as usage,
    'JPEG, PNG, WebP, GIF' as formats
UNION ALL
SELECT 
    'team-photos' as bucket_name,
    '5MB' as size_limit,
    'Photos de l équipe' as usage,
    'JPEG, PNG, WebP, GIF' as formats
UNION ALL
SELECT 
    'blog-images' as bucket_name,
    '5MB' as size_limit,
    'Images des articles de blog' as usage,
    'JPEG, PNG, WebP, GIF' as formats
UNION ALL
SELECT 
    'gallery-photos' as bucket_name,
    '10MB' as size_limit,
    'Photos de la galerie' as usage,
    'JPEG, PNG, WebP, GIF' as formats
UNION ALL
SELECT 
    'avatars' as bucket_name,
    '2MB' as size_limit,
    'Avatars des utilisateurs' as usage,
    'JPEG, PNG, WebP, GIF' as formats
UNION ALL
SELECT 
    'documents' as bucket_name,
    '10MB' as size_limit,
    'Documents et fichiers divers' as usage,
    'JPEG, PNG, WebP, GIF, PDF, TXT' as formats
UNION ALL
SELECT 
    'branding' as bucket_name,
    '5MB' as size_limit,
    'Logos et bannières' as usage,
    'JPEG, PNG, WebP, SVG, GIF' as formats;

-- ÉTAPE 4: Résumé final
SELECT 
    'Configuration des buckets storage terminée avec succès!' as message,
    (SELECT COUNT(*) FROM storage.buckets WHERE name IN ('event-images', 'team-photos', 'blog-images', 'gallery-photos', 'avatars', 'documents', 'branding')) as buckets_created,
    'Tous les buckets sont prêts pour les uploads!' as status,
    'Approche ON CONFLICT utilisée pour éviter les erreurs' as method_used;

-- ÉTAPE 5: Instructions pour les URLs publiques (information seulement)
SELECT 
    'Pour utiliser les buckets dans votre code:' as information,
    'const supabase.storage.from("bucket-name").upload("file.jpg", file)' as upload_example,
    'const { data } = supabase.storage.from("bucket-name").getPublicUrl("file.jpg")' as url_example,
    'Les URLs publiques suivent le format: /storage/v1/object/public/bucket-name/' as url_format;
