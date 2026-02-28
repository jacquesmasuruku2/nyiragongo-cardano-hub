-- Team members table
CREATE TABLE public.team_members (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  bio TEXT NOT NULL,
  email TEXT,
  photo_url TEXT,
  linkedin_url TEXT,
  twitter_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Team members are viewable by everyone"
ON public.team_members FOR SELECT USING (true);

-- Only admins can insert/update/delete
CREATE POLICY "Only admins can manage team members"
ON public.team_members FOR ALL USING (
  auth.uid() IN (
    SELECT user_id FROM public.user_roles WHERE role = 'admin'
  )
);

-- Articles table
CREATE TABLE public.articles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL,
  author TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'general',
  image_url TEXT,
  published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;

-- Public read access for published articles
CREATE POLICY "Published articles are viewable by everyone"
ON public.articles FOR SELECT USING (published = true);

-- Only admins can manage articles
CREATE POLICY "Only admins can manage articles"
ON public.articles FOR ALL USING (
  auth.uid() IN (
    SELECT user_id FROM public.user_roles WHERE role = 'admin'
  )
);

-- Storage policies for team photos
INSERT INTO public.storage.policies (name, definition, role_id) VALUES
(
  'Team photos are publicly accessible',
  'SELECT',
  'authenticated'
)
ON CONFLICT (name) DO UPDATE SET definition = EXCLUDED.definition, role_id = EXCLUDED.role_id;

-- Storage policies for blog images
INSERT INTO public.storage.policies (name, definition, role_id) VALUES
(
  'Blog images are publicly accessible',
  'SELECT',
  'authenticated'
)
ON CONFLICT (name) DO UPDATE SET definition = EXCLUDED.definition, role_id = EXCLUDED.role_id;
