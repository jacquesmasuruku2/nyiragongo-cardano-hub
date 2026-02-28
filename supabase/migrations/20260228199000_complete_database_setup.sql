-- Script complet de création des tables pour Cardano Nyiragongo Hub
-- Créé le 28/02/2026 - À exécuter dans l'éditeur SQL Supabase

-- ÉTAPE 1: Création des tables principales

-- Table des rôles utilisateurs
CREATE TABLE IF NOT EXISTS user_roles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role VARCHAR(50) NOT NULL DEFAULT 'user',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id)
);

-- Table des événements
CREATE TABLE IF NOT EXISTS events (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    description TEXT NOT NULL,
    full_content TEXT,
    date_start TIMESTAMP WITH TIME ZONE NOT NULL,
    date_end TIMESTAMP WITH TIME ZONE,
    location VARCHAR(255) NOT NULL,
    moderator VARCHAR(255),
    total_seats INTEGER DEFAULT 50,
    reserved_seats INTEGER DEFAULT 0,
    is_upcoming BOOLEAN DEFAULT true,
    image_url TEXT,
    external_link TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table des réservations d'événements
CREATE TABLE IF NOT EXISTS event_reservations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

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

-- Table des membres de l'équipe
CREATE TABLE IF NOT EXISTS team_members (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(255) NOT NULL,
    bio TEXT NOT NULL,
    email VARCHAR(255),
    photo_url TEXT,
    linkedin_url TEXT,
    twitter_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table des articles de blog
CREATE TABLE IF NOT EXISTS articles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    excerpt TEXT NOT NULL,
    content TEXT NOT NULL,
    author VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    image_url TEXT,
    published BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table des commentaires d'articles
CREATE TABLE IF NOT EXISTS article_comments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    article_id UUID NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
    author_name VARCHAR(255) NOT NULL,
    author_email VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    is_approved BOOLEAN DEFAULT TRUE
);

-- Table des photos de galerie
CREATE TABLE IF NOT EXISTS gallery_photos (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    image_url TEXT NOT NULL,
    category VARCHAR(100) DEFAULT 'general',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table des inscriptions newsletter
CREATE TABLE IF NOT EXISTS newsletter_subscriptions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    name VARCHAR(255),
    subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT true
);

-- Table des contacts (formulaire de contact)
CREATE TABLE IF NOT EXISTS contact_submissions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    subject VARCHAR(255),
    message TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    is_read BOOLEAN DEFAULT false
);

-- Table des profils utilisateurs (extension de auth.users)
CREATE TABLE IF NOT EXISTS profiles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    display_name VARCHAR(255),
    avatar_url TEXT,
    bio TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id)
);

-- ÉTAPE 2: Création des index pour optimiser les performances

-- Index pour les événements
CREATE INDEX IF NOT EXISTS idx_events_date_start ON events(date_start);
CREATE INDEX IF NOT EXISTS idx_events_is_upcoming ON events(is_upcoming);
CREATE INDEX IF NOT EXISTS idx_events_slug ON events(slug);

-- Index pour les réservations
CREATE INDEX IF NOT EXISTS idx_event_reservations_event_id ON event_reservations(event_id);
CREATE INDEX IF NOT EXISTS idx_event_reservations_email ON event_reservations(email);

-- Index pour les commentaires d'événements
CREATE INDEX IF NOT EXISTS idx_event_comments_event_id ON event_comments(event_id);
CREATE INDEX IF NOT EXISTS idx_event_comments_created_at ON event_comments(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_event_comments_approved ON event_comments(is_approved);

-- Index pour les articles
CREATE INDEX IF NOT EXISTS idx_articles_published ON articles(published);
CREATE INDEX IF NOT EXISTS idx_articles_category ON articles(category);
CREATE INDEX IF NOT EXISTS idx_articles_slug ON articles(slug);
CREATE INDEX IF NOT EXISTS idx_articles_created_at ON articles(created_at DESC);

-- Index pour les commentaires d'articles
CREATE INDEX IF NOT EXISTS idx_article_comments_article_id ON article_comments(article_id);
CREATE INDEX IF NOT EXISTS idx_article_comments_created_at ON article_comments(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_article_comments_approved ON article_comments(is_approved);

-- Index pour la galerie
CREATE INDEX IF NOT EXISTS idx_gallery_photos_category ON gallery_photos(category);
CREATE INDEX IF NOT EXISTS idx_gallery_photos_created_at ON gallery_photos(created_at DESC);

-- Index pour les rôles utilisateurs
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_role ON user_roles(role);

-- ÉTAPE 3: Configuration des politiques RLS (Row Level Security)

-- Activer RLS sur toutes les tables
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE article_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Politiques pour user_roles
CREATE POLICY "Users can read own role" ON user_roles
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage roles" ON user_roles
FOR ALL USING (
    auth.uid() = user_id AND
    EXISTS (
        SELECT 1 FROM user_roles
        WHERE user_roles.user_id = auth.uid() AND user_roles.role = 'admin'
    )
);

-- Politiques pour events
CREATE POLICY "Public read events" ON events
FOR SELECT USING (true);

CREATE POLICY "Admins can manage events" ON events
FOR ALL USING (
    auth.uid() IS NOT NULL AND
    EXISTS (
        SELECT 1 FROM user_roles
        WHERE user_roles.user_id = auth.uid() AND user_roles.role = 'admin'
    )
);

-- Politiques pour event_reservations
CREATE POLICY "Public insert reservations" ON event_reservations
FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can read own reservations" ON event_reservations
FOR SELECT USING (
    auth.uid() IS NOT NULL AND
    EXISTS (
        SELECT 1 FROM user_roles
        WHERE user_roles.user_id = auth.uid() AND user_roles.role = 'admin'
    )
);

CREATE POLICY "Admins can manage reservations" ON event_reservations
FOR ALL USING (
    auth.uid() IS NOT NULL AND
    EXISTS (
        SELECT 1 FROM user_roles
        WHERE user_roles.user_id = auth.uid() AND user_roles.role = 'admin'
    )
);

-- Politiques pour event_comments
CREATE POLICY "Public read approved comments" ON event_comments
FOR SELECT USING (is_approved = true);

CREATE POLICY "Public insert comments" ON event_comments
FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can manage comments" ON event_comments
FOR ALL USING (
    auth.uid() IS NOT NULL AND
    EXISTS (
        SELECT 1 FROM user_roles
        WHERE user_roles.user_id = auth.uid() AND user_roles.role = 'admin'
    )
);

-- Politiques pour team_members
CREATE POLICY "Public read team members" ON team_members
FOR SELECT USING (true);

CREATE POLICY "Admins can manage team members" ON team_members
FOR ALL USING (
    auth.uid() IS NOT NULL AND
    EXISTS (
        SELECT 1 FROM user_roles
        WHERE user_roles.user_id = auth.uid() AND user_roles.role = 'admin'
    )
);

-- Politiques pour articles
CREATE POLICY "Public read published articles" ON articles
FOR SELECT USING (published = true);

CREATE POLICY "Admins can manage articles" ON articles
FOR ALL USING (
    auth.uid() IS NOT NULL AND
    EXISTS (
        SELECT 1 FROM user_roles
        WHERE user_roles.user_id = auth.uid() AND user_roles.role = 'admin'
    )
);

-- Politiques pour article_comments
CREATE POLICY "Public read approved article comments" ON article_comments
FOR SELECT USING (is_approved = true);

CREATE POLICY "Public insert article comments" ON article_comments
FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can manage article comments" ON article_comments
FOR ALL USING (
    auth.uid() IS NOT NULL AND
    EXISTS (
        SELECT 1 FROM user_roles
        WHERE user_roles.user_id = auth.uid() AND user_roles.role = 'admin'
    )
);

-- Politiques pour gallery_photos
CREATE POLICY "Public read gallery photos" ON gallery_photos
FOR SELECT USING (true);

CREATE POLICY "Admins can manage gallery photos" ON gallery_photos
FOR ALL USING (
    auth.uid() IS NOT NULL AND
    EXISTS (
        SELECT 1 FROM user_roles
        WHERE user_roles.user_id = auth.uid() AND user_roles.role = 'admin'
    )
);

-- Politiques pour newsletter_subscriptions
CREATE POLICY "Public insert subscriptions" ON newsletter_subscriptions
FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can manage subscriptions" ON newsletter_subscriptions
FOR ALL USING (
    auth.uid() IS NOT NULL AND
    EXISTS (
        SELECT 1 FROM user_roles
        WHERE user_roles.user_id = auth.uid() AND user_roles.role = 'admin'
    )
);

-- Politiques pour contact_submissions
CREATE POLICY "Public insert contact submissions" ON contact_submissions
FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can manage contact submissions" ON contact_submissions
FOR ALL USING (
    auth.uid() IS NOT NULL AND
    EXISTS (
        SELECT 1 FROM user_roles
        WHERE user_roles.user_id = auth.uid() AND user_roles.role = 'admin'
    )
);

-- Politiques pour profiles
CREATE POLICY "Users can read own profile" ON profiles
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" ON profiles
FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile" ON profiles
FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ÉTAPE 4: Création des fonctions utiles

-- Fonction pour configurer le profil utilisateur
CREATE OR REPLACE FUNCTION setup_user_profile(p_user_id UUID, p_email TEXT)
RETURNS VOID AS $$
BEGIN
    -- Créer le profil s'il n'existe pas
    INSERT INTO profiles (user_id, display_name)
    VALUES (p_user_id, split_part(p_email, '@', 1))
    ON CONFLICT (user_id) DO NOTHING;
    
    -- Assigner le rôle par défaut s'il n'existe pas
    INSERT INTO user_roles (user_id, role)
    VALUES (p_user_id, 'user')
    ON CONFLICT (user_id) DO NOTHING;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ÉTAPE 5: Insertion des données initiales

-- Ajouter Baudouin MUVUNGA comme Leader du Hub
INSERT INTO team_members (
    name,
    role,
    bio,
    email,
    linkedin_url,
    twitter_url,
    created_at
) VALUES (
    'Baudouin MUVUNGA',
    'Leader du Hub, Coordinateur principal et mentor communautaire',
    'Engagé dans l''adoption de Cardano en RDC',
    NULL,
    'https://cd.linkedin.com/in/baudouin-muvunga-91168a214',
    'https://x.com/BaudouinMuv',
    CURRENT_TIMESTAMP
) ON CONFLICT DO NOTHING;

-- ÉTAPE 6: Vérification finale
SELECT 
    'Base de données Cardano Nyiragongo Hub créée avec succès!' as message,
    (SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public' AND table_name IN (
        'user_roles', 'events', 'event_reservations', 'event_comments', 'team_members', 
        'articles', 'article_comments', 'gallery_photos', 'newsletter_subscriptions', 
        'contact_submissions', 'profiles'
    )) as tables_created,
    (SELECT COUNT(*) FROM pg_policies WHERE schemaname = 'public') as policies_created,
    'Toutes les tables et politiques sont prêtes!' as status;
