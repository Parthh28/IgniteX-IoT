-- IgniteX IoT Club Database Schema & Seed Data
-- Enables uuid generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==========================================
-- 1. Table Definitions
-- ==========================================

-- Table: events
CREATE TABLE IF NOT EXISTS events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    date TEXT NOT NULL,
    time TEXT,
    venue TEXT NOT NULL,
    mode TEXT NOT NULL CHECK (mode IN ('offline', 'online')),
    tag TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('open', 'closed', 'upcoming')),
    registration_link TEXT,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL
);

-- Table: registrations
CREATE TABLE IF NOT EXISTS registrations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    roll_number TEXT NOT NULL,
    phone TEXT,
    branch TEXT,
    semester TEXT,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL,
    CONSTRAINT unique_event_registration UNIQUE (event_id, email)
);

-- Table: contact_submissions
CREATE TABLE IF NOT EXISTS contact_submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL
);

-- Table: team_members (with self-referencing parent_id for sub-teams & member portal link)
CREATE TABLE IF NOT EXISTS team_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    bio TEXT,
    photo_url TEXT,
    is_faculty BOOLEAN DEFAULT FALSE NOT NULL,
    order_index INTEGER DEFAULT 0 NOT NULL,
    parent_id UUID REFERENCES team_members(id) ON DELETE SET NULL,
    auth_user_id UUID UNIQUE,
    member_email TEXT UNIQUE,
    course TEXT,
    projects TEXT[],
    social_links JSONB,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL
);

-- Safe migration for existing databases
ALTER TABLE team_members ADD COLUMN IF NOT EXISTS auth_user_id UUID UNIQUE;
ALTER TABLE team_members ADD COLUMN IF NOT EXISTS member_email TEXT UNIQUE;
ALTER TABLE team_members ADD COLUMN IF NOT EXISTS course TEXT;
ALTER TABLE team_members ADD COLUMN IF NOT EXISTS projects TEXT[];
ALTER TABLE team_members ADD COLUMN IF NOT EXISTS social_links JSONB;

-- Table: event_photos (Event Gallery managed by Admin)
CREATE TABLE IF NOT EXISTS event_photos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    event_name TEXT,
    image_url TEXT NOT NULL,
    caption TEXT,
    taken_date TEXT,
    order_index INTEGER DEFAULT 0 NOT NULL,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL
);

-- ==========================================
-- 2. Row Level Security (RLS) — Zero Service-Key Setup
-- ==========================================
-- Three access tiers enforced directly by PostgreSQL:
--   1. Public visitors  : Read events & team_members; Insert registrations & contact_submissions
--   2. Club Members     : Update ONLY their own row in team_members (matched by auth_user_id or member_email)
--   3. Club Admin       : Full SELECT / INSERT / UPDATE / DELETE on all 4 tables
--
-- Change the email below if you use a different Admin email in Supabase Auth.
CREATE OR REPLACE FUNCTION public.is_ignitex_admin()
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
AS $$
  SELECT lower(coalesce(auth.jwt() ->> 'email', '')) = 'revaiotclub@gmail.com';
$$;

-- Base SQL table privileges (actual row access is strictly enforced by RLS below)
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.is_ignitex_admin() TO anon, authenticated;

GRANT SELECT ON TABLE events, team_members, event_photos TO anon;
GRANT INSERT ON TABLE registrations, contact_submissions TO anon;

GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE events, team_members, event_photos, registrations, contact_submissions TO authenticated;

ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_photos ENABLE ROW LEVEL SECURITY;

-- ---- EVENTS ----
DROP POLICY IF EXISTS "Allow public read access to events" ON events;
CREATE POLICY "Allow public read access to events"
    ON events FOR SELECT
    USING (true);

DROP POLICY IF EXISTS "Allow admin full access to events" ON events;
CREATE POLICY "Allow admin full access to events"
    ON events FOR ALL
    TO authenticated
    USING (public.is_ignitex_admin())
    WITH CHECK (public.is_ignitex_admin());

-- ---- TEAM MEMBERS ----
DROP POLICY IF EXISTS "Allow public read access to team_members" ON team_members;
CREATE POLICY "Allow public read access to team_members"
    ON team_members FOR SELECT
    USING (true);

DROP POLICY IF EXISTS "Allow admin full access to team_members" ON team_members;
CREATE POLICY "Allow admin full access to team_members"
    ON team_members FOR ALL
    TO authenticated
    USING (public.is_ignitex_admin())
    WITH CHECK (public.is_ignitex_admin());

DROP POLICY IF EXISTS "Allow member to update own profile" ON team_members;
CREATE POLICY "Allow member to update own profile"
    ON team_members FOR UPDATE
    TO authenticated
    USING (
      auth.uid() = auth_user_id
      OR lower(coalesce(member_email, '')) = lower(coalesce(auth.jwt() ->> 'email', ''))
    )
    WITH CHECK (
      auth.uid() = auth_user_id
      OR lower(coalesce(member_email, '')) = lower(coalesce(auth.jwt() ->> 'email', ''))
    );

-- ---- REGISTRATIONS (Strict PII Protection) ----
DROP POLICY IF EXISTS "Allow public read access to registrations" ON registrations;
DROP POLICY IF EXISTS "Allow public insert to registrations" ON registrations;
CREATE POLICY "Allow public insert to registrations"
    ON registrations FOR INSERT
    WITH CHECK (true);

DROP POLICY IF EXISTS "Allow admin full access to registrations" ON registrations;
CREATE POLICY "Allow admin full access to registrations"
    ON registrations FOR ALL
    TO authenticated
    USING (public.is_ignitex_admin())
    WITH CHECK (public.is_ignitex_admin());

-- ---- CONTACT SUBMISSIONS (Strict PII Protection) ----
DROP POLICY IF EXISTS "Allow public read access to contact_submissions" ON contact_submissions;
DROP POLICY IF EXISTS "Allow public insert to contact_submissions" ON contact_submissions;
CREATE POLICY "Allow public insert to contact_submissions"
    ON contact_submissions FOR INSERT
    WITH CHECK (true);

DROP POLICY IF EXISTS "Allow admin full access to contact_submissions" ON contact_submissions;
CREATE POLICY "Allow admin full access to contact_submissions"
    ON contact_submissions FOR ALL
    TO authenticated
    USING (public.is_ignitex_admin())
    WITH CHECK (public.is_ignitex_admin());

-- ---- EVENT PHOTOS (Public Gallery Read, Admin Write) ----
DROP POLICY IF EXISTS "Allow public read access to event_photos" ON event_photos;
CREATE POLICY "Allow public read access to event_photos"
    ON event_photos FOR SELECT
    USING (true);

DROP POLICY IF EXISTS "Allow admin full access to event_photos" ON event_photos;
CREATE POLICY "Allow admin full access to event_photos"
    ON event_photos FOR ALL
    TO authenticated
    USING (public.is_ignitex_admin())
    WITH CHECK (public.is_ignitex_admin());

-- ==========================================
-- 3. Seed Data
-- ==========================================
-- Events and team members are managed dynamically via /admin (no mock data seeded).

-- ==========================================
-- 4. Supabase Storage Bucket for Member Photos
-- ==========================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('member-photos', 'member-photos', true)
ON CONFLICT (id) DO UPDATE SET public = true;

DROP POLICY IF EXISTS "Public read access to member photos" ON storage.objects;
CREATE POLICY "Public read access to member photos"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'member-photos');

DROP POLICY IF EXISTS "Admin upload member photos" ON storage.objects;
CREATE POLICY "Admin upload member photos"
    ON storage.objects FOR INSERT
    WITH CHECK (bucket_id = 'member-photos' AND public.is_ignitex_admin());

DROP POLICY IF EXISTS "Admin update member photos" ON storage.objects;
CREATE POLICY "Admin update member photos"
    ON storage.objects FOR UPDATE
    USING (bucket_id = 'member-photos' AND public.is_ignitex_admin());

DROP POLICY IF EXISTS "Admin delete member photos" ON storage.objects;
CREATE POLICY "Admin delete member photos"
    ON storage.objects FOR DELETE
    USING (bucket_id = 'member-photos' AND public.is_ignitex_admin());
