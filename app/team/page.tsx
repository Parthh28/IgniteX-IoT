import type { Metadata } from 'next';
import TeamSection from '@/components/TeamSection';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Team — IgniteX IoT Club',
  description:
    'Meet the faculty coordinators, student leads, and sub-team coordinators of IgniteX IoT Club.',
};

export default function TeamPage() {
  return <TeamSection />;
}

