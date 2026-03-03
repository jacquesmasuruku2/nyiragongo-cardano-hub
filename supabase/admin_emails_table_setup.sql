-- ==========================================
-- ADMIN EMAILS TABLE SETUP
-- ==========================================

-- 1. Create admin_emails table
CREATE TABLE IF NOT EXISTS admin_emails (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by TEXT,
    notes TEXT
);

-- 2. Enable RLS on admin_emails table
ALTER TABLE admin_emails ENABLE ROW LEVEL SECURITY;

-- 3. Create policies for admin_emails table

-- Policy: Allow authenticated users to view admin emails
CREATE POLICY "Allow authenticated users to view admin emails" ON admin_emails
FOR SELECT USING (auth.role() = 'authenticated');

-- Policy: Allow authenticated users to insert admin emails
CREATE POLICY "Allow authenticated users to insert admin emails" ON admin_emails
FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Policy: Allow authenticated users to update admin emails
CREATE POLICY "Allow authenticated users to update admin emails" ON admin_emails
FOR UPDATE USING (auth.role() = 'authenticated');

-- Policy: Allow authenticated users to delete admin emails
CREATE POLICY "Allow authenticated users to delete admin emails" ON admin_emails
FOR DELETE USING (auth.role() = 'authenticated');

-- 4. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_admin_emails_active ON admin_emails(is_active);
CREATE INDEX IF NOT EXISTS idx_admin_emails_email ON admin_emails(email);
CREATE INDEX IF NOT EXISTS idx_admin_emails_created_at ON admin_emails(created_at);

-- 5. Grant necessary permissions
GRANT ALL ON admin_emails TO authenticated;
GRANT SELECT ON admin_emails TO anon;

-- 6. Insert default admin emails
INSERT INTO admin_emails (email, created_by, notes)
VALUES 
    ('cardanonyiragongo@gmail.com', 'system', 'Admin principal - accès hardcoded'),
    ('jacques@cardanonyiragongo.org', 'system', 'Admin principal - accès email')
ON CONFLICT (email) DO NOTHING;

-- 7. Verification queries
SELECT 'Table created successfully' as status FROM information_schema.tables WHERE table_name = 'admin_emails';
SELECT 'Policies created successfully' as status FROM pg_policies WHERE tablename = 'admin_emails';
SELECT 'Default emails inserted successfully' as status FROM admin_emails WHERE email IN ('cardanonyiragongo@gmail.com', 'jacques@cardanonyiragongo.org');
