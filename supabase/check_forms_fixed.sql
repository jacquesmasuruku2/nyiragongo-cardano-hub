-- Script de vérification des formulaires et tables (CORRIGÉ)
-- À exécuter dans l'éditeur SQL Supabase pour diagnostiquer les problèmes

-- ÉTAPE 1: Vérifier si les tables existent
SELECT 
    table_name,
    CASE 
        WHEN table_name IN ('contact_submissions', 'newsletter_subscriptions', 'event_reservations', 'event_comments', 'article_comments') 
        THEN 'Table requise pour les formulaires'
        ELSE 'Autre table'
    END as table_type,
    'EXISTS' as status
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('contact_submissions', 'newsletter_subscriptions', 'event_reservations', 'event_comments', 'article_comments')
ORDER BY table_name;

-- ÉTAPE 2: Vérifier les politiques RLS sur les tables de formulaires
SELECT 
    schemaname,
    tablename,
    policyname,
    cmd,
    roles
FROM pg_policies 
WHERE tablename IN ('contact_submissions', 'newsletter_subscriptions', 'event_reservations', 'event_comments', 'article_comments')
AND schemaname = 'public'
ORDER BY tablename, policyname;

-- ÉTAPE 3: Vérifier les données existantes dans les tables de formulaires
SELECT 
    'contact_submissions' as table_name,
    COUNT(*) as record_count,
    MIN(created_at) as oldest_record,
    MAX(created_at) as newest_record
FROM contact_submissions
UNION ALL
SELECT 
    'newsletter_subscriptions' as table_name,
    COUNT(*) as record_count,
    MIN(subscribed_at) as oldest_record,
    MAX(subscribed_at) as newest_record
FROM newsletter_subscriptions
UNION ALL
SELECT 
    'event_reservations' as table_name,
    COUNT(*) as record_count,
    MIN(created_at) as oldest_record,
    MAX(created_at) as newest_record
FROM event_reservations
UNION ALL
SELECT 
    'event_comments' as table_name,
    COUNT(*) as record_count,
    MIN(created_at) as oldest_record,
    MAX(created_at) as newest_record
FROM event_comments
UNION ALL
SELECT 
    'article_comments' as table_name,
    COUNT(*) as record_count,
    MIN(created_at) as oldest_record,
    MAX(created_at) as newest_record
FROM article_comments;

-- ÉTAPE 4: Test d'insertion simple pour chaque table
-- Test contact_submissions
DO $$
BEGIN
    INSERT INTO contact_submissions (name, email, subject, message)
    VALUES ('Test User', 'test@example.com', 'Test Subject', 'Test Message');
    RAISE NOTICE 'Test insertion réussie pour contact_submissions';
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'Erreur insertion contact_submissions: %', SQLERRM;
END $$;

-- Test newsletter_subscriptions
DO $$
BEGIN
    INSERT INTO newsletter_subscriptions (email, name)
    VALUES ('test@example.com', 'Test User')
    ON CONFLICT (email) DO NOTHING;
    RAISE NOTICE 'Test insertion réussie pour newsletter_subscriptions';
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'Erreur insertion newsletter_subscriptions: %', SQLERRM;
END $$;

-- Test event_reservations (nécessite un event_id valide)
DO $$
BEGIN
    -- D'abord vérifier s'il y a des événements
    IF EXISTS (SELECT 1 FROM events LIMIT 1) THEN
        INSERT INTO event_reservations (event_id, full_name, email)
        VALUES ((SELECT id FROM events LIMIT 1), 'Test User', 'test@example.com');
        RAISE NOTICE 'Test insertion réussie pour event_reservations';
    ELSE
        RAISE NOTICE 'Aucun événement trouvé pour tester event_reservations';
    END IF;
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'Erreur insertion event_reservations: %', SQLERRM;
END $$;

-- ÉTAPE 5: Vérification des permissions de l'utilisateur anonyme (CORRIGÉ)
SELECT 
    'Permissions anonymes' as check_type,
    table_name as tablename,
    has_table_privilege('anon', table_name, 'INSERT') as can_insert,
    has_table_privilege('anon', table_name, 'SELECT') as can_select,
    has_table_privilege('anon', table_name, 'UPDATE') as can_update,
    has_table_privilege('anon', table_name, 'DELETE') as can_delete
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('contact_submissions', 'newsletter_subscriptions', 'event_reservations', 'event_comments', 'article_comments')
ORDER BY table_name;

-- ÉTAPE 6: Résumé des problèmes potentiels
SELECT 
    'DIAGNOSTIC COMPLET' as section,
    'Vérifiez les résultats ci-dessus pour identifier les problèmes' as recommendation,
    'Si les tables nexistent pas, exécutez le script de création de base de données' as next_step_1,
    'Si les permissions sont incorrectes, ajustez les politiques RLS' as next_step_2,
    'Si les insertions échouent, vérifiez les contraintes et types de données' as next_step_3;
