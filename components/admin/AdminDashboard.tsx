'use client';

import { useActionState, useEffect, useState, useTransition } from 'react';
import {
  adminLogout,
  createEvent,
  createEventPhoto,
  createTeamMember,
  deleteContactMessage,
  deleteEvent,
  deleteEventPhoto,
  deleteRegistration,
  deleteTeamMember,
  reorderTeamMember,
  updateEvent,
  updateEventStatus,
  updateTeamMember,
} from '@/app/actions/admin';
import {
  ActionResponse,
  ContactSubmission,
  Event,
  EventPhoto,
  EventStatus,
  Registration,
  TeamMember,
} from '@/lib/types';
import styles from './Admin.module.css';

type AdminTab = 'events' | 'team' | 'gallery' | 'registrations' | 'messages';

interface PendingConfirmation {
  title: string;
  description: string;
  confirmLabel: string;
  variant: 'danger' | 'primary';
  onConfirm: () => Promise<void>;
}

interface AdminDashboardProps {
  events: Event[];
  teamMembers: TeamMember[];
  registrations: Registration[];
  messages: ContactSubmission[];
  photos: EventPhoto[];
  dbConnected: boolean;
}

export default function AdminDashboard({
  events,
  teamMembers,
  registrations,
  messages,
  photos,
  dbConnected,
}: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<AdminTab>('events');
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [defaultParentId, setDefaultParentId] = useState<string>('');
  const [eventFormNonce, setEventFormNonce] = useState(0);
  const [memberFormNonce, setMemberFormNonce] = useState(0);
  const [photoFormNonce, setPhotoFormNonce] = useState(0);
  const [memberPhotoPreview, setMemberPhotoPreview] = useState<string>('');
  const [memberPhotoUrlValue, setMemberPhotoUrlValue] = useState<string>('');
  const [actionMsg, setActionMsg] = useState<ActionResponse | null>(null);
  const [confirmState, setConfirmState] = useState<PendingConfirmation | null>(
    null
  );
  const [isMutating, startTransition] = useTransition();

  useEffect(() => {
    if (!actionMsg) return;
    const timer = setTimeout(() => {
      setActionMsg(null);
    }, 4000);
    return () => clearTimeout(timer);
  }, [actionMsg]);

  useEffect(() => {
    if (!confirmState) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isMutating) {
        setConfirmState(null);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [confirmState, isMutating]);

  // Filters & search
  const [eventSearch, setEventSearch] = useState<string>('');
  const [msgSearch, setMsgSearch] = useState<string>('');
  const [regEventFilter, setRegEventFilter] = useState<string>('all');
  const [regSearch, setRegSearch] = useState<string>('');

  const [createEventState, createEventAction, isCreatingEvent] = useActionState(
    createEvent,
    null
  );
  const [updateEventState, updateEventAction, isUpdatingEvent] = useActionState(
    updateEvent,
    null
  );
  const [createMemberState, createMemberAction, isCreatingMember] =
    useActionState(createTeamMember, null);
  const [updateMemberState, updateMemberAction, isUpdatingMember] =
    useActionState(updateTeamMember, null);
  const [createPhotoState, createPhotoAction, isCreatingPhoto] =
    useActionState(createEventPhoto, null);

  useEffect(() => {
    if (createPhotoState?.success) {
      setPhotoFormNonce((n) => n + 1);
      setActionMsg(createPhotoState);
    }
  }, [createPhotoState]);

  useEffect(() => {
    if (createEventState?.success) {
      setEventFormNonce((n) => n + 1);
      setActionMsg(createEventState);
    }
  }, [createEventState]);

  useEffect(() => {
    if (updateEventState?.success) {
      setEditingEvent(null);
      setActionMsg(updateEventState);
    }
  }, [updateEventState]);

  useEffect(() => {
    setMemberPhotoPreview('');
    setMemberPhotoUrlValue(editingMember?.photo_url || '');
  }, [editingMember, memberFormNonce]);

  useEffect(() => {
    if (createMemberState?.success) {
      setMemberFormNonce((n) => n + 1);
      setDefaultParentId('');
      setMemberPhotoPreview('');
      setMemberPhotoUrlValue('');
      setActionMsg(createMemberState);
    }
  }, [createMemberState]);

  useEffect(() => {
    if (updateMemberState?.success) {
      setEditingMember(null);
      setDefaultParentId('');
      setMemberPhotoPreview('');
      setMemberPhotoUrlValue('');
      setActionMsg(updateMemberState);
    }
  }, [updateMemberState]);

  const openEventsCount = events.filter(
    (e) => e.status === 'open' || e.status === 'upcoming'
  ).length;

  const eventTitleById = new Map(events.map((e) => [e.id, e.title]));

  const filteredEvents = events.filter((ev) => {
    if (!eventSearch.trim()) return true;
    const q = eventSearch.toLowerCase();
    return (
      ev.title.toLowerCase().includes(q) ||
      ev.venue.toLowerCase().includes(q) ||
      ev.tag.toLowerCase().includes(q) ||
      ev.status.toLowerCase().includes(q)
    );
  });

  const filteredMessages = messages.filter((msg) => {
    if (!msgSearch.trim()) return true;
    const q = msgSearch.toLowerCase();
    return (
      msg.name.toLowerCase().includes(q) ||
      msg.email.toLowerCase().includes(q) ||
      msg.message.toLowerCase().includes(q)
    );
  });

  const handleReorderMember = (id: string, nextOrder: number) => {
    startTransition(async () => {
      const res = await reorderTeamMember(id, nextOrder);
      setActionMsg(res);
    });
  };

  // Hierarchy groupings for Team tab (Faculty, Top-Level Heads, and nested Coordinators)
  const topLevelHeads = teamMembers.filter(
    (m) => !m.is_faculty && !m.parent_id
  );
  const topLevelMembers = teamMembers.filter((m) => !m.parent_id);
  const coordsByParent = new Map<string, TeamMember[]>();
  for (const m of teamMembers) {
    if (m.parent_id) {
      const list = coordsByParent.get(m.parent_id) || [];
      list.push(m);
      coordsByParent.set(m.parent_id, list);
    }
  }

  const filteredRegistrations = registrations.filter((r) => {
    if (regEventFilter !== 'all' && r.event_id !== regEventFilter) return false;
    if (regSearch.trim()) {
      const q = regSearch.toLowerCase();
      return (
        r.full_name.toLowerCase().includes(q) ||
        r.email.toLowerCase().includes(q) ||
        r.roll_number.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const runConfirmedAction = () => {
    if (!confirmState) return;
    const fn = confirmState.onConfirm;
    startTransition(async () => {
      await fn();
      setConfirmState(null);
    });
  };

  const handleStatusChange = (id: string, title: string, status: EventStatus) => {
    setConfirmState({
      title: 'Update Event Status',
      description: `Change "${title}" status to "${status.toUpperCase()}"? This updates visibility on the live website immediately.`,
      confirmLabel: `Set to ${status}`,
      variant: 'primary',
      onConfirm: async () => {
        const res = await updateEventStatus(id, status);
        setActionMsg(res);
      },
    });
  };

  const handleDeleteEvent = (id: string, title: string) => {
    setConfirmState({
      title: 'Delete Event',
      description: `Permanently delete "${title}" and any linked registrations? This action cannot be undone.`,
      confirmLabel: 'Delete Event',
      variant: 'danger',
      onConfirm: async () => {
        const res = await deleteEvent(id);
        setActionMsg(res);
        if (editingEvent?.id === id) setEditingEvent(null);
      },
    });
  };

  const handleDeleteMember = (id: string, name: string) => {
    setConfirmState({
      title: 'Remove Team Member',
      description: `Remove "${name}" from the Team Roster? They will no longer appear on the public /team page.`,
      confirmLabel: 'Remove Member',
      variant: 'danger',
      onConfirm: async () => {
        const res = await deleteTeamMember(id);
        setActionMsg(res);
        if (editingMember?.id === id) setEditingMember(null);
      },
    });
  };

  const handleDeleteRegistration = (id: string, name: string) => {
    setConfirmState({
      title: 'Delete Registration',
      description: `Remove event registration submitted by "${name}"? This cannot be undone.`,
      confirmLabel: 'Delete Registration',
      variant: 'danger',
      onConfirm: async () => {
        const res = await deleteRegistration(id);
        setActionMsg(res);
      },
    });
  };

  const handleDeleteMessage = (id: string) => {
    setConfirmState({
      title: 'Delete Contact Inquiry',
      description: 'Permanently delete this contact submission from your inbox?',
      confirmLabel: 'Delete Message',
      variant: 'danger',
      onConfirm: async () => {
        const res = await deleteContactMessage(id);
        setActionMsg(res);
      },
    });
  };

  const handleDeletePhoto = (id: string, title: string) => {
    setConfirmState({
      title: 'Remove Event Photo',
      description: `Remove "${title}" from the public Event Gallery?`,
      confirmLabel: 'Remove Photo',
      variant: 'danger',
      onConfirm: async () => {
        const res = await deleteEventPhoto(id);
        setActionMsg(res);
      },
    });
  };

  const exportRegistrationsCsv = () => {
    const headers = [
      'Event',
      'Full Name',
      'Email',
      'Roll Number',
      'Phone',
      'Branch',
      'Semester',
      'Submitted At',
    ];
    const escape = (val?: string | null) => {
      const str = String(val ?? '');
      // Prevent CSV formula injection in Excel / Google Sheets
      const safe = /^[=+\-@\t\r]/.test(str) ? `'${str}` : str;
      return `"${safe.replace(/"/g, '""')}"`;
    };

    const rows = filteredRegistrations.map((r) =>
      [
        escape(eventTitleById.get(r.event_id) || r.event_id),
        escape(r.full_name),
        escape(r.email),
        escape(r.roll_number),
        escape(r.phone),
        escape(r.branch),
        escape(r.semester),
        escape(r.created_at),
      ].join(',')
    );

    const csv = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'ignitex-registrations.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  const activeEventFormState = editingEvent
    ? updateEventState
    : createEventState;
  const activeMemberFormState = editingMember
    ? updateMemberState
    : createMemberState;

  return (
    <section className={styles.page}>
      <div className="container">
        <header className={styles.header}>
          <div>
            <p className={styles.eyebrow} style={{ textTransform: 'none', color: 'var(--text-primary)' }}>
              Ignite<span style={{ color: 'var(--accent-orange)' }}>X</span>{' '}
              <span style={{ color: 'var(--accent-primary)' }}>IoT</span> Club
            </p>
            <h1>Admin Control Center</h1>
          </div>

          <div className={styles.headerActions}>
            <form action={adminLogout}>
              <button type="submit" className={styles.secondaryBtn}>
                Sign Out
              </button>
            </form>
          </div>
        </header>

        {!dbConnected && (
          <div className={styles.banner}>
            <strong>Supabase Admin session not active:</strong> Set{' '}
            <code>NEXT_PUBLIC_SUPABASE_URL</code> and{' '}
            <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code> in <code>.env.local</code>,
            create your Admin user in <strong>Supabase → Authentication → Users</strong>,
            and sign in at <code>/login</code> to save changes under Postgres RLS.
          </div>
        )}

        {actionMsg && (
          <div
            className={
              actionMsg.success ? styles.feedbackSuccess : styles.feedbackError
            }
            role="status"
            style={{
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px',
            }}
          >
            <span>{actionMsg.message}</span>
            <button
              type="button"
              onClick={() => setActionMsg(null)}
              aria-label="Dismiss notification"
              style={{
                color: 'inherit',
                fontSize: '1rem',
                lineHeight: 1,
                padding: '2px 6px',
                opacity: 0.8,
              }}
            >
              &times;
            </button>
          </div>
        )}

        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statLabel}>Total Events</div>
            <div className={styles.statValue}>{events.length}</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statLabel}>Active / Upcoming</div>
            <div className={styles.statValue}>{openEventsCount}</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statLabel}>Team Members</div>
            <div className={styles.statValue}>{teamMembers.length}</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statLabel}>Registrations</div>
            <div className={styles.statValue}>{registrations.length}</div>
          </div>
        </div>

        <div className={styles.tabs} role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'events'}
            onClick={() => setActiveTab('events')}
            className={`${styles.tab} ${activeTab === 'events' ? styles.tabActive : ''}`}
          >
            Events &amp; Announcements ({events.length})
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'team'}
            onClick={() => setActiveTab('team')}
            className={`${styles.tab} ${activeTab === 'team' ? styles.tabActive : ''}`}
          >
            Team ({teamMembers.length})
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'gallery'}
            onClick={() => setActiveTab('gallery')}
            className={`${styles.tab} ${activeTab === 'gallery' ? styles.tabActive : ''}`}
          >
            Gallery ({photos.length})
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'registrations'}
            onClick={() => setActiveTab('registrations')}
            className={`${styles.tab} ${activeTab === 'registrations' ? styles.tabActive : ''}`}
          >
            Registrations ({registrations.length})
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'messages'}
            onClick={() => setActiveTab('messages')}
            className={`${styles.tab} ${activeTab === 'messages' ? styles.tabActive : ''}`}
          >
            Messages ({messages.length})
          </button>
        </div>

        {/* EVENTS TAB */}
        {activeTab === 'events' && (
          <div className={styles.sectionGrid}>
            <div className={styles.panel}>
              <div className={styles.panelTitle}>
                <span>{editingEvent ? 'Edit Event' : 'Add New Event'}</span>
                {editingEvent && (
                  <button
                    type="button"
                    className={styles.secondaryBtn}
                    onClick={() => setEditingEvent(null)}
                  >
                    Cancel
                  </button>
                )}
              </div>

              <form
                key={editingEvent?.id || `new-event-${eventFormNonce}`}
                action={editingEvent ? updateEventAction : createEventAction}
                className={styles.form}
              >
                {editingEvent && (
                  <input type="hidden" name="id" value={editingEvent.id} />
                )}

                <div className={styles.field}>
                  <label htmlFor="ev-title" className={styles.label}>
                    Event Title *
                  </label>
                  <input
                    id="ev-title"
                    name="title"
                    required
                    defaultValue={editingEvent?.title || ''}
                    placeholder="e.g. ESP32 Edge AI Workshop"
                    className={styles.input}
                  />
                </div>

                <div className={styles.formRow}>
                  <div className={styles.field}>
                    <label htmlFor="ev-date" className={styles.label}>
                      Date *
                    </label>
                    <input
                      id="ev-date"
                      name="date"
                      required
                      defaultValue={editingEvent?.date || ''}
                      placeholder="15 Nov 2026"
                      className={styles.input}
                    />
                  </div>
                  <div className={styles.field}>
                    <label htmlFor="ev-time" className={styles.label}>
                      Time
                    </label>
                    <input
                      id="ev-time"
                      name="time"
                      defaultValue={editingEvent?.time || ''}
                      placeholder="10:00 AM"
                      className={styles.input}
                    />
                  </div>
                </div>

                <div className={styles.field}>
                  <label htmlFor="ev-venue" className={styles.label}>
                    Venue *
                  </label>
                  <input
                    id="ev-venue"
                    name="venue"
                    required
                    defaultValue={editingEvent?.venue || ''}
                    placeholder="IoT Innovation Lab (Room 302)"
                    className={styles.input}
                  />
                </div>

                <div className={styles.formRow}>
                  <div className={styles.field}>
                    <label htmlFor="ev-mode" className={styles.label}>
                      Mode
                    </label>
                    <select
                      id="ev-mode"
                      name="mode"
                      defaultValue={editingEvent?.mode || 'offline'}
                      className={styles.select}
                    >
                      <option value="offline">Offline</option>
                      <option value="online">Online</option>
                    </select>
                  </div>

                  <div className={styles.field}>
                    <label htmlFor="ev-status" className={styles.label}>
                      Status
                    </label>
                    <select
                      id="ev-status"
                      name="status"
                      defaultValue={editingEvent?.status || 'open'}
                      className={styles.select}
                    >
                      <option value="open">Open</option>
                      <option value="upcoming">Upcoming</option>
                      <option value="closed">Closed</option>
                    </select>
                  </div>
                </div>

                <div className={styles.field}>
                  <label htmlFor="ev-tag" className={styles.label}>
                    Category Tag
                  </label>
                  <input
                    id="ev-tag"
                    name="tag"
                    defaultValue={editingEvent?.tag || 'Workshop'}
                    placeholder="Workshop / Hackathon / Seminar"
                    className={styles.input}
                  />
                </div>

                <div className={styles.field}>
                  <label htmlFor="ev-link" className={styles.label}>
                    External Registration Link (optional)
                  </label>
                  <input
                    id="ev-link"
                    name="registration_link"
                    type="url"
                    defaultValue={editingEvent?.registration_link || ''}
                    placeholder="https://..."
                    className={styles.input}
                  />
                </div>

                <div className={styles.field}>
                  <label htmlFor="ev-desc" className={styles.label}>
                    Description *
                  </label>
                  <textarea
                    id="ev-desc"
                    name="description"
                    required
                    defaultValue={editingEvent?.description || ''}
                    placeholder="Brief overview of what students will build or learn..."
                    className={styles.textarea}
                  />
                </div>

                {activeEventFormState && !activeEventFormState.success && (
                  <p className={styles.feedbackError}>
                    {activeEventFormState.message}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={isCreatingEvent || isUpdatingEvent}
                  className={styles.primaryBtn}
                >
                  {editingEvent
                    ? isUpdatingEvent
                      ? 'Saving...'
                      : 'Save Event Changes'
                    : isCreatingEvent
                      ? 'Publishing...'
                      : 'Publish Event'}
                </button>
              </form>
            </div>

            <div className={styles.panel}>
              <div className={styles.panelTitle}>
                <span>All Events ({filteredEvents.length})</span>
                <input
                  type="search"
                  value={eventSearch}
                  onChange={(e) => setEventSearch(e.target.value)}
                  placeholder="Search events..."
                  className={styles.input}
                  style={{ maxWidth: '210px', padding: '6px 10px', fontSize: '0.8rem' }}
                  aria-label="Search events"
                />
              </div>

              {filteredEvents.length === 0 ? (
                <p className={styles.empty}>
                  {events.length === 0
                    ? 'No events yet. Add one on the left.'
                    : 'No events match your search.'}
                </p>
              ) : (
                <div className={styles.list}>
                  {filteredEvents.map((ev) => (
                    <div key={ev.id} className={styles.itemCard}>
                      <div className={styles.itemTop}>
                        <div>
                          <div className={styles.itemTitle}>{ev.title}</div>
                          <div className={styles.itemMeta}>
                            {ev.date}
                            {ev.time ? ` · ${ev.time}` : ''} · {ev.venue} ·{' '}
                            {ev.mode} · {ev.tag}
                          </div>
                        </div>
                        <span
                          className={`${styles.badge} ${
                            ev.status === 'open'
                              ? styles.badgeOpen
                              : ev.status === 'upcoming'
                                ? styles.badgeUpcoming
                                : styles.badgeClosed
                          }`}
                        >
                          {ev.status}
                        </span>
                      </div>

                      <p className={styles.itemDesc}>{ev.description}</p>

                      <div className={styles.itemControls}>
                        {(['open', 'upcoming', 'closed'] as EventStatus[]).map(
                          (st) => (
                            <button
                              key={st}
                              type="button"
                              disabled={isMutating || ev.status === st}
                              onClick={() => handleStatusChange(ev.id, ev.title, st)}
                              className={styles.secondaryBtn}
                            >
                              Set {st}
                            </button>
                          )
                        )}
                        <button
                          type="button"
                          onClick={() => setEditingEvent(ev)}
                          className={styles.secondaryBtn}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          disabled={isMutating}
                          onClick={() => handleDeleteEvent(ev.id, ev.title)}
                          className={styles.dangerBtn}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TEAM TAB */}
        {activeTab === 'team' && (
          <div className={styles.sectionGrid}>
            <div className={styles.panel}>
              <div className={styles.panelTitle}>
                <span>
                  {editingMember ? 'Edit Team Member' : 'Add Team Member'}
                </span>
                {editingMember && (
                  <button
                    type="button"
                    className={styles.secondaryBtn}
                    onClick={() => setEditingMember(null)}
                  >
                    Cancel
                  </button>
                )}
              </div>

              <form
                key={
                  editingMember?.id ||
                  `new-member-${memberFormNonce}-${defaultParentId}`
                }
                action={editingMember ? updateMemberAction : createMemberAction}
                className={styles.form}
              >
                {editingMember && (
                  <input type="hidden" name="id" value={editingMember.id} />
                )}

                <div className={styles.field}>
                  <label htmlFor="tm-name" className={styles.label}>
                    Full Name *
                  </label>
                  <input
                    id="tm-name"
                    name="name"
                    required
                    defaultValue={editingMember?.name || ''}
                    placeholder="e.g. Aarav Sharma"
                    className={styles.input}
                  />
                </div>

                <div className={styles.formRow}>
                  <div className={styles.field}>
                    <label htmlFor="tm-role" className={styles.label}>
                      Role *
                    </label>
                    <input
                      id="tm-role"
                      name="role"
                      required
                      defaultValue={editingMember?.role || ''}
                      placeholder="Club Lead"
                      className={styles.input}
                    />
                  </div>
                  <div className={styles.field}>
                    <label htmlFor="tm-order" className={styles.label}>
                      Order Index
                    </label>
                    <input
                      id="tm-order"
                      name="order_index"
                      type="number"
                      defaultValue={editingMember?.order_index ?? 0}
                      className={styles.input}
                    />
                  </div>
                </div>

                <div className={styles.field}>
                  <label htmlFor="tm-parent" className={styles.label}>
                    Hierarchy / Reports To
                  </label>
                  <select
                    id="tm-parent"
                    name="parent_id"
                    defaultValue={editingMember?.parent_id || defaultParentId}
                    className={styles.select}
                  >
                    <option value="">
                      Top-Level Head / Faculty (No parent)
                    </option>
                    {topLevelHeads
                      .filter((h) => h.id !== editingMember?.id)
                      .map((head) => (
                        <option key={head.id} value={head.id}>
                          Coordinator under {head.name} ({head.role})
                        </option>
                      ))}
                  </select>
                </div>

                <div className={styles.field}>
                  <label htmlFor="tm-course" className={styles.label}>
                    Course / Branch (optional)
                  </label>
                  <input
                    id="tm-course"
                    name="course"
                    defaultValue={editingMember?.course || ''}
                    placeholder="e.g. B.Tech CSE · 3rd Year"
                    className={styles.input}
                  />
                </div>

                <div className={styles.field}>
                  <label htmlFor="tm-email" className={styles.label}>
                    Member Login Email (optional)
                  </label>
                  <input
                    id="tm-email"
                    name="member_email"
                    type="email"
                    defaultValue={editingMember?.member_email || ''}
                    placeholder="member@ignitexiot.edu"
                    className={styles.input}
                  />
                </div>

                <div className={styles.field}>
                  <label className={styles.label}>Member Photo (optional)</label>
                  <div className={styles.photoUploadRow}>
                    <div className={styles.photoPreviewBox}>
                      {memberPhotoPreview || memberPhotoUrlValue ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={memberPhotoPreview || memberPhotoUrlValue}
                          alt="Member preview"
                          className={styles.photoPreviewImg}
                        />
                      ) : (
                        <span className={styles.photoPreviewPlaceholder}>
                          No photo
                        </span>
                      )}
                    </div>

                    <div className={styles.photoUploadControls}>
                      <div className={styles.photoUploadActions}>
                        <label
                          htmlFor="tm-photo-file"
                          className={styles.uploadFileBtn}
                        >
                          Upload Photo
                          <input
                            id="tm-photo-file"
                            name="photo_file"
                            type="file"
                            accept="image/png,image/jpeg,image/webp,image/gif"
                            className={styles.hiddenFileInput}
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                setMemberPhotoPreview(URL.createObjectURL(file));
                              }
                            }}
                          />
                        </label>
                        {(memberPhotoPreview || memberPhotoUrlValue) && (
                          <button
                            type="button"
                            className={styles.secondaryBtn}
                            onClick={() => {
                              setMemberPhotoPreview('');
                              setMemberPhotoUrlValue('');
                              const inputEl = document.getElementById(
                                'tm-photo-file'
                              ) as HTMLInputElement | null;
                              if (inputEl) inputEl.value = '';
                            }}
                          >
                            Clear
                          </button>
                        )}
                      </div>
                      <span className={styles.uploadHint}>
                        JPG, PNG, WebP or GIF up to 5 MB
                      </span>
                    </div>
                  </div>

                  <input
                    id="tm-photo"
                    name="photo_url"
                    value={memberPhotoUrlValue}
                    onChange={(e) => setMemberPhotoUrlValue(e.target.value)}
                    placeholder="Or paste photo URL (https://...)"
                    className={styles.input}
                  />
                </div>

                <div className={styles.field}>
                  <label htmlFor="tm-bio" className={styles.label}>
                    Bio
                  </label>
                  <textarea
                    id="tm-bio"
                    name="bio"
                    defaultValue={editingMember?.bio || ''}
                    placeholder="Short role & expertise summary..."
                    className={styles.textarea}
                  />
                </div>

                <label className={styles.checkboxRow}>
                  <input
                    type="checkbox"
                    name="is_faculty"
                    defaultChecked={editingMember?.is_faculty || false}
                  />
                  Faculty Coordinator
                </label>

                {activeMemberFormState && !activeMemberFormState.success && (
                  <p className={styles.feedbackError}>
                    {activeMemberFormState.message}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={isCreatingMember || isUpdatingMember}
                  className={styles.primaryBtn}
                >
                  {editingMember
                    ? isUpdatingMember
                      ? 'Saving...'
                      : 'Save Member'
                    : isCreatingMember
                      ? 'Adding...'
                      : 'Add Member'}
                </button>
              </form>

              <hr
                style={{
                  border: 'none',
                  borderTop: '1px solid var(--border)',
                  margin: '24px 0',
                }}
              />

              <div className={styles.panelTitle}>
                <span>How to Issue Member Logins</span>
              </div>

              <div className={styles.banner} style={{ marginBottom: 0 }}>
                <strong>Zero-Service-Key Flow:</strong>
                <br />
                1. Add the member above with their <strong>Member Login Email</strong>.
                <br />
                2. In <strong>Supabase → Authentication → Users → Add User</strong>, create their account with that exact email and a temporary password.
                <br />
                3. They sign in at <code>/login</code> and can edit only their <strong>About</strong>, <strong>Projects</strong>, and <strong>Socials</strong> at <code>/account</code>.
              </div>
            </div>

            <div className={styles.panel}>
              <div className={styles.panelTitle}>
                <span>Team Hierarchy ({teamMembers.length})</span>
              </div>

              {teamMembers.length === 0 ? (
                <p className={styles.empty}>No team members found.</p>
              ) : (
                <div className={styles.list}>
                  {topLevelMembers.map((m) => {
                    const subCoords = coordsByParent.get(m.id) || [];
                    return (
                      <div key={m.id} className={styles.itemCard}>
                        <div className={styles.itemTop}>
                          <div>
                            <div className={styles.itemTitle}>{m.name}</div>
                            <div className={styles.itemMeta}>
                              {m.role} · Order #{m.order_index}
                              {m.course ? ` · ${m.course}` : ''}
                              {m.member_email ? ` · ${m.member_email}` : ''}
                              {m.projects && m.projects.length > 0
                                ? ` · ${m.projects.length} project${m.projects.length > 1 ? 's' : ''}`
                                : ''}
                            </div>
                          </div>
                          <span className={styles.badge}>
                            {m.is_faculty ? 'Faculty' : 'Head'}
                          </span>
                        </div>

                        {m.bio && <p className={styles.itemDesc}>{m.bio}</p>}

                        <div className={styles.itemControls}>
                          <button
                            type="button"
                            disabled={isMutating || m.order_index <= 0}
                            onClick={() =>
                              handleReorderMember(m.id, m.order_index - 1)
                            }
                            className={styles.secondaryBtn}
                            aria-label={`Move ${m.name} up`}
                            title="Move up"
                          >
                            &uarr;
                          </button>
                          <button
                            type="button"
                            disabled={isMutating}
                            onClick={() =>
                              handleReorderMember(m.id, m.order_index + 1)
                            }
                            className={styles.secondaryBtn}
                            aria-label={`Move ${m.name} down`}
                            title="Move down"
                          >
                            &darr;
                          </button>
                          {!m.is_faculty && (
                            <button
                              type="button"
                              onClick={() => {
                                setEditingMember(null);
                                setDefaultParentId(m.id);
                              }}
                              className={styles.secondaryBtn}
                            >
                              + Add Coordinator
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => setEditingMember(m)}
                            className={styles.secondaryBtn}
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            disabled={isMutating}
                            onClick={() => handleDeleteMember(m.id, m.name)}
                            className={styles.dangerBtn}
                          >
                            Remove
                          </button>
                        </div>

                        {subCoords.length > 0 && (
                          <div className={styles.subCoordList}>
                            <span className={styles.subCoordLabel}>
                              Team Coordinators ({subCoords.length})
                            </span>
                            {subCoords.map((coord) => (
                              <div key={coord.id} className={styles.subCoordCard}>
                                <div className={styles.itemTop}>
                                  <div>
                                    <div className={styles.itemTitle} style={{ fontSize: '0.9rem' }}>
                                      {coord.name}
                                    </div>
                                    <div className={styles.itemMeta}>
                                      {coord.role} · Order #{coord.order_index}
                                      {coord.member_email ? ` · ${coord.member_email}` : ''}
                                    </div>
                                  </div>
                                  <span className={styles.badge}>Coordinator</span>
                                </div>
                                <div className={styles.itemControls}>
                                  <button
                                    type="button"
                                    disabled={isMutating || coord.order_index <= 0}
                                    onClick={() =>
                                      handleReorderMember(coord.id, coord.order_index - 1)
                                    }
                                    className={styles.secondaryBtn}
                                    aria-label={`Move ${coord.name} up`}
                                  >
                                    &uarr;
                                  </button>
                                  <button
                                    type="button"
                                    disabled={isMutating}
                                    onClick={() =>
                                      handleReorderMember(coord.id, coord.order_index + 1)
                                    }
                                    className={styles.secondaryBtn}
                                    aria-label={`Move ${coord.name} down`}
                                  >
                                    &darr;
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => setEditingMember(coord)}
                                    className={styles.secondaryBtn}
                                  >
                                    Edit
                                  </button>
                                  <button
                                    type="button"
                                    disabled={isMutating}
                                    onClick={() => handleDeleteMember(coord.id, coord.name)}
                                    className={styles.dangerBtn}
                                  >
                                    Remove
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* GALLERY TAB */}
        {activeTab === 'gallery' && (
          <div className={styles.sectionGrid}>
            <div className={styles.panel}>
              <div className={styles.panelTitle}>
                <span>Add Event Photo</span>
              </div>

              <form
                key={`new-photo-${photoFormNonce}`}
                action={createPhotoAction}
                className={styles.form}
              >
                <div className={styles.field}>
                  <label htmlFor="ph-title" className={styles.label}>
                    Photo Title *
                  </label>
                  <input
                    id="ph-title"
                    name="title"
                    required
                    placeholder="e.g. ESP32 Rover Demo Day"
                    className={styles.input}
                  />
                </div>

                <div className={styles.field}>
                  <label htmlFor="ph-url" className={styles.label}>
                    Image URL (https://...) *
                  </label>
                  <input
                    id="ph-url"
                    name="image_url"
                    type="url"
                    required
                    placeholder="https://... (Supabase Storage, Drive, Imgur, etc.)"
                    className={styles.input}
                  />
                </div>

                <div className={styles.formRow}>
                  <div className={styles.field}>
                    <label htmlFor="ph-event" className={styles.label}>
                      Event Name
                    </label>
                    <input
                      id="ph-event"
                      name="event_name"
                      placeholder="e.g. IgniteHacks 2026"
                      className={styles.input}
                    />
                  </div>
                  <div className={styles.field}>
                    <label htmlFor="ph-date" className={styles.label}>
                      Date
                    </label>
                    <input
                      id="ph-date"
                      name="taken_date"
                      placeholder="e.g. Nov 2026"
                      className={styles.input}
                    />
                  </div>
                </div>

                <div className={styles.field}>
                  <label htmlFor="ph-order" className={styles.label}>
                    Order Index
                  </label>
                  <input
                    id="ph-order"
                    name="order_index"
                    type="number"
                    defaultValue={0}
                    className={styles.input}
                  />
                </div>

                <div className={styles.field}>
                  <label htmlFor="ph-caption" className={styles.label}>
                    Caption (optional)
                  </label>
                  <textarea
                    id="ph-caption"
                    name="caption"
                    placeholder="Short caption about this moment..."
                    className={styles.textarea}
                  />
                </div>

                {createPhotoState && !createPhotoState.success && (
                  <p className={styles.feedbackError}>
                    {createPhotoState.message}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={isCreatingPhoto}
                  className={styles.primaryBtn}
                >
                  {isCreatingPhoto ? 'Adding photo...' : 'Publish Photo'}
                </button>
              </form>
            </div>

            <div className={styles.panel}>
              <div className={styles.panelTitle}>
                <span>Event Gallery ({photos.length})</span>
              </div>

              {photos.length === 0 ? (
                <p className={styles.empty}>
                  No event photos added yet. Publish your first photo on the left.
                </p>
              ) : (
                <div className={styles.list}>
                  {photos.map((photo) => (
                    <div key={photo.id} className={styles.itemCard}>
                      <div className={styles.itemTop}>
                        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={photo.image_url}
                            alt={photo.title}
                            style={{
                              width: '72px',
                              height: '54px',
                              objectFit: 'cover',
                              borderRadius: '6px',
                              border: '1px solid var(--border)',
                              flexShrink: 0,
                            }}
                          />
                          <div>
                            <div className={styles.itemTitle}>{photo.title}</div>
                            <div className={styles.itemMeta}>
                              {photo.event_name || 'IgniteX IoT Event'}
                              {photo.taken_date ? ` · ${photo.taken_date}` : ''} · Order #
                              {photo.order_index}
                            </div>
                          </div>
                        </div>
                        <button
                          type="button"
                          disabled={isMutating}
                          onClick={() => handleDeletePhoto(photo.id, photo.title)}
                          className={styles.dangerBtn}
                        >
                          Remove
                        </button>
                      </div>
                      {photo.caption && (
                        <p className={styles.itemDesc}>{photo.caption}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* REGISTRATIONS TAB */}
        {activeTab === 'registrations' && (
          <div className={styles.panel}>
            <div className={styles.toolbar}>
              <div className={styles.toolbarInputs}>
                <select
                  value={regEventFilter}
                  onChange={(e) => setRegEventFilter(e.target.value)}
                  className={styles.select}
                  style={{ maxWidth: '260px' }}
                  aria-label="Filter registrations by event"
                >
                  <option value="all">All Events</option>
                  {events.map((ev) => (
                    <option key={ev.id} value={ev.id}>
                      {ev.title}
                    </option>
                  ))}
                </select>

                <input
                  type="search"
                  value={regSearch}
                  onChange={(e) => setRegSearch(e.target.value)}
                  placeholder="Search name, email, or roll no..."
                  className={styles.input}
                  style={{ maxWidth: '280px' }}
                />
              </div>

              <button
                type="button"
                onClick={exportRegistrationsCsv}
                disabled={filteredRegistrations.length === 0}
                className={styles.secondaryBtn}
              >
                Export CSV ({filteredRegistrations.length})
              </button>
            </div>

            {filteredRegistrations.length === 0 ? (
              <p className={styles.empty}>No registrations match your filter.</p>
            ) : (
              <div className={styles.list}>
                {filteredRegistrations.map((reg) => (
                  <div
                    key={reg.id || `${reg.event_id}-${reg.email}`}
                    className={styles.itemCard}
                  >
                    <div className={styles.itemTop}>
                      <div>
                        <div className={styles.itemTitle}>{reg.full_name}</div>
                        <div className={styles.itemMeta}>
                          {reg.email} · Roll: {reg.roll_number}
                          {reg.branch ? ` · ${reg.branch}` : ''}
                          {reg.semester ? ` (Sem ${reg.semester})` : ''}
                          {reg.phone ? ` · ${reg.phone}` : ''}
                        </div>
                      </div>
                      <span className={styles.badge}>
                        {eventTitleById.get(reg.event_id) || 'Event'}
                      </span>
                    </div>

                    {reg.id && (
                      <div className={styles.itemControls}>
                        <button
                          type="button"
                          disabled={isMutating}
                          onClick={() =>
                            handleDeleteRegistration(reg.id!, reg.full_name)
                          }
                          className={styles.dangerBtn}
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* MESSAGES TAB */}
        {activeTab === 'messages' && (
          <div className={styles.panel}>
            <div className={styles.panelTitle}>
              <span>Contact Inquiries ({filteredMessages.length})</span>
              <input
                type="search"
                value={msgSearch}
                onChange={(e) => setMsgSearch(e.target.value)}
                placeholder="Search inquiries..."
                className={styles.input}
                style={{ maxWidth: '240px', padding: '6px 10px', fontSize: '0.8rem' }}
                aria-label="Search contact inquiries"
              />
            </div>

            {filteredMessages.length === 0 ? (
              <p className={styles.empty}>
                {messages.length === 0
                  ? 'No contact messages received yet.'
                  : 'No messages match your search.'}
              </p>
            ) : (
              <div className={styles.list}>
                {filteredMessages.map((msg) => (
                  <div
                    key={msg.id || `${msg.email}-${msg.created_at}`}
                    className={styles.itemCard}
                  >
                    <div className={styles.itemTop}>
                      <div>
                        <div className={styles.itemTitle}>{msg.name}</div>
                        <div className={styles.itemMeta}>
                          {msg.email}
                          {msg.created_at
                            ? ` · ${new Date(msg.created_at).toLocaleString()}`
                            : ''}
                        </div>
                      </div>
                    </div>

                    <p className={styles.itemDesc}>{msg.message}</p>

                    {msg.id && (
                      <div className={styles.itemControls}>
                        <button
                          type="button"
                          disabled={isMutating}
                          onClick={() => handleDeleteMessage(msg.id!)}
                          className={styles.dangerBtn}
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Professional Confirmation Modal */}
      {confirmState && (
        <div
          className={styles.confirmOverlay}
          role="dialog"
          aria-modal="true"
          aria-labelledby="admin-confirm-title"
          onClick={() => {
            if (!isMutating) setConfirmState(null);
          }}
        >
          <div
            className={styles.confirmDialog}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.confirmHeader}>
              <span
                className={
                  confirmState.variant === 'danger'
                    ? styles.confirmIconDanger
                    : styles.confirmIconPrimary
                }
                aria-hidden="true"
              >
                {confirmState.variant === 'danger' ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 6h18" />
                    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                  </svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                )}
              </span>
              <h2 id="admin-confirm-title" className={styles.confirmTitle}>
                {confirmState.title}
              </h2>
            </div>

            <p className={styles.confirmDesc}>{confirmState.description}</p>

            <div className={styles.confirmActions}>
              <button
                type="button"
                disabled={isMutating}
                onClick={() => setConfirmState(null)}
                className={styles.confirmCancelBtn}
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isMutating}
                onClick={runConfirmedAction}
                className={
                  confirmState.variant === 'danger'
                    ? styles.confirmDangerBtn
                    : styles.confirmPrimaryBtn
                }
              >
                {isMutating ? 'Processing...' : confirmState.confirmLabel}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

