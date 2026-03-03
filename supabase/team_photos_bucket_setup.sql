-- ==========================================
-- TEAM PHOTOS BUCKET SETUP
-- ==========================================

-- 1. Create the team-photos bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'team-photos',
    'team-photos',
    true,
    5242880, -- 5MB limit
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    public = EXCLUDED.public,
    file_size_limit = EXCLUDED.file_size_limit,
    allowed_mime_types = EXCLUDED.allowed_mime_types;

-- 2. Create storage policies for team-photos bucket

-- Policy: Allow authenticated users to upload team photos
CREATE POLICY "Allow authenticated users to upload team photos" ON storage.objects
FOR INSERT WITH CHECK (
    bucket_id = 'team-photos' AND 
    auth.role() = 'authenticated'
);

-- Policy: Allow authenticated users to update their own team photos
CREATE POLICY "Allow authenticated users to update team photos" ON storage.objects
FOR UPDATE USING (
    bucket_id = 'team-photos' AND 
    auth.role() = 'authenticated'
);

-- Policy: Allow public access to view team photos
CREATE POLICY "Allow public access to view team photos" ON storage.objects
FOR SELECT USING (
    bucket_id = 'team-photos'
);

-- Policy: Allow authenticated users to delete team photos
CREATE POLICY "Allow authenticated users to delete team photos" ON storage.objects
FOR DELETE USING (
    bucket_id = 'team-photos' AND 
    auth.role() = 'authenticated'
);

-- 3. Create team_members table if not exists
CREATE TABLE IF NOT EXISTS team_members (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    bio TEXT,
    email TEXT,
    photo_url TEXT,
    linkedin_url TEXT,
    twitter_url TEXT,
    github_url TEXT,
    website_url TEXT,
    is_active BOOLEAN DEFAULT true,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Enable RLS on team_members table
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;

-- 5. Create policies for team_members table

-- Policy: Allow authenticated users to view team members
CREATE POLICY "Allow authenticated users to view team members" ON team_members
FOR SELECT USING (auth.role() = 'authenticated');

-- Policy: Allow public access to view active team members
CREATE POLICY "Allow public access to view active team members" ON team_members
FOR SELECT USING (is_active = true);

-- Policy: Allow authenticated users to insert team members
CREATE POLICY "Allow authenticated users to insert team members" ON team_members
FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Policy: Allow authenticated users to update team members
CREATE POLICY "Allow authenticated users to update team members" ON team_members
FOR UPDATE USING (auth.role() = 'authenticated');

-- Policy: Allow authenticated users to delete team members
CREATE POLICY "Allow authenticated users to delete team members" ON team_members
FOR DELETE USING (auth.role() = 'authenticated');

-- 6. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_team_members_active ON team_members(is_active);
CREATE INDEX IF NOT EXISTS idx_team_members_order ON team_members(order_index);
CREATE INDEX IF NOT EXISTS idx_team_members_created_at ON team_members(created_at);

-- 7. Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_team_members_updated_at 
    BEFORE UPDATE ON team_members 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 8. Grant necessary permissions
GRANT ALL ON storage.buckets TO authenticated;
GRANT ALL ON storage.objects TO authenticated;
GRANT ALL ON team_members TO authenticated;
GRANT SELECT ON team_members TO anon;

-- 9. Verification queries
SELECT 'Bucket created successfully' as status FROM storage.buckets WHERE id = 'team-photos';
SELECT 'Policies created successfully' as status FROM pg_policies WHERE table_name = 'team_members';
SELECT 'Table created successfully' as status FROM information_schema.tables WHERE table_name = 'team_members';

-- 10. Sample data (optional - remove if not needed)
INSERT INTO team_members (name, role, bio, email, linkedin_url, twitter_url, order_index)
VALUES 
    ('Jacques Masuruku', 'Fondateur & Directeur', 'Passionne par la technologie et le developpement durable, je dirige cette initiative avec pour mission de transformer notre communaute.', 'jacques@cardanonyiragongo.org', 'https://linkedin.com/in/jacquesmasuruku', 'https://twitter.com/jacquesmasuruku', 1),
    ('Marie Baudouin', 'Co-fondatrice & Responsable Communication', 'Expertise en communication et developpement communitaire, je m''occupe de la strategie de communication et des partenariats.', 'marie@cardanonyiragongo.org', 'https://linkedin.com/in/mariebaudouin', 'https://twitter.com/mariebaudouin', 2)
ON CONFLICT DO NOTHING;
