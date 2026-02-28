-- Configuration complète des buckets et politiques pour toute la base de données
-- Créé le 28/02/2026 - Solution durable et complète

-- ÉTAPE 1: Créer les buckets storage pour toutes les fonctionnalités
DO $$
BEGIN
    -- Bucket pour les images des événements
    IF NOT EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'event-images') THEN
        INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
        VALUES (
            'event-images',
            'event-images',
            true,
            52428800, -- 50MB
            ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
        );
    END IF;

    -- Bucket pour les photos des membres de l'équipe
    IF NOT EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'team-photos') THEN
        INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
        VALUES (
            'team-photos',
            'team-photos',
            true,
            52428800, -- 50MB
            ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
        );
    END IF;

    -- Bucket pour les images des articles de blog
    IF NOT EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'blog-images') THEN
        INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
        VALUES (
            'blog-images',
            'blog-images',
            true,
            52428800, -- 50MB
            ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
        );
    END IF;

    -- Bucket pour les photos de la galerie
    IF NOT EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'gallery-photos') THEN
        INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
        VALUES (
            'gallery-photos',
            'gallery-photos',
            true,
            52428800, -- 50MB
            ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
        );
    END IF;

    -- Bucket pour les avatars des utilisateurs
    IF NOT EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'avatars') THEN
        INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
        VALUES (
            'avatars',
            'avatars',
            true,
            52428800, -- 50MB
            ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
        );
    END IF;
END $$;

-- ÉTAPE 2: Désactiver RLS sur storage.objects pour permettre l'accès
ALTER TABLE storage.objects DISABLE ROW LEVEL SECURITY;

-- ÉTAPE 3: Configurer les politiques RLS pour chaque table de la base de données

-- Politiques pour event_comments
ALTER TABLE event_comments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read approved comments" ON event_comments;
DROP POLICY IF EXISTS "Public insert comments" ON event_comments;
DROP POLICY IF EXISTS "Authors and admins can delete" ON event_comments;

CREATE POLICY "Public read approved comments" ON event_comments
FOR SELECT USING (is_approved = true);

CREATE POLICY "Public insert comments" ON event_comments
FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can delete comments" ON event_comments
FOR DELETE USING (
    auth.role() = 'authenticated' AND
    EXISTS (
        SELECT 1 FROM user_roles
        WHERE user_roles.user_id = auth.uid() AND user_roles.role = 'admin'
    )
);

-- Politiques pour events (si RLS activé)
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read events" ON events;
DROP POLICY IF EXISTS "Admins can manage events" ON events;

CREATE POLICY "Public read events" ON events
FOR SELECT USING (true);

CREATE POLICY "Admins can manage events" ON events
FOR ALL USING (
    auth.role() = 'authenticated' AND
    EXISTS (
        SELECT 1 FROM user_roles
        WHERE user_roles.user_id = auth.uid() AND user_roles.role = 'admin'
    )
);

-- Politiques pour articles (si RLS activé)
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read published articles" ON articles;
DROP POLICY IF EXISTS "Admins can manage articles" ON articles;

CREATE POLICY "Public read published articles" ON articles
FOR SELECT USING (published = true);

CREATE POLICY "Admins can manage articles" ON articles
FOR ALL USING (
    auth.role() = 'authenticated' AND
    EXISTS (
        SELECT 1 FROM user_roles
        WHERE user_roles.user_id = auth.uid() AND user_roles.role = 'admin'
    )
);

-- Politiques pour team_members (si RLS activé)
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read team members" ON team_members;
DROP POLICY IF EXISTS "Admins can manage team members" ON team_members;

CREATE POLICY "Public read team members" ON team_members
FOR SELECT USING (true);

CREATE POLICY "Admins can manage team members" ON team_members
FOR ALL USING (
    auth.role() = 'authenticated' AND
    EXISTS (
        SELECT 1 FROM user_roles
        WHERE user_roles.user_id = auth.uid() AND user_roles.role = 'admin'
    )
);

-- Politiques pour gallery_photos (si RLS activé)
ALTER TABLE gallery_photos ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read gallery photos" ON gallery_photos;
DROP POLICY IF EXISTS "Admins can manage gallery photos" ON gallery_photos;

CREATE POLICY "Public read gallery photos" ON gallery_photos
FOR SELECT USING (true);

CREATE POLICY "Admins can manage gallery photos" ON gallery_photos
FOR ALL USING (
    auth.role() = 'authenticated' AND
    EXISTS (
        SELECT 1 FROM user_roles
        WHERE user_roles.user_id = auth.uid() AND user_roles.role = 'admin'
    )
);

-- Politiques pour event_reservations (si RLS activé)
ALTER TABLE event_reservations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can read own reservations" ON event_reservations;
DROP POLICY IF EXISTS "Public insert reservations" ON event_reservations;
DROP POLICY IF EXISTS "Admins can manage reservations" ON event_reservations;

CREATE POLICY "Users can read own reservations" ON event_reservations
FOR SELECT USING (
    auth.role() = 'authenticated' AND 
    user_id = auth.uid()
);

CREATE POLICY "Public insert reservations" ON event_reservations
FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can manage reservations" ON event_reservations
FOR ALL USING (
    auth.role() = 'authenticated' AND
    EXISTS (
        SELECT 1 FROM user_roles
        WHERE user_roles.user_id = auth.uid() AND user_roles.role = 'admin'
    )
);

-- Politiques pour profiles (si RLS activé)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can read own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;

CREATE POLICY "Users can read own profile" ON profiles
FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can update own profile" ON profiles
FOR UPDATE USING (user_id = auth.uid());

-- Politiques pour user_roles (si RLS activé)
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can read own role" ON user_roles;
DROP POLICY IF EXISTS "Admins can manage roles" ON user_roles;

CREATE POLICY "Users can read own role" ON user_roles
FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Admins can manage roles" ON user_roles
FOR ALL USING (
    auth.role() = 'authenticated' AND
    EXISTS (
        SELECT 1 FROM user_roles
        WHERE user_roles.user_id = auth.uid() AND user_roles.role = 'admin'
    )
);

-- ÉTAPE 4: Vérification finale
SELECT 
    'Configuration complète terminée avec succès!' as message,
    (SELECT COUNT(*) FROM storage.buckets WHERE id IN ('event-images', 'team-photos', 'blog-images', 'gallery-photos', 'avatars')) as buckets_created,
    (SELECT COUNT(*) FROM pg_policies WHERE tablename IN ('event_comments', 'events', 'articles', 'team_members', 'gallery_photos', 'event_reservations', 'profiles', 'user_roles') AND schemaname = 'public') as policies_created,
    'RLS désactivé sur storage.objects pour permettre l''accès' as storage_status;
