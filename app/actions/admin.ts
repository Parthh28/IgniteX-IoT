'use server';

import { revalidatePath } from 'next/cache';
import {
  clearDemoAdminCookie,
  createDemoAdminCookie,
  getAdminEmail,
  isSupabaseAdminSession,
  verifyDevDummyAdmin,
} from '@/lib/admin-auth';
import { createClient, isSupabaseConfigured } from '@/lib/supabase/server';
import { ActionResponse, EventMode, EventStatus } from '@/lib/types';

function revalidateAllSitePages() {
  revalidatePath('/');
  revalidatePath('/events');
  revalidatePath('/team');
  revalidatePath('/admin');
}

async function requireAdminAndDb() {
  if (!isSupabaseConfigured()) {
    return {
      ok: false as const,
      response: {
        success: false,
        message:
          'Supabase is not configured. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local.',
        error: 'Supabase not configured',
      },
    };
  }

  const isRealAdmin = await isSupabaseAdminSession();
  if (!isRealAdmin) {
    return {
      ok: false as const,
      response: {
        success: false,
        message:
          'Sign in with your real Supabase Admin account (created in Supabase Auth) to save database changes.',
        error: 'Unauthorized',
      },
    };
  }

  const db = await createClient();
  return { ok: true as const, db };
}

function validateOptionalHttpUrl(
  raw: string | null,
  fieldLabel: string
): { ok: true; value: string | null } | { ok: false; error: string } {
  if (!raw) return { ok: true, value: null };
  try {
    const parsed = new URL(raw);
    if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') {
      return {
        ok: false,
        error: `${fieldLabel} must start with https:// or http://.`,
      };
    }
    return { ok: true, value: parsed.toString() };
  } catch {
    return { ok: false, error: `${fieldLabel} must be a valid URL.` };
  }
}

export async function adminLogin(
  _prevState: ActionResponse | null,
  formData: FormData
): Promise<ActionResponse> {
  const email = (formData.get('email') as string)?.trim().toLowerCase() || '';
  const password = (formData.get('password') as string) || '';

  if (!email || !password) {
    return {
      success: false,
      message: 'Please enter your admin email and password.',
      error: 'Missing credentials',
    };
  }

  if (isSupabaseConfigured()) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (!error && data.user?.email?.toLowerCase() === getAdminEmail()) {
      await clearDemoAdminCookie();
      revalidatePath('/admin');
      return { success: true, message: 'Signed in to IgniteX Admin Console.' };
    }
    if (!error && data.user) {
      await supabase.auth.signOut();
      return {
        success: false,
        message: 'This account does not have Admin permissions.',
        error: 'Forbidden',
      };
    }
  }

  if (verifyDevDummyAdmin(email, password)) {
    await createDemoAdminCookie();
    revalidatePath('/admin');
    return { success: true, message: 'Signed in with local dev Admin preview.' };
  }

  return {
    success: false,
    message: 'Incorrect admin email or password.',
    error: 'Invalid credentials',
  };
}

export async function adminLogout(): Promise<void> {
  await clearDemoAdminCookie();
  if (isSupabaseConfigured()) {
    const supabase = await createClient();
    await supabase.auth.signOut();
  }
  revalidatePath('/', 'layout');
  revalidatePath('/admin');
}

function parseEventForm(formData: FormData) {
  const title = (formData.get('title') as string)?.trim() || '';
  const description = (formData.get('description') as string)?.trim() || '';
  const date = (formData.get('date') as string)?.trim() || '';
  const time = (formData.get('time') as string)?.trim() || null;
  const venue = (formData.get('venue') as string)?.trim() || '';
  const mode = ((formData.get('mode') as string)?.trim() || 'offline') as EventMode;
  const tag = (formData.get('tag') as string)?.trim() || 'Workshop';
  const status = ((formData.get('status') as string)?.trim() || 'upcoming') as EventStatus;
  const registration_link =
    (formData.get('registration_link') as string)?.trim() || null;

  return {
    title,
    description,
    date,
    time,
    venue,
    mode,
    tag,
    status,
    registration_link,
  };
}

export async function createEvent(
  _prevState: ActionResponse | null,
  formData: FormData
): Promise<ActionResponse> {
  const guard = await requireAdminAndDb();
  if (!guard.ok) return guard.response;

  const payload = parseEventForm(formData);
  if (!payload.title || !payload.description || !payload.date || !payload.venue) {
    return {
      success: false,
      message: 'Title, description, date, and venue are required.',
      error: 'Missing required fields',
    };
  }

  const linkCheck = validateOptionalHttpUrl(
    payload.registration_link,
    'Registration link'
  );
  if (!linkCheck.ok) {
    return { success: false, message: linkCheck.error, error: linkCheck.error };
  }
  payload.registration_link = linkCheck.value;

  const { error } = await guard.db.from('events').insert(payload);
  if (error) {
    return {
      success: false,
      message: `Failed to create event: ${error.message}`,
      error: error.message,
    };
  }

  revalidateAllSitePages();
  return { success: true, message: `Event "${payload.title}" created.` };
}

export async function updateEvent(
  _prevState: ActionResponse | null,
  formData: FormData
): Promise<ActionResponse> {
  const guard = await requireAdminAndDb();
  if (!guard.ok) return guard.response;

  const id = (formData.get('id') as string)?.trim();
  if (!id) {
    return { success: false, message: 'Missing event ID.', error: 'Missing ID' };
  }

  const payload = parseEventForm(formData);
  if (!payload.title || !payload.description || !payload.date || !payload.venue) {
    return {
      success: false,
      message: 'Title, description, date, and venue are required.',
      error: 'Missing required fields',
    };
  }

  const linkCheck = validateOptionalHttpUrl(
    payload.registration_link,
    'Registration link'
  );
  if (!linkCheck.ok) {
    return { success: false, message: linkCheck.error, error: linkCheck.error };
  }
  payload.registration_link = linkCheck.value;

  const { error } = await guard.db.from('events').update(payload).eq('id', id);
  if (error) {
    return {
      success: false,
      message: `Failed to update event: ${error.message}`,
      error: error.message,
    };
  }

  revalidateAllSitePages();
  return { success: true, message: `Event "${payload.title}" updated.` };
}

export async function updateEventStatus(
  id: string,
  status: EventStatus
): Promise<ActionResponse> {
  const guard = await requireAdminAndDb();
  if (!guard.ok) return guard.response;

  const { error } = await guard.db
    .from('events')
    .update({ status })
    .eq('id', id);

  if (error) {
    return {
      success: false,
      message: `Failed to update status: ${error.message}`,
      error: error.message,
    };
  }

  revalidateAllSitePages();
  return { success: true, message: `Event status updated to ${status}.` };
}

export async function deleteEvent(id: string): Promise<ActionResponse> {
  const guard = await requireAdminAndDb();
  if (!guard.ok) return guard.response;

  const { error } = await guard.db.from('events').delete().eq('id', id);
  if (error) {
    return {
      success: false,
      message: `Failed to delete event: ${error.message}`,
      error: error.message,
    };
  }

  revalidateAllSitePages();
  return { success: true, message: 'Event deleted.' };
}

function parseTeamForm(formData: FormData, selfId?: string) {
  const name = (formData.get('name') as string)?.trim() || '';
  const role = (formData.get('role') as string)?.trim() || '';
  const bio = (formData.get('bio') as string)?.trim() || null;
  const photo_url = (formData.get('photo_url') as string)?.trim() || null;
  const course = (formData.get('course') as string)?.trim() || null;
  const member_email =
    (formData.get('member_email') as string)?.trim().toLowerCase() || null;
  const is_faculty =
    formData.get('is_faculty') === 'on' || formData.get('is_faculty') === 'true';
  const rawParentId = (formData.get('parent_id') as string)?.trim() || null;
  const parent_id =
    is_faculty || !rawParentId || rawParentId === selfId ? null : rawParentId;
  const orderRaw = Number(formData.get('order_index'));
  const order_index = Number.isFinite(orderRaw) ? orderRaw : 0;

  return {
    name,
    role,
    bio,
    photo_url,
    course,
    member_email,
    is_faculty,
    parent_id,
    order_index,
  };
}

export async function createTeamMember(
  _prevState: ActionResponse | null,
  formData: FormData
): Promise<ActionResponse> {
  const guard = await requireAdminAndDb();
  if (!guard.ok) return guard.response;

  const payload = parseTeamForm(formData);
  if (!payload.name || !payload.role) {
    return {
      success: false,
      message: 'Member name and role are required.',
      error: 'Missing required fields',
    };
  }

  const photoCheck = validateOptionalHttpUrl(payload.photo_url, 'Photo URL');
  if (!photoCheck.ok) {
    return { success: false, message: photoCheck.error, error: photoCheck.error };
  }
  payload.photo_url = photoCheck.value;

  const { error } = await guard.db.from('team_members').insert(payload);
  if (error) {
    return {
      success: false,
      message: `Failed to add member: ${error.message}`,
      error: error.message,
    };
  }

  revalidateAllSitePages();
  return { success: true, message: `Added "${payload.name}" to team.` };
}

export async function updateTeamMember(
  _prevState: ActionResponse | null,
  formData: FormData
): Promise<ActionResponse> {
  const guard = await requireAdminAndDb();
  if (!guard.ok) return guard.response;

  const id = (formData.get('id') as string)?.trim();
  if (!id) {
    return { success: false, message: 'Missing member ID.', error: 'Missing ID' };
  }

  const payload = parseTeamForm(formData, id);
  if (!payload.name || !payload.role) {
    return {
      success: false,
      message: 'Member name and role are required.',
      error: 'Missing required fields',
    };
  }

  const photoCheck = validateOptionalHttpUrl(payload.photo_url, 'Photo URL');
  if (!photoCheck.ok) {
    return { success: false, message: photoCheck.error, error: photoCheck.error };
  }
  payload.photo_url = photoCheck.value;

  const { error } = await guard.db
    .from('team_members')
    .update(payload)
    .eq('id', id);

  if (error) {
    return {
      success: false,
      message: `Failed to update member: ${error.message}`,
      error: error.message,
    };
  }

  revalidateAllSitePages();
  return { success: true, message: `Updated "${payload.name}".` };
}

export async function deleteTeamMember(id: string): Promise<ActionResponse> {
  const guard = await requireAdminAndDb();
  if (!guard.ok) return guard.response;

  const { error } = await guard.db.from('team_members').delete().eq('id', id);
  if (error) {
    return {
      success: false,
      message: `Failed to delete member: ${error.message}`,
      error: error.message,
    };
  }

  revalidateAllSitePages();
  return { success: true, message: 'Team member removed.' };
}

export async function reorderTeamMember(
  id: string,
  orderIndex: number
): Promise<ActionResponse> {
  const guard = await requireAdminAndDb();
  if (!guard.ok) return guard.response;

  const safeOrder = Math.max(0, Math.floor(orderIndex));
  const { error } = await guard.db
    .from('team_members')
    .update({ order_index: safeOrder })
    .eq('id', id);

  if (error) {
    return {
      success: false,
      message: `Failed to update order: ${error.message}`,
      error: error.message,
    };
  }

  revalidateAllSitePages();
  return { success: true, message: `Updated display order to #${safeOrder}.` };
}

export async function deleteRegistration(id: string): Promise<ActionResponse> {
  const guard = await requireAdminAndDb();
  if (!guard.ok) return guard.response;

  const { error } = await guard.db.from('registrations').delete().eq('id', id);
  if (error) {
    return {
      success: false,
      message: `Failed to delete registration: ${error.message}`,
      error: error.message,
    };
  }

  revalidatePath('/admin');
  return { success: true, message: 'Registration deleted.' };
}

export async function deleteContactMessage(id: string): Promise<ActionResponse> {
  const guard = await requireAdminAndDb();
  if (!guard.ok) return guard.response;

  const { error } = await guard.db
    .from('contact_submissions')
    .delete()
    .eq('id', id);

  if (error) {
    return {
      success: false,
      message: `Failed to delete message: ${error.message}`,
      error: error.message,
    };
  }

  revalidatePath('/admin');
  return { success: true, message: 'Message deleted.' };
}

// ==========================================
// Event Gallery Photos CRUD
// ==========================================

export async function createEventPhoto(
  _prevState: ActionResponse | null,
  formData: FormData
): Promise<ActionResponse> {
  const guard = await requireAdminAndDb();
  if (!guard.ok) return guard.response;

  const title = (formData.get('title') as string)?.trim() || '';
  const event_name = (formData.get('event_name') as string)?.trim() || null;
  const rawUrl = (formData.get('image_url') as string)?.trim() || null;
  const caption = (formData.get('caption') as string)?.trim() || null;
  const taken_date = (formData.get('taken_date') as string)?.trim() || null;
  const orderRaw = Number(formData.get('order_index'));
  const order_index = Number.isFinite(orderRaw) ? orderRaw : 0;

  if (!title || !rawUrl) {
    return {
      success: false,
      message: 'Photo title and Image URL are required.',
      error: 'Missing required fields',
    };
  }

  const urlCheck = validateOptionalHttpUrl(rawUrl, 'Image URL');
  if (!urlCheck.ok || !urlCheck.value) {
    return {
      success: false,
      message: !urlCheck.ok ? urlCheck.error : 'Valid Image URL is required.',
      error: 'Invalid URL',
    };
  }

  const { error } = await guard.db.from('event_photos').insert({
    title,
    event_name,
    image_url: urlCheck.value,
    caption,
    taken_date,
    order_index,
  });

  if (error) {
    return {
      success: false,
      message: `Failed to add photo: ${error.message}`,
      error: error.message,
    };
  }

  revalidateAllSitePages();
  return { success: true, message: `Added "${title}" to Event Gallery.` };
}

export async function deleteEventPhoto(id: string): Promise<ActionResponse> {
  const guard = await requireAdminAndDb();
  if (!guard.ok) return guard.response;

  const { error } = await guard.db.from('event_photos').delete().eq('id', id);
  if (error) {
    return {
      success: false,
      message: `Failed to delete photo: ${error.message}`,
      error: error.message,
    };
  }

  revalidateAllSitePages();
  return { success: true, message: 'Photo removed from gallery.' };
}
