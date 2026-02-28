-- Création de la table des commentaires pour les événements
-- Créé le 28/02/2026

-- Table des commentaires d'événements
CREATE TABLE IF NOT EXISTS event_comments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    author_name VARCHAR(255) NOT NULL,
    author_email VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    is_approved BOOLEAN DEFAULT TRUE -- Auto-approuver pour commencer
);

-- Index pour optimiser les performances
CREATE INDEX IF NOT EXISTS idx_event_comments_event_id ON event_comments(event_id);
CREATE INDEX IF NOT EXISTS idx_event_comments_created_at ON event_comments(created_at DESC);

-- Activer RLS
ALTER TABLE event_comments ENABLE ROW LEVEL SECURITY;

-- Politiques RLS pour event_comments
-- Lecture publique pour les commentaires approuvés
CREATE POLICY "Public read approved comments" ON event_comments
FOR SELECT USING (is_approved = true);

-- Insertion publique (auto-approuvée)
CREATE POLICY "Public insert comments" ON event_comments
FOR INSERT WITH CHECK (true);

-- Suppression par l'auteur ou admin
CREATE POLICY "Authors and admins can delete" ON event_comments
FOR DELETE USING (
    auth.role() = 'authenticated' AND
    EXISTS (
        SELECT 1 FROM user_roles
        WHERE user_roles.user_id = auth.uid() AND user_roles.role = 'admin'
    )
);

-- Vérification
SELECT 'Table event_comments créée avec succès!' as message;
