-- ==========================================
-- TEAM MEMBERS TABLE UPDATE
-- ==========================================

-- 1. Add missing columns to existing team_members table
ALTER TABLE team_members 
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS order_index INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- 2. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_team_members_active ON team_members(is_active);
CREATE INDEX IF NOT EXISTS idx_team_members_order ON team_members(order_index);
CREATE INDEX IF NOT EXISTS idx_team_members_created_at ON team_members(created_at);

-- 3. Create updated_at trigger if not exists
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_team_members_updated_at ON team_members;
CREATE TRIGGER update_team_members_updated_at 
    BEFORE UPDATE ON team_members 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 4. Update existing records to have default values
UPDATE team_members 
SET is_active = true, order_index = 1
WHERE is_active IS NULL OR order_index IS NULL;

-- 5. Create or replace policies for team_members table
DROP POLICY IF EXISTS "Allow authenticated users to view team members" ON team_members;
DROP POLICY IF EXISTS "Allow public access to view active team members" ON team_members;
DROP POLICY IF EXISTS "Allow authenticated users to insert team members" ON team_members;
DROP POLICY IF EXISTS "Allow authenticated users to update team members" ON team_members;
DROP POLICY IF EXISTS "Allow authenticated users to delete team members" ON team_members;

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

-- 6. Grant necessary permissions
GRANT ALL ON team_members TO authenticated;
GRANT SELECT ON team_members TO anon;

-- 7. Verification queries
SELECT 'Table updated successfully' as status FROM information_schema.tables WHERE table_name = 'team_members';
SELECT 'Columns added successfully' as status FROM information_schema.columns WHERE table_name = 'team_members' AND column_name IN ('is_active', 'order_index', 'updated_at');
SELECT 'Policies created successfully' as status FROM pg_policies WHERE tablename = 'team_members';

-- 8. Sample data (optional - remove if not needed)
INSERT INTO team_members (name, role, bio, email, linkedin_url, twitter_url, order_index)
VALUES 
    ('Jacques Masuruku', 'Fondateur & Directeur', 'Passionne par la technologie et le developpement durable, je dirige cette initiative avec pour mission de transformer notre communaute.', 'jacques@cardanonyiragongo.org', 'https://linkedin.com/in/jacquesmasuruku', 'https://twitter.com/jacquesmasuruku', 1),
    ('Marie Baudouin', 'Co-fondatrice & Responsable Communication', 'Expertise en communication et developpement communitaire, je m''occupe de la strategie de communication et des partenariats.', 'marie@cardanonyiragongo.org', 'https://linkedin.com/in/mariebaudouin', 'https://twitter.com/mariebaudouin', 2)
ON CONFLICT DO NOTHING;
