'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import {
  clearDemoAdminCookie,
  createDemoAdminCookie,
  getAdminEmail,
  verifyDevDummyAdmin,
} from '@/lib/admin-auth';
import {
  clearDemoMemberCookie,
  createDemoMemberCookie,
  isDemoMemberAuthenticated,
  updateDemoMemberProfile,
  verifyDemoMemberCredentials,
} from '@/lib/member-demo';
import { createClient, isSupabaseConfigured } from '@/lib/supabase/server';
import { ActionResponse, MemberSocialLinks } from '@/lib/types';

const MAX_ATTEMPTS = 6;
const WINDOW_MS = 5 * 60 * 1000;
let failedTimestamps: number[] = [];

function isRateLimited(): boolean {
  if (process.env.NODE_ENV !== 'production') return false;
  const cutoff = Date.now() - WINDOW_MS;
  failedTimestamps = failedTimestamps.filter((ts) => ts > cutoff);
  return failedTimestamps.length >= MAX_ATTEMPTS;
}

function validateOptionalUrl(
  raw: string | null,
  label: string
): { ok: true; value: string | null } | { ok: false; error: string } {
  if (!raw) return { ok: true, value: null };
  try {
    const parsed = new URL(raw);
    if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') {
      return { ok: false, error: `${label} must start with https://` };
    }
    return { ok: true, value: parsed.toString() };
  } catch {
    return { ok: false, error: `${label} must be a valid URL.` };
  }
}

export async function signInAction(
  _prevState: ActionResponse | null,
  formData: FormData
): Promise<ActionResponse> {
  if (isRateLimited()) {
    return {
      success: false,
      message: 'Too many failed sign-in attempts. Please wait 5 minutes and try again.',
      error: 'Rate limited',
    };
  }

  const email = (formData.get('email') as string)?.trim().toLowerCase() || '';
  const password = (formData.get('password') as string) || '';

  if (!email || !password) {
    return {
      success: false,
      message: 'Please enter both your email and password.',
      error: 'Missing credentials',
    };
  }

  // 1. Real Supabase Auth sign-in (works for BOTH Admin & Members via Postgres RLS)
  if (isSupabaseConfigured()) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (!error && data.user) {
      failedTimestamps = [];
      await clearDemoAdminCookie();
      await clearDemoMemberCookie();
      revalidatePath('/', 'layout');
      if (data.user.email?.toLowerCase() === getAdminEmail()) {
        redirect('/admin');
      }
      redirect('/account');
    }
  }

  // 2. Local development dummy accounts (disabled automatically in production)
  if (verifyDevDummyAdmin(email, password)) {
    failedTimestamps = [];
    await clearDemoMemberCookie();
    await createDemoAdminCookie();
    revalidatePath('/', 'layout');
    redirect('/admin');
  }

  if (verifyDemoMemberCredentials(email, password)) {
    failedTimestamps = [];
    await clearDemoAdminCookie();
    await createDemoMemberCookie();
    revalidatePath('/', 'layout');
    redirect('/account');
  }

  failedTimestamps.push(Date.now());
  return {
    success: false,
    message: 'Invalid email or password.',
    error: 'Invalid credentials',
  };
}

export async function requestPasswordResetAction(
  _prevState: ActionResponse | null,
  formData: FormData
): Promise<ActionResponse> {
  const email = (formData.get('email') as string)?.trim().toLowerCase() || '';
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!email || !emailRegex.test(email)) {
    return {
      success: false,
      message: 'Please enter a valid email address.',
      error: 'Invalid email',
    };
  }

  if (!isSupabaseConfigured()) {
    return {
      success: false,
      message:
        'Password reset emails require Supabase to be connected. Contact the club admin to reset your password.',
      error: 'Supabase not configured',
    };
  }

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, '') ||
    'http://localhost:3000';

  const supabase = await createClient();
  await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${siteUrl}/account`,
  });

  return {
    success: true,
    message:
      'If an account exists for that email, a password reset link has been sent.',
  };
}

export async function memberSignOutAction(): Promise<void> {
  await clearDemoMemberCookie();
  if (isSupabaseConfigured()) {
    const supabase = await createClient();
    await supabase.auth.signOut();
  }
  revalidatePath('/', 'layout');
  redirect('/login');
}

/**
 * Allows a signed-in club member to update ONLY their About (bio), Projects,
 * and Social Links using their own Supabase Auth JWT under Postgres RLS (zero service key).
 */
export async function updateMemberProfileAction(
  _prevState: ActionResponse | null,
  formData: FormData
): Promise<ActionResponse> {
  const isDemoMember = await isDemoMemberAuthenticated();

  if (!isDemoMember && !isSupabaseConfigured()) {
    return {
      success: false,
      message: 'Supabase is not configured to save profile changes.',
      error: 'Supabase not configured',
    };
  }

  const bio = (formData.get('bio') as string)?.trim() || null;
  if (bio && bio.length > 600) {
    return {
      success: false,
      message: 'About section must be 600 characters or fewer.',
      error: 'Bio too long',
    };
  }

  const projectsRaw = (formData.get('projects_text') as string) || '';
  const projects = projectsRaw
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .slice(0, 6);

  const linkedinCheck = validateOptionalUrl(
    (formData.get('linkedin') as string)?.trim() || null,
    'LinkedIn URL'
  );
  if (!linkedinCheck.ok) {
    return { success: false, message: linkedinCheck.error, error: linkedinCheck.error };
  }

  const instagramCheck = validateOptionalUrl(
    (formData.get('instagram') as string)?.trim() || null,
    'Instagram URL'
  );
  if (!instagramCheck.ok) {
    return { success: false, message: instagramCheck.error, error: instagramCheck.error };
  }

  const githubCheck = validateOptionalUrl(
    (formData.get('github') as string)?.trim() || null,
    'GitHub URL'
  );
  if (!githubCheck.ok) {
    return { success: false, message: githubCheck.error, error: githubCheck.error };
  }

  const publicEmail =
    (formData.get('public_email') as string)?.trim().toLowerCase() || null;
  if (publicEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(publicEmail)) {
    return {
      success: false,
      message: 'Public contact email must be a valid email address.',
      error: 'Invalid public email',
    };
  }

  const social_links: MemberSocialLinks = {
    linkedin: linkedinCheck.value,
    instagram: instagramCheck.value,
    github: githubCheck.value,
    email: publicEmail,
  };

  if (isDemoMember) {
    updateDemoMemberProfile({
      bio,
      projects: projects.length > 0 ? projects : null,
      social_links,
    });
    revalidatePath('/account');
    return {
      success: true,
      message: 'Demo member profile updated! (Local preview session)',
    };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !user.email) {
    return {
      success: false,
      message: 'Please sign in to edit your profile.',
      error: 'Unauthorized',
    };
  }

  const { data: memberRow } = await supabase
    .from('team_members')
    .select('id')
    .or(`auth_user_id.eq.${user.id},member_email.eq.${user.email.toLowerCase()}`)
    .maybeSingle();

  if (!memberRow) {
    return {
      success: false,
      message:
        'Your login is not linked to a public team profile yet. Ask the club admin to add your email to your Team roster entry.',
      error: 'Profile not found',
    };
  }

  const { error: updateErr } = await supabase
    .from('team_members')
    .update({
      bio,
      projects: projects.length > 0 ? projects : null,
      social_links,
      auth_user_id: user.id,
    })
    .eq('id', memberRow.id);

  if (updateErr) {
    return {
      success: false,
      message: `Could not update profile: ${updateErr.message}`,
      error: updateErr.message,
    };
  }

  revalidatePath('/team');
  revalidatePath('/account');
  return {
    success: true,
    message: 'Profile saved! Your About, Projects, and Socials are now live on the Team page.',
  };
}

export async function changeMemberPasswordAction(
  _prevState: ActionResponse | null,
  formData: FormData
): Promise<ActionResponse> {
  if (await isDemoMemberAuthenticated()) {
    return {
      success: true,
      message:
        'Demo member password check passed. Real member passwords are updated in Supabase Auth once provisioned.',
    };
  }

  if (!isSupabaseConfigured()) {
    return {
      success: false,
      message: 'Supabase Auth is not connected.',
      error: 'Supabase not configured',
    };
  }

  const newPassword = (formData.get('new_password') as string) || '';
  const confirmPassword = (formData.get('confirm_password') as string) || '';

  if (newPassword.length < 8) {
    return {
      success: false,
      message: 'New password must be at least 8 characters long.',
      error: 'Password too short',
    };
  }

  if (newPassword !== confirmPassword) {
    return {
      success: false,
      message: 'Passwords do not match.',
      error: 'Password mismatch',
    };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      success: false,
      message: 'Please sign in first.',
      error: 'Unauthorized',
    };
  }

  const { error } = await supabase.auth.updateUser({ password: newPassword });
  if (error) {
    return {
      success: false,
      message: error.message || 'Could not update password.',
      error: error.message,
    };
  }

  return {
    success: true,
    message: 'Your password has been updated successfully.',
  };
}
