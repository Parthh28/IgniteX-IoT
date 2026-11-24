'use client';

import { useState } from 'react';
import { Event } from '@/lib/types';
import RegisterModal from './RegisterModal';
import styles from './EventsSection.module.css';

interface EventsClientProps {
  events: Event[];
}

export default function EventsClient({ events }: EventsClientProps) {
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'past'>('all');
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const upcomingCount = events.filter(
    (e) => e.status === 'open' || e.status === 'upcoming'
  ).length;
  const pastCount = events.filter((e) => e.status === 'closed').length;

  const filteredEvents = events.filter((event) => {
    if (filter === 'upcoming') {
      return event.status === 'open' || event.status === 'upcoming';
    }
    if (filter === 'past') {
      return event.status === 'closed';
    }
    return true;
  });

  const handleRegisterClick = (event: Event) => {
    const link = event.registration_link?.trim();
    if (link && /^https?:\/\//i.test(link)) {
      window.open(link, '_blank', 'noopener,noreferrer');
    } else {
      setSelectedEvent(event);
      setIsModalOpen(true);
    }
  };

  return (
    <>
      {/* Filter Tabs */}
      <div className={styles.filterContainer} role="tablist" aria-label="Filter events">
        <button
          type="button"
          role="tab"
          aria-selected={filter === 'all'}
          className={`${styles.filterBtn} ${
            filter === 'all' ? styles.filterBtnActive : ''
          }`}
          onClick={() => setFilter('all')}
        >
          <span>All</span>
          <span className={styles.filterCount}>{events.length}</span>
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={filter === 'upcoming'}
          className={`${styles.filterBtn} ${
            filter === 'upcoming' ? styles.filterBtnActive : ''
          }`}
          onClick={() => setFilter('upcoming')}
        >
          <span>Upcoming</span>
          <span className={styles.filterCount}>{upcomingCount}</span>
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={filter === 'past'}
          className={`${styles.filterBtn} ${
            filter === 'past' ? styles.filterBtnActive : ''
          }`}
          onClick={() => setFilter('past')}
        >
          <span>Past</span>
          <span className={styles.filterCount}>{pastCount}</span>
        </button>
      </div>

      {/* Events Grid or Empty State */}
      {filteredEvents.length === 0 ? (
        <div className={styles.emptyState}>
          <p className={styles.emptyText}>Stay tuned &mdash; something is coming.</p>
        </div>
      ) : (
        <div className={styles.eventsGrid}>
          {filteredEvents.map((event) => {
            const isClosed = event.status === 'closed';
            const statusClass =
              event.status === 'open'
                ? styles.statusOpen
                : event.status === 'upcoming'
                ? styles.statusUpcoming
                : styles.statusClosed;

            return (
              <div key={event.id} className={styles.eventCard}>
                <div className={styles.cardHeader}>
                  <span className={styles.eventTag}>{event.tag}</span>
                  <span className={`${styles.statusBadge} ${statusClass}`}>
                    <span className={styles.statusDot} aria-hidden="true" />
                    <span>{event.status}</span>
                  </span>
                </div>

                <h3 className={styles.eventTitle}>{event.title}</h3>

                <div className={styles.eventMeta}>
                  <div className={styles.metaItem}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <rect width="18" height="18" x="3" y="4" rx="2" />
                      <path d="M16 2v4" />
                      <path d="M8 2v4" />
                      <path d="M3 10h18" />
                    </svg>
                    <span>
                      {event.date} {event.time ? `· ${event.time}` : ''}
                    </span>
                  </div>
                  <div className={styles.metaItem}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                    <span>
                      {event.venue} &middot; {event.mode.toUpperCase()}
                    </span>
                  </div>
                </div>

                <p className={styles.eventDesc}>{event.description}</p>

                <div className={styles.cardFooter}>
                  {isClosed ? (
                    <span className={styles.closedLabel}>Registration Closed</span>
                  ) : (
                    <button
                      type="button"
                      className={styles.registerBtn}
                      onClick={() => handleRegisterClick(event)}
                    >
                      <span>Register</span>
                      <span aria-hidden="true">&rarr;</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Registration Modal Dialog */}
      <RegisterModal
        event={selectedEvent}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
