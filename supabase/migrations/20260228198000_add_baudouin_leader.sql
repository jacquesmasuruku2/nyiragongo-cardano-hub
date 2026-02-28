-- Ajout de Baudouin MUVUNGA comme Leader du Hub
-- Créé le 28/02/2026

-- Insertion de Baudouin MUVUNGA comme membre de l'équipe
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
    'Engagé dans l''adoption de Cardano en RDC comme description',
    NULL, -- email optionnel
    'https://cd.linkedin.com/in/baudouin-muvunga-91168a214',
    'https://x.com/BaudouinMuv',
    CURRENT_TIMESTAMP
) ON CONFLICT DO NOTHING;

-- Vérification
SELECT 
    'Baudouin MUVUNGA ajouté avec succès comme Leader du Hub!' as message,
    (SELECT COUNT(*) FROM team_members WHERE name = 'Baudouin MUVUNGA') as member_exists;
