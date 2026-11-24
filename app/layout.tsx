import type { Metadata } from 'next';
import {
  Space_Grotesk,
  Plus_Jakarta_Sans,
  JetBrains_Mono,
} from 'next/font/google';
import './globals.css';
import Navbar, { NavUser } from '@/components/Navbar';
import Footer from '@/components/Footer';
import CanvasBg from '@/components/CanvasBg';
import IntroOverlay from '@/components/IntroOverlay';
import { isAdminAuthenticated } from '@/lib/admin-auth';
import {
  getDemoMemberProfile,
  isDemoMemberAuthenticated,
} from '@/lib/member-demo';
import { createClient, isSupabaseConfigured } from '@/lib/supabase/server';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-heading',
  weight: ['500', '600', '700'],
  display: 'swap',
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  weight: ['400', '500', '600'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'IgniteX IoT Club — Connect. Automate. Innovate.',
  description:
    'IgniteX IoT Club is a college technical organization advancing student innovation across the Internet of Things, Artificial Intelligence, robotics, and hardware automation.',
  keywords: [
    'IoT Club',
    'IgniteX',
    'Robotics',
    'Hardware Hackathon',
    'Edge AI',
    'Microcontrollers',
    'ESP32',
    'Embedded Systems',
  ],
  authors: [{ name: 'IgniteX IoT Club' }],
  icons: {
    icon: '/ignitex-logo.png',
    apple: '/ignitex-logo.png',
  },
  openGraph: {
    title: 'IgniteX IoT Club — Spark Ideas. Connect Possibilities.',
    description:
      'Official website of IgniteX IoT Club. Discover our hardware workshops, research initiatives, upcoming hackathons, and student leadership.',
    url: 'https://ignitexiot.edu',
    siteName: 'IgniteX IoT Club',
    locale: 'en_US',
    type: 'website',
  },
};

async function getNavUser(): Promise<NavUser | null> {
  try {
    if (await isAdminAuthenticated()) {
      return {
        href: '/admin',
        name: 'Admin',
        photoUrl: '/ignitex-logo.png',
        isAdmin: true,
      };
    }

    if (await isDemoMemberAuthenticated()) {
      const demo = getDemoMemberProfile();
      return {
        href: '/account',
        name: demo.name,
        photoUrl: demo.photo_url || null,
        isAdmin: false,
      };
    }

    if (isSupabaseConfigured()) {
      const supabase = await createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user && user.email) {
        const { data: member } = await supabase
          .from('team_members')
          .select('name, photo_url')
          .or(
            `auth_user_id.eq.${user.id},member_email.eq.${user.email.toLowerCase()}`
          )
          .maybeSingle();

        return {
          href: '/account',
          name: member?.name || user.email.split('@')[0],
          photoUrl: member?.photo_url || null,
          isAdmin: false,
        };
      }
    }
  } catch {
    // fallback to signed-out state
  }
  return null;
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const navUser = await getNavUser();

  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${plusJakartaSans.variable} ${jetbrainsMono.variable}`}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <body suppressHydrationWarning>
        <IntroOverlay />
        <Navbar navUser={navUser} />
        <CanvasBg />
        <main className="main-wrapper">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
