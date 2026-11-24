import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import AuthForm from '@/components/auth/AuthForm';
import {
  getAdminEmail,
  isAdminAuthenticated,
  isUsingDummyAdmin,
} from '@/lib/admin-auth';
import {
  DEV_DUMMY_MEMBER_EMAIL,
  isDemoMemberAuthenticated,
  isDemoMemberEnabled,
} from '@/lib/member-demo';
import { createClient, isSupabaseConfigured } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Login — IgniteX IoT Club',
  description:
    'Authorized member and administrator login for IgniteX IoT Club.',
};

export default async function LoginPage() {
  const isAdmin = await isAdminAuthenticated();
  if (isAdmin) {
    redirect('/admin');
  }

  if (await isDemoMemberAuthenticated()) {
    redirect('/account');
  }

  if (isSupabaseConfigured()) {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      redirect('/account');
    }
  }

  return (
    <AuthForm
      showDummyAdminHint={isUsingDummyAdmin()}
      dummyAdminEmail={getAdminEmail()}
      showDummyMemberHint={isDemoMemberEnabled()}
      dummyMemberEmail={DEV_DUMMY_MEMBER_EMAIL}
    />
  );
}
