import { createClient, isSupabaseConfigured } from '@/lib/supabase/server';
import { TeamMember } from '@/lib/types';
import TeamClient from './TeamClient';
import styles from './TeamSection.module.css';

export default async function TeamSection() {
  let facultyMembers: TeamMember[] = [];
  let studentHeads: TeamMember[] = [];

  if (isSupabaseConfigured()) {
    try {
      const supabase = await createClient();
      const { data, error } = await supabase
        .from('team_members')
        .select('*')
        .order('order_index', { ascending: true });

      if (!error && data) {
        const allMembers = data as TeamMember[];
        const primary = allMembers.filter((m) => !m.parent_id);
        const subCoords = allMembers.filter((m) => m.parent_id !== null);

        primary.forEach((lead) => {
          lead.sub_coordinators = subCoords.filter((s) => s.parent_id === lead.id);
        });

        facultyMembers = primary.filter((m) => m.is_faculty);
        studentHeads = primary.filter((m) => !m.is_faculty);
      }
    } catch (err) {
      console.error('Error fetching team members:', err);
    }
  }

  return (
    <section id="team" className={styles.section}>
      <div className="container">
        <div className={styles.header}>
          <p className={styles.categoryTag}>Leadership &amp; Mentorship</p>
          <h1 className={styles.title}>Meet the Team</h1>
          <p className={styles.subtitle}>
            Faculty mentors, student leads, and coordinators driving technical growth at IgniteX IoT.
            Click any member to view their course, projects, and links.
          </p>
        </div>

        <TeamClient
          facultyMembers={facultyMembers}
          studentHeads={studentHeads}
        />
      </div>
    </section>
  );
}
