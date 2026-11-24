import Link from 'next/link';
import { createClient, isSupabaseConfigured } from '@/lib/supabase/server';
import { Event } from '@/lib/types';
import { Reveal, SpotlightCard } from './MotionKit';
import styles from './AnnouncementsSection.module.css';

export default async function AnnouncementsSection() {
  let upcomingEvents: Event[] = [];

  if (isSupabaseConfigured()) {
    try {
      const supabase = await createClient();
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .in('status', ['open', 'upcoming'])
        .order('created_at', { ascending: false });

      if (!error && data) {
        upcomingEvents = data as Event[];
      }
    } catch (err) {
      console.error('Error fetching announcements:', err);
    }
  }

  return (
    <section id="announcements" className={styles.section}>
      <div className="container">
        <Reveal>
          <div className={styles.splitHeader}>
            <div>
              <p className={styles.categoryTag}>Announcements</p>
              <h2 className={styles.title}>Upcoming Events &amp; Updates</h2>
              <p className={styles.subtitle}>
                Open registrations, scheduled workshops, and upcoming club sessions.
              </p>
            </div>
            <Link href="/events" className={styles.sectionLink}>
              <span>View all events</span>
              <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>
        </Reveal>

        {upcomingEvents.length === 0 ? (
          <div className={styles.emptyState}>
            No upcoming announcements right now &mdash; stay tuned for the next session.
          </div>
        ) : (
          <Reveal delay={100}>
            <div className={styles.list}>
              {upcomingEvents.map((event, idx) => {
                const statusClass =
                  event.status === 'open' ? styles.statusOpen : styles.statusUpcoming;

                return (
                  <SpotlightCard
                    key={event.id}
                    className={styles.item}
                    accent={idx % 2 === 0 ? 'blue' : 'orange'}
                  >
                    <div className={styles.itemMain}>
                      <div className={styles.badges}>
                        <span className={styles.eventTag}>{event.tag}</span>
                        <span className={`${styles.statusBadge} ${statusClass}`}>
                          <span className={styles.statusDot} aria-hidden="true" />
                          <span>{event.status === 'open' ? 'Registration Open' : 'Upcoming'}</span>
                        </span>
                      </div>
                      <h3 className={styles.itemTitle}>{event.title}</h3>
                      <p className={styles.itemDesc}>{event.description}</p>
                    </div>

                    <div className={styles.itemSide}>
                      <div className={styles.metaRow}>
                        <span>
                          {event.date}
                          {event.time ? ` · ${event.time}` : ''}
                        </span>
                        <span>
                          {event.venue} &middot; {event.mode.toUpperCase()}
                        </span>
                      </div>
                      <Link href="/events" className={styles.actionLink}>
                        <span>Register / Details</span>
                        <span aria-hidden="true">&rarr;</span>
                      </Link>
                    </div>
                  </SpotlightCard>
                );
              })}
            </div>
          </Reveal>
        )}
      </div>
    </section>
  );
}

