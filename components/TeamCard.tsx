'use client';

import { useState } from 'react';
import Image from 'next/image';
import { TeamMember } from '@/lib/types';
import styles from './TeamSection.module.css';

interface TeamCardProps {
  member: TeamMember;
  onSelectMember: (member: TeamMember) => void;
}

function isStudentLead(member: TeamMember): boolean {
  if (member.is_faculty) return false;
  const r = member.role.toLowerCase();
  return r.includes('president') || r.includes('head');
}

export default function TeamCard({ member, onSelectMember }: TeamCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const isFaculty = member.is_faculty;
  const isLead = isStudentLead(member);
  const hasSubCoordinators =
    member.sub_coordinators && member.sub_coordinators.length > 0;
  const initial = member.name.charAt(0).toUpperCase();

  return (
    <div
      className={`${styles.card} ${
        isFaculty ? styles.facultyCard : isLead ? styles.leadCard : ''
      }`}
    >
      <button
        type="button"
        className={styles.cardBodyButton}
        onClick={() => onSelectMember(member)}
        aria-label={`View profile details for ${member.name}`}
      >
        {/* Avatar */}
        <div className={styles.avatarContainer}>
          {member.photo_url ? (
            <Image
              src={member.photo_url}
              alt={member.name}
              width={68}
              height={68}
              unoptimized
              className={styles.avatarPhoto}
            />
          ) : (
            <div
              className={`${styles.avatarFallback} ${
                isFaculty
                  ? styles.facultyFallback
                  : isLead
                  ? styles.leadFallback
                  : ''
              }`}
              aria-hidden="true"
            >
              {initial}
            </div>
          )}
        </div>

        {/* Member Details */}
        <h4 className={styles.memberName}>{member.name}</h4>
        <span
          className={`${styles.roleBadge} ${
            isFaculty
              ? styles.roleBadgeFaculty
              : isLead
              ? styles.roleBadgeLead
              : ''
          }`}
        >
          {member.role}
        </span>
        {member.bio && <p className={styles.memberBio}>{member.bio}</p>}
        <span className={styles.viewProfileHint}>View profile &rarr;</span>
      </button>

      {/* Accordion Toggle */}
      {hasSubCoordinators && (
        <>
          <button
            type="button"
            className={styles.expandButton}
            onClick={() => setIsExpanded(!isExpanded)}
            aria-expanded={isExpanded}
            aria-controls={`subteam-${member.id}`}
          >
            <span>
              {isExpanded
                ? 'Hide Coordinators'
                : `View Coordinators (${member.sub_coordinators?.length})`}
            </span>
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={`${styles.expandChevron} ${
                isExpanded ? styles.expandChevronOpen : ''
              }`}
              aria-hidden="true"
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
          </button>

          {isExpanded && (
            <div id={`subteam-${member.id}`} className={styles.subTeamPanel}>
              <span className={styles.subTeamHeading}>Sub-Team Coordinators</span>
              {member.sub_coordinators?.map((coord) => (
                <button
                  key={coord.id}
                  type="button"
                  className={styles.coordinatorItem}
                  onClick={() => onSelectMember(coord)}
                  aria-label={`View profile details for ${coord.name}`}
                >
                  <div className={styles.coordAvatar}>
                    {coord.name.charAt(0).toUpperCase()}
                  </div>
                  <div className={styles.coordInfo}>
                    <span className={styles.coordName}>{coord.name}</span>
                    <span className={styles.coordRole}>{coord.role}</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
