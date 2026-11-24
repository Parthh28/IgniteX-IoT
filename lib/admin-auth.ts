import crypto from 'crypto';
import { cookies } from 'next/headers';
import { createClient, isSupabaseConfigured } from '@/lib/supabase/server';

const DEMO_ADMIN_COOKIE = 'ignitex_demo_admin_session';
const DEMO_MAX_AGE = 60 * 60 * 12;

// Default admin email (and local dev dummy fallback, disabled in production)
const DEV_DUMMY_ADMIN_EMAIL = 'revaiotclub@gmail.com';
const DEV_DUMMY_ADMIN_PASSWORD = 'IgniteX@2026';

export function getAdminEmail(): string {
  return (
    process.env.ADMIN_EMAIL?.trim().toLowerCase() || DEV_DUMMY_ADMIN_EMAIL
  );
}

export function isUsingDummyAdmin(): boolean {
  return process.env.NODE_ENV !== 'production';
}

function safeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a, 'utf8');
  const bufB = Buffer.from(b, 'utf8');
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

export function verifyDevDummyAdmin(email: string, password: string): boolean {
  if (process.env.NODE_ENV === 'production') return false;
  return (
    safeEqual(getAdminEmail(), email.trim().toLowerCase()) &&
    safeEqual(DEV_DUMMY_ADMIN_PASSWORD, password)
  );
}

export async function createDemoAdminCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(DEMO_ADMIN_COOKIE, 'active', {
    httpOnly: true,
    sameSite: 'lax',
    secure: false,
    path: '/',
    maxAge: DEMO_MAX_AGE,
  });
}

export async function clearDemoAdminCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(DEMO_ADMIN_COOKIE);
}

/**
 * Verifies whether the current request is from the Admin:
 * 1. In production & dev: a real signed-in Supabase Auth user whose email matches ADMIN_EMAIL.
 * 2. In local dev only: the dummy admin session cookie.
 */
export async function isAdminAuthenticated(): Promise<boolean> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = await createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user?.email && safeEqual(getAdminEmail(), user.email.toLowerCase())) {
        return true;
      }
    } catch {
      // ignore and fall through
    }
  }

  if (process.env.NODE_ENV !== 'production') {
    const cookieStore = await cookies();
    if (cookieStore.get(DEMO_ADMIN_COOKIE)?.value === 'active') {
      return true;
    }
  }

  return false;
}

/** True only when signed into a real Supabase Auth Admin session (can perform RLS writes). */
export async function isSupabaseAdminSession(): Promise<boolean> {
  if (!isSupabaseConfigured()) return false;
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    return Boolean(
      user?.email && safeEqual(getAdminEmail(), user.email.toLowerCase())
    );
  } catch {
    return false;
  }
}
