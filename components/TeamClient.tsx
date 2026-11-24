'use client';

import { useState } from 'react';
import { TeamMember } from '@/lib/types';
import TeamCard from './TeamCard';
import MemberModal from './MemberModal';
import styles from './TeamSection.module.css';

interface TeamClientProps {
  facultyMembers: TeamMember[];
  studentHeads: TeamMember[];
}

export default function TeamClient({
  facultyMembers,
  studentHeads,
}: TeamClientProps) {
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);

  return (
    <>
      {/* Faculty Advisors */}
      <div className={styles.facultySection}>
        <h2 className={styles.subheading}>Faculty Coordinators</h2>
        <div className={styles.facultyGrid}>
          {facultyMembers.map((member) => (
            <TeamCard
              key={member.id}
              member={member}
              onSelectMember={setSelectedMember}
            />
          ))}
        </div>
      </div>

      {/* Student Leadership */}
      <div className={styles.studentsSection}>
        <h2 className={styles.subheading}>Student Leadership</h2>
        <div className={styles.teamGrid}>
          {studentHeads.map((member) => (
            <TeamCard
              key={member.id}
              member={member}
              onSelectMember={setSelectedMember}
            />
          ))}
        </div>
      </div>

      {/* Member Detail Modal */}
      <MemberModal
        member={selectedMember}
        isOpen={selectedMember !== null}
        onClose={() => setSelectedMember(null)}
      />
    </>
  );
}

