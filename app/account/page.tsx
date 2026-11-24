import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import AccountEditor from '@/components/account/AccountEditor';
import { isAdminAuthenticated } from '@/lib/admin-auth';
import {
  DEV_DUMMY_MEMBER_EMAIL,
  getDemoMemberProfile,
  isDemoMemberAuthenticated,
} from '@/lib/member-demo';
import { createClient, isSupabaseConfigured } from '@/lib/supabase/server';
import { TeamMember } from '@/lib/types';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Member Account — IgniteX IoT Club',
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AccountPage() {
  if (await isAdminAuthenticated()) {
    redirect('/admin');
  }

  // Local dev dummy member session
  if (await isDemoMemberAuthenticated()) {
    return (
      <AccountEditor
        userEmail={DEV_DUMMY_MEMBER_EMAIL}
        member={getDemoMemberProfile()}
      />
    );
  }

  if (!isSupabaseConfigured()) {
    redirect('/login');
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !user.email) {
    redirect('/login');
  }

  const { data } = await supabase
    .from('team_members')
    .select('*')
    .or(`auth_user_id.eq.${user.id},member_email.eq.${user.email.toLowerCase()}`)
    .maybeSingle();

  const member = (data as TeamMember) || null;

  return <AccountEditor userEmail={user.email} member={member} />;
}
