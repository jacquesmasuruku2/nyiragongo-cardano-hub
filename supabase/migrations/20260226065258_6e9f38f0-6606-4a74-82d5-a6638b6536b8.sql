
-- Events table
CREATE TABLE public.events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  full_content TEXT,
  date_start TIMESTAMP WITH TIME ZONE NOT NULL,
  date_end TIMESTAMP WITH TIME ZONE,
  location TEXT NOT NULL,
  moderator TEXT,
  total_seats INTEGER NOT NULL DEFAULT 50,
  reserved_seats INTEGER NOT NULL DEFAULT 0,
  image_url TEXT,
  is_upcoming BOOLEAN NOT NULL DEFAULT true,
  external_link TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Events are viewable by everyone"
ON public.events FOR SELECT USING (true);

-- Reservations table
CREATE TABLE public.event_reservations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.event_reservations ENABLE ROW LEVEL SECURITY;

-- Anyone can insert a reservation (public event)
CREATE POLICY "Anyone can create a reservation"
ON public.event_reservations FOR INSERT WITH CHECK (true);

-- Anyone can read reservations count
CREATE POLICY "Reservations are viewable by everyone"
ON public.event_reservations FOR SELECT USING (true);

-- Function to increment reserved_seats
CREATE OR REPLACE FUNCTION public.increment_reserved_seats()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.events SET reserved_seats = reserved_seats + 1 WHERE id = NEW.event_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_reservation_created
AFTER INSERT ON public.event_reservations
FOR EACH ROW
EXECUTE FUNCTION public.increment_reserved_seats();

-- Seed data
INSERT INTO public.events (title, slug, description, full_content, date_start, date_end, location, moderator, total_seats, image_url, is_upcoming) VALUES
(
  'Hackathon CATS 2025',
  'hackathon-cats-2025',
  'Une série de hackathons à travers l''Afrique pour transformer les idées locales en prototypes fonctionnels sur Cardano.',
  'Le Hackathon CATS 2025 est un événement majeur organisé par le Hub Cardano Nyiragongo en collaboration avec la communauté Cardano africaine. Pendant plusieurs semaines, des développeurs, designers et entrepreneurs se réuniront pour créer des solutions innovantes basées sur la blockchain Cardano.

Les participants auront accès à des mentors expérimentés, des ressources techniques et des prix pour les meilleurs projets. C''est une opportunité unique de contribuer à l''écosystème Cardano tout en résolvant des problèmes locaux.

Thèmes abordés : DeFi, identité numérique, supply chain, gouvernance décentralisée.',
  '2025-11-01T09:00:00Z',
  '2025-12-15T18:00:00Z',
  'En ligne + Nyiragongo',
  'Baudouin Augustin',
  100,
  NULL,
  true
),
(
  'Masterclass Smart Contracts',
  'masterclass-smart-contracts',
  'Atelier technique sur le développement de smart contracts avec Plutus et Aiken sur Cardano.',
  'Cette masterclass intensive est conçue pour les développeurs souhaitant maîtriser le développement de smart contracts sur Cardano. Les participants apprendront à utiliser Plutus et Aiken pour créer des contrats intelligents sécurisés et performants.

Programme :
- Introduction à l''architecture eUTXO de Cardano
- Développement avec Plutus (Haskell)
- Développement avec Aiken (langage natif Cardano)
- Tests et déploiement sur testnet
- Bonnes pratiques de sécurité

Prérequis : Connaissances de base en programmation.',
  '2026-03-20T09:00:00Z',
  '2026-03-22T18:00:00Z',
  'Nyiragongo Hub',
  'Équipe technique CATS',
  30,
  NULL,
  true
);

INSERT INTO public.events (title, slug, description, full_content, date_start, location, moderator, total_seats, image_url, is_upcoming, external_link) VALUES
(
  'Événement du 29 juin 2024',
  'evenement-29-juin-2024',
  'Session communautaire autour de Cardano et l''écosystème blockchain à Nyiragongo.',
  'Une journée dédiée à la découverte de Cardano et de son écosystème. Les participants ont pu échanger avec des membres actifs de la communauté et découvrir les opportunités offertes par la blockchain.',
  '2024-06-29T09:00:00Z',
  'Nyiragongo',
  'Baudouin Augustin',
  50,
  NULL,
  false,
  'https://updciongandintersectmbo.blogspot.com/2024/07/evenement-du-29-juin-2024-dans-le.html'
),
(
  'Hackathon Local CATS 2026 – Jour 3',
  'hackathon-local-cats-2026-jour-3',
  'Consolidation technique et structuration des équipes lors du hackathon local.',
  'Le troisième jour du hackathon local CATS 2026 a été marqué par une consolidation technique intense. Les équipes ont structuré leurs projets et présenté leurs avancées aux mentors.',
  '2026-01-15T09:00:00Z',
  'Nyiragongo Hub',
  'Baudouin Augustin',
  40,
  NULL,
  false,
  'https://forum.cardano.org/t/jour-3-du-hackathon-local-cats-2026-consolidation-technique-et-structuration-des-equipes/151107?u=baudouin_augustin'
);
