'use client';

import { useActionState, useState } from 'react';
import Link from 'next/link';
import {
  changeMemberPasswordAction,
  memberSignOutAction,
  updateMemberProfileAction,
} from '@/app/actions/auth';
import { TeamMember } from '@/lib/types';
import styles from './Account.module.css';

interface AccountEditorProps {
  userEmail: string;
  member: TeamMember | null;
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || '')
    .join('');
}

export default function AccountEditor({
  userEmail,
  member,
}: AccountEditorProps) {
  const [bio, setBio] = useState(member?.bio || '');
  const [projects, setProjects] = useState<string[]>(member?.projects || []);
  const [newProject, setNewProject] = useState('');

  const [linkedin, setLinkedin] = useState(member?.social_links?.linkedin || '');
  const [instagram, setInstagram] = useState(
    member?.social_links?.instagram || ''
  );
  const [github, setGithub] = useState(member?.social_links?.github || '');
  const [publicEmail, setPublicEmail] = useState(
    member?.social_links?.email || userEmail
  );

  const [profileState, profileAction, isSavingProfile] = useActionState(
    updateMemberProfileAction,
    null
  );
  const [pwState, pwAction, isChangingPw] = useActionState(
    changeMemberPasswordAction,
    null
  );

  const handleAddProject = () => {
    const trimmed = newProject.trim();
    if (!trimmed || projects.length >= 6) return;
    if (!projects.includes(trimmed)) {
      setProjects((prev) => [...prev, trimmed]);
    }
    setNewProject('');
  };

  const handleRemoveProject = (index: number) => {
    setProjects((prev) => prev.filter((_, idx) => idx !== index));
  };

  const displayName = member?.name || userEmail.split('@')[0];
  const displayRole = member?.role || 'Club Member';

  return (
    <section className={styles.page}>
      <div className="container">
        <header className={styles.header}>
          <div>
            <p className={styles.brandTag}>
              Ignite<span className={styles.brandX}>X</span>{' '}
              <span className={styles.brandIot}>IoT</span> Club &middot; Member
              Account
            </p>
            <h1 className={styles.title}>Profile Settings</h1>
            <p className={styles.subtitle}>
              Manage your public About, Projects, and Social links displayed on
              the IgniteX IoT Team page.
            </p>
          </div>

          <div className={styles.headerActions}>
            <Link href="/team" className={styles.secondaryBtn}>
              View Team Page &rarr;
            </Link>
            <form action={memberSignOutAction}>
              <button type="submit" className={styles.secondaryBtn}>
                Sign Out
              </button>
            </form>
          </div>
        </header>

        <div className={styles.grid}>
          {/* Left: Restricted Profile Editor (About, Projects, Socials ONLY) */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h2 className={styles.cardTitle}>Public Website Profile</h2>
              <span className={styles.lockBadge}>Name &amp; Role: Admin-Managed</span>
            </div>

            <div className={styles.identityStrip}>
              <span className={styles.avatar}>{getInitials(displayName)}</span>
              <div>
                <div className={styles.identityName}>{displayName}</div>
                <div className={styles.identityMeta}>
                  {displayRole}
                  {member?.course ? ` · ${member.course}` : ''} · {userEmail}
                </div>
              </div>
            </div>

            {!member ? (
              <p className={styles.alertError}>
                Your account ({userEmail}) is signed in, but is not yet linked to
                a Team roster entry. Please ask the club admin to link your email
                in the Admin Console.
              </p>
            ) : (
              <form action={profileAction} className={styles.form}>
                {/* 1. About */}
                <div className={styles.field}>
                  <div className={styles.labelRow}>
                    <label htmlFor="member-bio" className={styles.label}>
                      About
                    </label>
                    <span className={styles.hint}>{bio.length} / 600</span>
                  </div>
                  <textarea
                    id="member-bio"
                    name="bio"
                    maxLength={600}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Write a concise summary of your technical focus, interests, and role in the club..."
                    className={styles.textarea}
                    disabled={isSavingProfile}
                  />
                </div>

                {/* 2. Projects */}
                <div className={styles.field}>
                  <div className={styles.labelRow}>
                    <label htmlFor="member-project-input" className={styles.label}>
                      Projects
                    </label>
                    <span className={styles.hint}>
                      {projects.length} / 6 shown on your profile
                    </span>
                  </div>

                  <input
                    type="hidden"
                    name="projects_text"
                    value={projects.join('\n')}
                  />

                  <div className={styles.projectAddRow}>
                    <input
                      id="member-project-input"
                      type="text"
                      value={newProject}
                      onChange={(e) => setNewProject(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddProject();
                        }
                      }}
                      placeholder="e.g. ESP32 Autonomous Telemetry Rover"
                      className={styles.input}
                      disabled={isSavingProfile || projects.length >= 6}
                    />
                    <button
                      type="button"
                      onClick={handleAddProject}
                      disabled={
                        isSavingProfile ||
                        projects.length >= 6 ||
                        !newProject.trim()
                      }
                      className={styles.secondaryBtn}
                    >
                      Add
                    </button>
                  </div>

                  {projects.length > 0 && (
                    <div className={styles.projectList}>
                      {projects.map((proj, idx) => (
                        <div key={`${proj}-${idx}`} className={styles.projectItem}>
                          <span>{proj}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveProject(idx)}
                            className={styles.removeBtn}
                            aria-label={`Remove ${proj}`}
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* 3. Socials */}
                <div className={styles.field}>
                  <span className={styles.label}>Socials</span>
                  <div className={styles.socialsGrid}>
                    <div className={styles.field}>
                      <label htmlFor="soc-linkedin" className={styles.hint}>
                        LinkedIn URL
                      </label>
                      <input
                        id="soc-linkedin"
                        name="linkedin"
                        type="url"
                        value={linkedin}
                        onChange={(e) => setLinkedin(e.target.value)}
                        placeholder="https://linkedin.com/in/..."
                        className={styles.input}
                        disabled={isSavingProfile}
                      />
                    </div>

                    <div className={styles.field}>
                      <label htmlFor="soc-instagram" className={styles.hint}>
                        Instagram URL
                      </label>
                      <input
                        id="soc-instagram"
                        name="instagram"
                        type="url"
                        value={instagram}
                        onChange={(e) => setInstagram(e.target.value)}
                        placeholder="https://instagram.com/..."
                        className={styles.input}
                        disabled={isSavingProfile}
                      />
                    </div>

                    <div className={styles.field}>
                      <label htmlFor="soc-github" className={styles.hint}>
                        GitHub URL
                      </label>
                      <input
                        id="soc-github"
                        name="github"
                        type="url"
                        value={github}
                        onChange={(e) => setGithub(e.target.value)}
                        placeholder="https://github.com/..."
                        className={styles.input}
                        disabled={isSavingProfile}
                      />
                    </div>

                    <div className={styles.field}>
                      <label htmlFor="soc-email" className={styles.hint}>
                        Public Email
                      </label>
                      <input
                        id="soc-email"
                        name="public_email"
                        type="email"
                        value={publicEmail}
                        onChange={(e) => setPublicEmail(e.target.value)}
                        placeholder="you@example.com"
                        className={styles.input}
                        disabled={isSavingProfile}
                      />
                    </div>
                  </div>
                </div>

                {profileState && (
                  <p
                    className={
                      profileState.success
                        ? styles.alertSuccess
                        : styles.alertError
                    }
                    role="status"
                  >
                    {profileState.message}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={isSavingProfile}
                  className={styles.primaryBtn}
                >
                  {isSavingProfile
                    ? 'Publishing changes...'
                    : 'Save & Publish Profile'}
                </button>
              </form>
            )}
          </div>

          {/* Right Column: Live Website Preview + Password Reset */}
          <div className={styles.stack}>
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <h2 className={styles.cardTitle}>Live Website Preview</h2>
                <span className={styles.lockBadge}>/team</span>
              </div>

              <div className={styles.previewCard}>
                <div className={styles.identityStrip} style={{ marginBottom: 0 }}>
                  <span className={styles.avatar}>
                    {getInitials(displayName)}
                  </span>
                  <div>
                    <div className={styles.identityName}>{displayName}</div>
                    <div className={styles.identityMeta}>{displayRole}</div>
                  </div>
                </div>

                <div>
                  <div className={styles.previewSectionLabel}>About</div>
                  <p className={styles.previewBio}>
                    {bio.trim() || 'Your About summary will appear here.'}
                  </p>
                </div>

                <div>
                  <div className={styles.previewSectionLabel}>Projects</div>
                  {projects.length > 0 ? (
                    <div className={styles.previewChips}>
                      {projects.map((p, i) => (
                        <span key={`${p}-${i}`} className={styles.previewChip}>
                          {p}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className={styles.hint}>No projects added yet.</p>
                  )}
                </div>

                <div>
                  <div className={styles.previewSectionLabel}>Socials</div>
                  <div className={styles.previewChips}>
                    {linkedin && <span className={styles.previewChip}>LinkedIn</span>}
                    {instagram && <span className={styles.previewChip}>Instagram</span>}
                    {github && <span className={styles.previewChip}>GitHub</span>}
                    {publicEmail && <span className={styles.previewChip}>Email</span>}
                    {!linkedin && !instagram && !github && !publicEmail && (
                      <span className={styles.hint}>No social links added yet.</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <h2 className={styles.cardTitle}>Reset / Change Password</h2>
              </div>

              <form action={pwAction} className={styles.form}>
                <div className={styles.field}>
                  <label htmlFor="new-pw" className={styles.label}>
                    New Password (min 8 characters)
                  </label>
                  <input
                    id="new-pw"
                    name="new_password"
                    type="password"
                    required
                    minLength={8}
                    autoComplete="new-password"
                    placeholder="Enter new password"
                    className={styles.input}
                    disabled={isChangingPw}
                  />
                </div>

                <div className={styles.field}>
                  <label htmlFor="confirm-pw" className={styles.label}>
                    Confirm New Password
                  </label>
                  <input
                    id="confirm-pw"
                    name="confirm_password"
                    type="password"
                    required
                    minLength={8}
                    autoComplete="new-password"
                    placeholder="Re-enter new password"
                    className={styles.input}
                    disabled={isChangingPw}
                  />
                </div>

                {pwState && (
                  <p
                    className={
                      pwState.success ? styles.alertSuccess : styles.alertError
                    }
                    role="status"
                  >
                    {pwState.message}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={isChangingPw}
                  className={styles.secondaryBtn}
                  style={{ width: '100%', padding: '10px 14px' }}
                >
                  {isChangingPw ? 'Updating password...' : 'Update Password'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

