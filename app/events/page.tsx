import type { Metadata } from 'next';
import EventsSection from '@/components/EventsSection';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Events — IgniteX IoT Club',
  description:
    'Explore upcoming hackathons, hands-on hardware workshops, and past technical seminars at IgniteX IoT Club.',
};

export default function EventsPage() {
  return <EventsSection />;
}

