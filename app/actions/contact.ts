'use server';

import { createClient, isSupabaseConfigured } from '@/lib/supabase/server';
import { ActionResponse } from '@/lib/types';

export async function submitContact(
  _prevState: ActionResponse | null,
  formData: FormData
): Promise<ActionResponse> {
  try {
    const name = (formData.get('name') as string)?.trim();
    const email = (formData.get('email') as string)?.trim()?.toLowerCase();
    const phone = (formData.get('phone') as string)?.trim();
    const inquiryType =
      (formData.get('inquiry_type') as string)?.trim() || 'General Inquiry';
    const rawMessage = (formData.get('message') as string)?.trim();

    if (!name || name.length < 2) {
      return {
        success: false,
        message: 'Please enter your full name.',
        error: 'Invalid name.',
      };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      return {
        success: false,
        message: 'Please provide a valid email address.',
        error: 'Invalid email address.',
      };
    }

    if (!phone || phone.replace(/\D/g, '').length < 7) {
      return {
        success: false,
        message: 'Please provide a valid phone number.',
        error: 'Invalid phone number.',
      };
    }

    const detailLines: string[] = [`Phone: ${phone}`];

    if (inquiryType === 'Join Core Team') {
      const branch = (formData.get('branch') as string)?.trim();
      const srn = (formData.get('srn') as string)?.trim();
      const semester = (formData.get('semester') as string)?.trim();
      const domain = (formData.get('domain') as string)?.trim();

      if (!branch || !srn) {
        return {
          success: false,
          message:
            'Please provide your Branch/Department and Application Number / SRN.',
          error: 'Missing core team fields.',
        };
      }

      detailLines.push(`Branch / Dept: ${branch}`);
      detailLines.push(`App No. / SRN: ${srn}`);
      if (semester) detailLines.push(`Semester / Year: ${semester}`);
      if (domain) detailLines.push(`Preferred Domain: ${domain}`);
    } else if (inquiryType === 'Sponsor an Event') {
      const company = (formData.get('company_name') as string)?.trim();
      const designation = (formData.get('designation') as string)?.trim();
      const website = (formData.get('company_website') as string)?.trim();
      const sponsorType = (formData.get('sponsor_type') as string)?.trim();

      if (!company) {
        return {
          success: false,
          message: 'Please provide your Company / Brand name.',
          error: 'Missing company name.',
        };
      }

      detailLines.push(`Company: ${company}`);
      if (designation) detailLines.push(`Designation: ${designation}`);
      if (sponsorType) detailLines.push(`Sponsorship Type: ${sponsorType}`);
      if (website) detailLines.push(`Website: ${website}`);
    } else if (inquiryType === 'Collaborate') {
      const orgName = (formData.get('org_name') as string)?.trim();
      const orgRole = (formData.get('org_role') as string)?.trim();
      const collabType = (formData.get('collab_type') as string)?.trim();

      if (!orgName) {
        return {
          success: false,
          message: 'Please provide your Club / Organization / College name.',
          error: 'Missing organization name.',
        };
      }

      detailLines.push(`Organization: ${orgName}`);
      if (orgRole) detailLines.push(`Role: ${orgRole}`);
      if (collabType) detailLines.push(`Collaboration Type: ${collabType}`);
    }

    if (!rawMessage || rawMessage.length < 5) {
      return {
        success: false,
        message: 'Please include a message with at least 5 characters.',
        error: 'Message too short.',
      };
    }

    if (!isSupabaseConfigured()) {
      return {
        success: false,
        message:
          'Contact form storage is not connected yet. Please reach out via email at revaiotclub@gmail.com.',
        error: 'Supabase not configured.',
      };
    }

    const message = `[${inquiryType}]\n${detailLines.join(' | ')}\n\n${rawMessage}`;
    const supabase = await createClient();

    const { error: insertError } = await supabase
      .from('contact_submissions')
      .insert({
        name,
        email,
        message,
      });

    if (insertError) {
      console.error('Contact submission error:', insertError);
      return {
        success: false,
        message: 'Failed to send message. Please try again.',
        error: insertError.message,
      };
    }

    return {
      success: true,
      message:
        'Thank you! Your inquiry has been received. Our team will reach out shortly.',
    };
  } catch (err) {
    console.error('Unexpected contact error:', err);
    return {
      success: false,
      message: 'An unexpected error occurred while sending your message.',
      error: err instanceof Error ? err.message : 'Unknown error',
    };
  }
}
