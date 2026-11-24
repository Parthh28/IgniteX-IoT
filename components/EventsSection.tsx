import { createClient, isSupabaseConfigured } from '@/lib/supabase/server';
import { Event } from '@/lib/types';
import EventsClient from './EventsClient';
import styles from './EventsSection.module.css';

export default async function EventsSection() {
  let events: Event[] = [];

  if (isSupabaseConfigured()) {
    try {
      const supabase = await createClient();
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) {
        events = data as Event[];
      }
    } catch (err) {
      console.error('Error fetching events in EventsSection:', err);
    }
  }

  return (
    <section id="events" className={styles.section}>
      <div className="container">
        <div className={styles.header}>
          <p className={styles.categoryTag}>Events &amp; Workshops</p>
          <h1 className={styles.title}>Upcoming &amp; Past Events</h1>
          <p className={styles.subtitle}>
            Explore upcoming hackathons, hardware boot camps, and technical seminars.
          </p>
        </div>

        <EventsClient events={events} />
      </div>
    </section>
  );
}
