'use server';

import { createClient, isSupabaseConfigured } from '@/lib/supabase/server';
import { ActionResponse } from '@/lib/types';

export async function submitRegistration(
  _prevState: ActionResponse | null,
  formData: FormData
): Promise<ActionResponse> {
  try {
    const event_id = (formData.get('event_id') as string)?.trim();
    const full_name = (formData.get('full_name') as string)?.trim();
    const email = (formData.get('email') as string)?.trim()?.toLowerCase();
    const roll_number = (formData.get('roll_number') as string)?.trim();
    const phone = (formData.get('phone') as string)?.trim() || null;
    const branch = (formData.get('branch') as string)?.trim() || null;
    const semester = (formData.get('semester') as string)?.trim() || null;

    if (!event_id) {
      return {
        success: false,
        message: 'Invalid event selection.',
        error: 'Missing event ID.',
      };
    }

    if (!full_name || full_name.length < 2) {
      return {
        success: false,
        message: 'Please enter your full name (at least 2 characters).',
        error: 'Invalid full name.',
      };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      return {
        success: false,
        message: 'Please enter a valid email address.',
        error: 'Invalid email format.',
      };
    }

    if (!roll_number) {
      return {
        success: false,
        message: 'Please provide your student roll number or registration ID.',
        error: 'Missing roll number.',
      };
    }

    if (!isSupabaseConfigured()) {
      return {
        success: false,
        message: 'Registration database is not connected yet. Please try again later.',
        error: 'Supabase not configured.',
      };
    }

    const supabase = await createClient();

    const { error: insertError } = await supabase
      .from('registrations')
      .insert({
        event_id,
        full_name,
        email,
        roll_number,
        phone,
        branch,
        semester,
      });

    if (insertError) {
      if (insertError.code === '23505') {
        return {
          success: false,
          message: 'You have already registered for this event with this email.',
          error: 'Duplicate registration detected.',
        };
      }
      console.error('Registration insertion error:', insertError);
      return {
        success: false,
        message: 'Failed to record registration. Please try again.',
        error: insertError.message,
      };
    }

    return {
      success: true,
      message: 'Registration confirmed! We look forward to seeing you at the event.',
    };
  } catch (err) {
    console.error('Unexpected registration error:', err);
    return {
      success: false,
      message: 'An unexpected error occurred. Please try again later.',
      error: err instanceof Error ? err.message : 'Unknown error',
    };
  }
}
