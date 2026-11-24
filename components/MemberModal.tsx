'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import { TeamMember } from '@/lib/types';
import styles from './MemberModal.module.css';

interface MemberModalProps {
  member: TeamMember | null;
  isOpen: boolean;
  onClose: () => void;
}

function isStudentLead(member: TeamMember): boolean {
  if (member.is_faculty) return false;
  const r = member.role.toLowerCase();
  return r.includes('president') || r.includes('head');
}

export default function MemberModal({ member, isOpen, onClose }: MemberModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.setAttribute('data-modal-open', 'true');
    } else {
      document.body.removeAttribute('data-modal-open');
    }

    return () => {
      document.body.removeAttribute('data-modal-open');
    };
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!mounted || !isOpen || !member) return null;

  const isFaculty = member.is_faculty;
  const isLead = isStudentLead(member);
  const initial = member.name.charAt(0).toUpperCase();
  const aboutText =
    member.bio ||
    `${member.name} serves as ${member.role} at IgniteX IoT Club, contributing to hardware engineering, workshops, and student-led technical initiatives.`;
  const courseText =
    member.course ||
    (member.is_faculty
      ? 'Department of Computer Engineering (Faculty Mentor)'
      : 'B.Tech Engineering · IgniteX IoT Club');
  const projectsList =
    member.projects && member.projects.length > 0
      ? member.projects
      : ['Club Hardware & IoT Prototyping Initiatives'];

  const socials = member.social_links || {};
  const hasSocials = Boolean(
    socials.github || socials.linkedin || socials.instagram || socials.email
  );

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return createPortal(
    <div
      className={styles.overlay}
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-label={`${member.name} profile details`}
    >
      <div
        className={`${styles.modal} ${
          isFaculty
            ? styles.modalSenior
            : isLead
            ? styles.modalCoord
            : ''
        }`}
      >
        <button
          type="button"
          className={styles.closeBtn}
          onClick={onClose}
          aria-label="Close member profile"
        >
          &times;
        </button>

        {/* Top: Photo -> Name -> Role */}
        <div className={styles.profileTop}>
          {member.photo_url ? (
            <Image
              src={member.photo_url}
              alt={member.name}
              width={88}
              height={88}
              unoptimized
              className={`${styles.avatarPhoto} ${
                isFaculty
                  ? styles.avatarPhotoSenior
                  : isLead
                  ? styles.avatarPhotoLead
                  : ''
              }`}
            />
          ) : (
            <div
              className={`${styles.avatarFallback} ${
                isFaculty
                  ? styles.avatarFallbackSenior
                  : isLead
                  ? styles.avatarFallbackLead
                  : ''
              }`}
              aria-hidden="true"
            >
              {initial}
            </div>
          )}

          <h3 className={styles.name}>{member.name}</h3>
          <span
            className={`${styles.roleBadge} ${
              isFaculty
                ? styles.roleBadgeSenior
                : isLead
                ? styles.roleBadgeLead
                : ''
            }`}
          >
            {member.role}
          </span>
        </div>

        {/* Details: Course -> About -> Projects -> Social Links */}
        <div className={styles.sections}>
          <div className={styles.infoGroup}>
            <span className={styles.groupLabel}>Course</span>
            <p className={styles.groupText}>{courseText}</p>
          </div>

          <div className={styles.infoGroup}>
            <span className={styles.groupLabel}>About</span>
            <p className={styles.groupText}>{aboutText}</p>
          </div>

          <div className={styles.infoGroup}>
            <span className={styles.groupLabel}>Projects</span>
            <ul className={styles.projectList}>
              {projectsList.map((project, idx) => (
                <li key={idx} className={styles.projectItem}>
                  {project}
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.infoGroup}>
            <span className={styles.groupLabel}>Social Links</span>
            <div className={styles.socialList}>
              {socials.github && (
                <a
                  href={socials.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.socialLink}
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                    <path d="M9 18c-4.51 2-5-2-7-2" />
                  </svg>
                  <span>GitHub</span>
                </a>
              )}
              {socials.linkedin && (
                <a
                  href={socials.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.socialLink}
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                    <rect width="4" height="12" x="2" y="9" />
                    <circle cx="4" cy="4" r="2" />
                  </svg>
                  <span>LinkedIn</span>
                </a>
              )}
              {socials.instagram && (
                <a
                  href={socials.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.socialLink}
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                  </svg>
                  <span>Instagram</span>
                </a>
              )}
              {socials.email && (
                <a
                  href={`mailto:${socials.email}`}
                  className={styles.socialLink}
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <rect width="20" height="16" x="2" y="4" rx="2" />
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                  </svg>
                  <span>Email</span>
                </a>
              )}
              {!hasSocials && (
                <span className={styles.groupText}>No public links added yet.</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
