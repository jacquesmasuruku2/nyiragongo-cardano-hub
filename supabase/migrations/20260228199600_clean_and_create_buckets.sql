-- Script de nettoyage et création des buckets storage pour Cardano Nyiragongo Hub
-- Créé le 28/02/2026 - À exécuter dans l'éditeur SQL Supabase
-- Version corrigée sans erreurs de syntaxe

-- ÉTAPE 1: Suppression des buckets existants (nettoyage)
-- Note: Cette étape supprime les buckets et leur contenu

-- Suppression du bucket event-images
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'event-images') THEN
        PERFORM storage.remove_bucket('event-images', true);
        RAISE NOTICE 'Bucket event-images supprimé';
    END IF;
END $$;

-- Suppression du bucket team-photos
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'team-photos') THEN
        PERFORM storage.remove_bucket('team-photos', true);
        RAISE NOTICE 'Bucket team-photos supprimé';
    END IF;
END $$;

-- Suppression du bucket blog-images
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'blog-images') THEN
        PERFORM storage.remove_bucket('blog-images', true);
        RAISE NOTICE 'Bucket blog-images supprimé';
    END IF;
END $$;

-- Suppression du bucket gallery-photos
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'gallery-photos') THEN
        PERFORM storage.remove_bucket('gallery-photos', true);
        RAISE NOTICE 'Bucket gallery-photos supprimé';
    END IF;
END $$;

-- Suppression du bucket avatars
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'avatars') THEN
        PERFORM storage.remove_bucket('avatars', true);
        RAISE NOTICE 'Bucket avatars supprimé';
    END IF;
END $$;

-- Suppression du bucket documents
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'documents') THEN
        PERFORM storage.remove_bucket('documents', true);
        RAISE NOTICE 'Bucket documents supprimé';
    END IF;
END $$;

-- Suppression du bucket branding
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'branding') THEN
        PERFORM storage.remove_bucket('branding', true);
        RAISE NOTICE 'Bucket branding supprimé';
    END IF;
END $$;

-- ÉTAPE 2: Création des buckets storage

-- Bucket pour les images des événements
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'event-images',
    'event-images',
    true,
    5242880, -- 5MB
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
);

-- Bucket pour les photos des membres de l'équipe
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'team-photos',
    'team-photos',
    true,
    5242880, -- 5MB
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
);

-- Bucket pour les images des articles de blog
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'blog-images',
    'blog-images',
    true,
    5242880, -- 5MB
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
);

-- Bucket pour les photos de la galerie
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'gallery-photos',
    'gallery-photos',
    true,
    10485760, -- 10MB (plus grand pour les photos de galerie)
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
);

-- Bucket pour les avatars des utilisateurs
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'avatars',
    'avatars',
    true,
    2097152, -- 2MB (plus petit pour les avatars)
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
);

-- Bucket pour les documents et fichiers divers
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'documents',
    'documents',
    true,
    10485760, -- 10MB
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'application/pdf', 'text/plain']
);

-- Bucket pour les logos et bannières
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'branding',
    'branding',
    true,
    5242880, -- 5MB
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml', 'image/gif']
);

-- ÉTAPE 3: Vérification des buckets créés
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

-- ÉTAPE 4: Informations sur les URLs publiques (format corrigé)
SELECT 
    'event-images' as bucket_name,
    'storage/v1/object/public/event-images/' as url_prefix,
    '5MB' as size_limit,
    'Images des événements' as usage
UNION ALL
SELECT 
    'team-photos' as bucket_name,
    'storage/v1/object/public/team-photos/' as url_prefix,
    '5MB' as size_limit,
    'Photos de l équipe' as usage
UNION ALL
SELECT 
    'blog-images' as bucket_name,
    'storage/v1/object/public/blog-images/' as url_prefix,
    '5MB' as size_limit,
    'Images des articles de blog' as usage
UNION ALL
SELECT 
    'gallery-photos' as bucket_name,
    'storage/v1/object/public/gallery-photos/' as url_prefix,
    '10MB' as size_limit,
    'Photos de la galerie' as usage
UNION ALL
SELECT 
    'avatars' as bucket_name,
    'storage/v1/object/public/avatars/' as url_prefix,
    '2MB' as size_limit,
    'Avatars des utilisateurs' as usage
UNION ALL
SELECT 
    'documents' as bucket_name,
    'storage/v1/object/public/documents/' as url_prefix,
    '10MB' as size_limit,
    'Documents et fichiers divers' as usage
UNION ALL
SELECT 
    'branding' as bucket_name,
    'storage/v1/object/public/branding/' as url_prefix,
    '5MB' as size_limit,
    'Logos et bannières' as usage;

-- ÉTAPE 5: Résumé final
SELECT 
    'Configuration des buckets storage terminée avec succès!' as message,
    (SELECT COUNT(*) FROM storage.buckets WHERE name IN ('event-images', 'team-photos', 'blog-images', 'gallery-photos', 'avatars', 'documents', 'branding')) as buckets_created,
    'Tous les buckets sont prêts pour les uploads!' as status,
    'Anciens buckets nettoyés et nouveaux buckets créés' as cleanup_status;
