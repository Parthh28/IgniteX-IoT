import crypto from 'crypto';
import { cookies } from 'next/headers';
import { MemberSocialLinks, TeamMember } from '@/lib/types';

const DEMO_MEMBER_COOKIE = 'ignitex_demo_member_session';
const DEMO_MAX_AGE = 60 * 60 * 12;

export const DEV_DUMMY_MEMBER_EMAIL = 'member@ignitexiot.edu';
export const DEV_DUMMY_MEMBER_PASSWORD = 'Member@2026';

// In-memory demo profile store for local dev preview
let demoMemberProfile: TeamMember = {
  id: 'demo-member-1',
  name: 'Aarav Sharma',
  role: 'President & Club Lead',
  bio: 'Club lead orchestrating technical vision, firmware architecture, robotics sprints, and high-impact student IoT projects.',
  photo_url: null,
  is_faculty: false,
  order_index: 1,
  member_email: DEV_DUMMY_MEMBER_EMAIL,
  course: 'B.Tech Computer Science · 4th Year',
  projects: ['Autonomous Rover Telemetry', 'Edge AI Vision Node'],
  social_links: {
    linkedin: 'https://linkedin.com',
    instagram: 'https://instagram.com',
    github: 'https://github.com',
    email: DEV_DUMMY_MEMBER_EMAIL,
  },
};

export function isDemoMemberEnabled(): boolean {
  return process.env.NODE_ENV !== 'production';
}

function safeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a, 'utf8');
  const bufB = Buffer.from(b, 'utf8');
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

export function verifyDemoMemberCredentials(
  email: string,
  password: string
): boolean {
  if (!isDemoMemberEnabled()) return false;
  return (
    safeEqual(DEV_DUMMY_MEMBER_EMAIL, email.trim().toLowerCase()) &&
    safeEqual(DEV_DUMMY_MEMBER_PASSWORD, password)
  );
}

export async function createDemoMemberCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(DEMO_MEMBER_COOKIE, 'active', {
    httpOnly: true,
    sameSite: 'lax',
    secure: false,
    path: '/',
    maxAge: DEMO_MAX_AGE,
  });
}

export async function clearDemoMemberCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(DEMO_MEMBER_COOKIE);
}

export async function isDemoMemberAuthenticated(): Promise<boolean> {
  if (!isDemoMemberEnabled()) return false;
  const cookieStore = await cookies();
  return cookieStore.get(DEMO_MEMBER_COOKIE)?.value === 'active';
}

export function getDemoMemberProfile(): TeamMember {
  return demoMemberProfile;
}

export function updateDemoMemberProfile(updates: {
  bio: string | null;
  projects: string[] | null;
  social_links: MemberSocialLinks;
}): TeamMember {
  demoMemberProfile = {
    ...demoMemberProfile,
    bio: updates.bio,
    projects: updates.projects,
    social_links: updates.social_links,
  };
  return demoMemberProfile;
}

