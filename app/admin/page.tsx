import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import AdminDashboard from '@/components/admin/AdminDashboard';
import {
  isAdminAuthenticated,
  isSupabaseAdminSession,
} from '@/lib/admin-auth';
import { createClient, isSupabaseConfigured } from '@/lib/supabase/server';
import {
  ContactSubmission,
  Event,
  EventPhoto,
  Registration,
  TeamMember,
} from '@/lib/types';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Admin Console — IgniteX IoT Club',
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminPage() {
  const authed = await isAdminAuthenticated();

  if (!authed) {
    redirect('/login');
  }

  let events: Event[] = [];
  let teamMembers: TeamMember[] = [];
  let registrations: Registration[] = [];
  let messages: ContactSubmission[] = [];
  let photos: EventPhoto[] = [];
  const dbConnected = await isSupabaseAdminSession();

  if (dbConnected) {
    try {
      const supabase = await createClient();
      const [evRes, tmRes, regRes, msgRes, photoRes] = await Promise.all([
        supabase
          .from('events')
          .select('*')
          .order('created_at', { ascending: false }),
        supabase
          .from('team_members')
          .select('*')
          .order('order_index', { ascending: true }),
        supabase
          .from('registrations')
          .select('*')
          .order('created_at', { ascending: false }),
        supabase
          .from('contact_submissions')
          .select('*')
          .order('created_at', { ascending: false }),
        supabase
          .from('event_photos')
          .select('*')
          .order('order_index', { ascending: true })
          .order('created_at', { ascending: false }),
      ]);

      events = (evRes.data as Event[]) || [];
      teamMembers = (tmRes.data as TeamMember[]) || [];
      registrations = (regRes.data as Registration[]) || [];
      messages = (msgRes.data as ContactSubmission[]) || [];
      photos = (photoRes.data as EventPhoto[]) || [];
    } catch (err) {
      console.error('AdminPage Supabase RLS fetch error:', err);
    }
  } else if (isSupabaseConfigured()) {
    try {
      const supabase = await createClient();
      const [evRes, tmRes, photoRes] = await Promise.all([
        supabase
          .from('events')
          .select('*')
          .order('created_at', { ascending: false }),
        supabase
          .from('team_members')
          .select('*')
          .order('order_index', { ascending: true }),
        supabase
          .from('event_photos')
          .select('*')
          .order('order_index', { ascending: true }),
      ]);

      events = (evRes.data as Event[]) || [];
      teamMembers = (tmRes.data as TeamMember[]) || [];
      photos = (photoRes.data as EventPhoto[]) || [];
    } catch (err) {
      console.error('AdminPage public Supabase fetch error:', err);
    }
  }

  return (
    <AdminDashboard
      events={events}
      teamMembers={teamMembers}
      registrations={registrations}
      messages={messages}
      photos={photos}
      dbConnected={dbConnected}
    />
  );
}
