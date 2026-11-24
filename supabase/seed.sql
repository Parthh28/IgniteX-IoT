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

-- Seed Events
INSERT INTO events (id, title, description, date, time, venue, mode, tag, status, registration_link)
VALUES
    (
        '11111111-1111-1111-1111-111111111101',
        'IoT & Robotics Sprint 2026',
        'Intensive hands-on boot camp building automated robotic rovers with IoT telemetry, ESP32 microcontrollers, and cloud dashboards.',
        '15 Nov 2026',
        '10:00 AM',
        'IoT Innovation Lab (Room 302)',
        'offline',
        'Workshop',
        'open',
        NULL
    ),
    (
        '11111111-1111-1111-1111-111111111102',
        'Edge AI & Smart Automation Hackathon',
        'Compete with high-performing engineering teams to construct connected AI systems, computer vision on microprocessors, and smart city devices.',
        '05 Dec 2026',
        '09:00 AM',
        'Main Campus Auditorium',
        'offline',
        'Hackathon',
        'upcoming',
        NULL
    ),
    (
        '11111111-1111-1111-1111-111111111103',
        'Future of Industrial IoT & Edge Cloud',
        'Keynote session with industry pioneers covering MQTT protocols, SCADA integrations, and edge sensor analytics at industrial scale.',
        '20 Dec 2026',
        '04:00 PM',
        'Google Meet & Virtual Hub',
        'online',
        'Seminar',
        'open',
        NULL
    ),
    (
        '11111111-1111-1111-1111-111111111104',
        'Intro to Microcontrollers & ESP32 Basics',
        'Hands-on introductory workshop where 80+ students built their very first connected weather sensor station.',
        '15 Jan 2026',
        '02:00 PM',
        'Hardware Lab 2',
        'offline',
        'Workshop',
        'closed',
        NULL
    ),
    (
        '11111111-1111-1111-1111-111111111105',
        'IgniteHacks 2025: Hardware Edition',
        '24-hour national hackathon featuring 35 hardware prototypes tackling real agricultural and healthcare challenges.',
        '20 Nov 2025',
        '09:00 AM',
        'Central Auditorium',
        'offline',
        'Hackathon',
        'closed',
        NULL
    ),
    (
        '11111111-1111-1111-1111-111111111106',
        'TinyML & Embedded Neural Networks',
        'Deep dive lecture exploring TensorFlow Lite for microcontrollers with live edge speech-recognition demos.',
        '10 Oct 2025',
        '03:30 PM',
        'Seminar Hall A',
        'offline',
        'Seminar',
        'closed',
        NULL
    )
ON CONFLICT (id) DO NOTHING;

-- Seed Team Members
-- Top-level Primary Members (Faculty & Student Heads)
INSERT INTO team_members (id, name, role, bio, photo_url, is_faculty, order_index, parent_id)
VALUES
    (
        '22222222-2222-2222-2222-222222222201',
        'Aashita Ma''am',
        'Faculty Co-ordinator',
        'Assistant Professor and mentor guiding IgniteX research initiatives, academic publications, and university hardware grants.',
        NULL,
        TRUE,
        1,
        NULL
    ),
    (
        '22222222-2222-2222-2222-222222222202',
        'Sneha Ma''am',
        'Faculty Co-ordinator',
        'Faculty advisor steering technical governance, department partnerships, and industrial incubation opportunities.',
        NULL,
        TRUE,
        2,
        NULL
    ),
    (
        '22222222-2222-2222-2222-222222222203',
        'Parth',
        'President',
        'Club lead orchestrating technical vision, firmware architecture, robotics sprints, and high-impact student projects.',
        NULL,
        FALSE,
        3,
        NULL
    ),
    (
        '22222222-2222-2222-2222-222222222204',
        'Shreya',
        'Vice-President',
        'Operations leader overseeing event management, inter-college hackathon collaborations, and internal workshops.',
        NULL,
        FALSE,
        4,
        NULL
    ),
    (
        '22222222-2222-2222-2222-222222222205',
        'Suraj',
        'Marketing Head',
        'Brand strategist driving community outreach, sponsor acquisition, social growth, and campus tech ambassadors.',
        NULL,
        FALSE,
        5,
        NULL
    ),
    (
        '22222222-2222-2222-2222-222222222206',
        'Sam',
        'Media Head',
        'Creative director crafting visual identity, digital motion graphics, event photography, and brand media.',
        NULL,
        FALSE,
        6,
        NULL
    )
ON CONFLICT (id) DO NOTHING;

-- Seed Sub-team Coordinators (linked to respective heads via parent_id)
INSERT INTO team_members (id, name, role, bio, photo_url, is_faculty, order_index, parent_id)
VALUES
    -- Under Parth (Core Team)
    (
        '33333333-3333-3333-3333-333333333301',
        'Rohan Sharma',
        'Core Tech Lead',
        'Specializing in embedded C++, FreeRTOS, and MQTT communication pipelines.',
        NULL,
        FALSE,
        1,
        '22222222-2222-2222-2222-222222222203'
    ),
    (
        '33333333-3333-3333-3333-333333333302',
        'Ananya Verma',
        'Embedded Systems Lead',
        'Focusing on custom PCB routing, sensor calibration, and STM32 architectures.',
        NULL,
        FALSE,
        2,
        '22222222-2222-2222-2222-222222222203'
    ),
    -- Under Shreya (Event Team)
    (
        '33333333-3333-3333-3333-333333333303',
        'Aryan Patel',
        'Event Coordinator',
        'Manages workshop logistics, participant registrations, and hardware component kits.',
        NULL,
        FALSE,
        1,
        '22222222-2222-2222-2222-222222222204'
    ),
    (
        '33333333-3333-3333-3333-333333333304',
        'Devansh Gupta',
        'Logistics & Operations',
        'Coordinates venue setups, lab hardware inventories, and vendor relations.',
        NULL,
        FALSE,
        2,
        '22222222-2222-2222-2222-222222222204'
    ),
    -- Under Suraj (Marketing Team)
    (
        '33333333-3333-3333-3333-333333333305',
        'Meera Nair',
        'Social Media Lead',
        'Drives digital engagements, technical reels, and community updates across channels.',
        NULL,
        FALSE,
        1,
        '22222222-2222-2222-2222-222222222205'
    ),
    (
        '33333333-3333-3333-3333-333333333306',
        'Kabir Singh',
        'PR & Outreach',
        'Connects student builders with startup accelerators and corporate partners.',
        NULL,
        FALSE,
        2,
        '22222222-2222-2222-2222-222222222205'
    ),
    -- Under Sam (Media Team)
    (
        '33333333-3333-3333-3333-333333333307',
        'Tanya Roy',
        'Creative & UI Lead',
        'Designs event banners, club branding assets, and digital illustrations.',
        NULL,
        FALSE,
        1,
        '22222222-2222-2222-2222-222222222206'
    ),
    (
        '33333333-3333-3333-3333-333333333308',
        'Aman Joshi',
        'Videography & Media',
        'Directs technical documentaries, recap aftermovies, and project spotlight reels.',
        NULL,
        FALSE,
        2,
        '22222222-2222-2222-2222-222222222206'
    )
ON CONFLICT (id) DO NOTHING;
