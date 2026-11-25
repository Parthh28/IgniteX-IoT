import Link from 'next/link';
import Image from 'next/image';
import { createClient, isSupabaseConfigured } from '@/lib/supabase/server';
import { Event } from '@/lib/types';
import {
  AnimatedCounter,
  FloatWrapper,
  Reveal,
  SpotlightCard,
} from './MotionKit';
import styles from './HeroSection.module.css';

const MISSION_POINTS = [
  {
    code: '01',
    title: 'Curiosity First',
    text: 'Promote curiosity and continuous learning beyond the classroom.',
  },
  {
    code: '02',
    title: 'Hands-On Craft',
    text: 'Encourage practical, hands-on technical knowledge over pure theory.',
  },
  {
    code: '03',
    title: 'Emerging Tech',
    text: 'Provide opportunities to explore AI, IoT, software, and modern tools.',
  },
  {
    code: '04',
    title: 'Critical Thinking',
    text: 'Develop creativity, critical thinking, and problem-solving skills.',
  },
  {
    code: '05',
    title: 'Teamwork & Leadership',
    text: 'Build teamwork, communication, and student leadership abilities.',
  },
  {
    code: '06',
    title: 'Shared Innovation',
    text: 'Create an environment where students learn, share, and innovate together.',
  },
];

const CORE_ACTIVITIES = [
  {
    title: 'Workshops & Technical Sessions',
    text: 'Hands-on sessions exploring tools, programming languages, AI, and IoT with live demonstrations.',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
      </svg>
    ),
  },
  {
    title: 'Hackathons & Innovation',
    text: 'Time-boxed challenges to brainstorm, collaborate, and build creative solutions to real problems.',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
      </svg>
    ),
  },
  {
    title: 'Project Development',
    text: 'A space for solo and team builds—turning prototypes and rough ideas into working applications.',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="4" width="16" height="16" rx="2" />
        <rect x="9" y="9" width="6" height="6" />
        <path d="M9 1v3M15 1v3M9 20v3M15 20v3M20 9h3M20 14h3M1 9h3M1 14h3" />
      </svg>
    ),
  },
  {
    title: 'Technical Competitions',
    text: 'Coding contests, debugging sprints, tech quizzes, and problem-solving games that test your skills.',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
        <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
        <path d="M4 22h16" />
        <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
        <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
        <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
      </svg>
    ),
  },
];

const COMMUNITY_ACTIVITIES = [
  {
    title: 'Knowledge Sharing',
    text: 'Peer-led sessions where members share their skills, project learnings, and new discoveries.',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
      </svg>
    ),
  },
  {
    title: 'Expert Talks & Mentorship',
    text: 'Learn directly from experienced professionals, guest speakers, mentors, and senior members.',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
        <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
        <line x1="12" y1="19" x2="12" y2="22" />
      </svg>
    ),
  },
  {
    title: 'Community & Collaboration',
    text: 'Connect with students who share your passion and grow together in a supportive environment.',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
];

const MEMBER_BENEFITS = [
  'Learn technologies beyond your academic syllabus',
  'Participate in workshops, competitions, and events',
  'Work on real-world projects and build your portfolio',
  'Collaborate with students across different backgrounds',
  'Learn from seniors, mentors, and fellow innovators',
  'Improve your communication and teamwork skills',
  'Explore new interests without fear of mistakes',
  'Turn your ideas into something real',
];

export default async function HeroSection() {
  let pastEvents: Event[] = [];

  if (isSupabaseConfigured()) {
    try {
      const supabase = await createClient();
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('status', 'closed')
        .order('created_at', { ascending: false })
        .limit(3);

      if (!error && data) {
        pastEvents = data as Event[];
      }
    } catch (err) {
      console.error('Error fetching past events in HeroSection:', err);
    }
  }

  return (
    <div id="home">
      {/* Hero Band */}
      <section className={styles.heroBand}>
        <div className="container">
          <div className={styles.heroGrid}>
            <div className={styles.heroContent}>
              <Reveal delay={0}>
                <p className={styles.eyebrow}>
                  <span className={styles.eyebrowBrand}>
                    Ignite<span className={styles.brandX}>X</span>{' '}
                    <span className={styles.brandIot}>IoT</span> Club
                  </span>{' '}
                  &middot; School of Computer Science &amp; Applications (CSA)
                </p>
              </Reveal>

              <Reveal delay={80}>
                <h1 className={styles.title}>
                  Where curiosity sparks ideas, and ideas become real solutions.
                </h1>
              </Reveal>

              <Reveal delay={160}>
                <p className={styles.subTagline}>
                  A student-driven technology club under the School of CSA. From coding and
                  artificial intelligence to IoT and creative problem-solving,{' '}
                  <span className={styles.inlineBrand}>
                    Ignite<span className={styles.brandX}>X</span>{' '}
                    <span className={styles.brandIot}>IoT</span>
                  </span>{' '}
                  brings learners and creators together to experiment and build beyond the classroom.
                </p>
              </Reveal>

              <Reveal delay={240}>
                <div className={styles.ctaGroup}>
                  <Link href="/events" className={styles.primaryCta}>
                    <span>Explore Events</span>
                    <span aria-hidden="true">&rarr;</span>
                  </Link>
                  <Link href="/#contact" className={styles.secondaryCta}>
                    Become a Member
                  </Link>
                </div>
              </Reveal>
            </div>

            <Reveal delay={180} direction="right" className={styles.heroLogoWrap}>
              <FloatWrapper>
                <Image
                  src="/logo.png"
                  alt="IgniteX IoT Club Emblem"
                  width={260}
                  height={260}
                  className={styles.heroLogo}
                  priority
                />
              </FloatWrapper>
            </Reveal>
          </div>

          {/* Stats Strip */}
          <Reveal delay={220}>
            <div className={styles.statsGrid}>
              <SpotlightCard className={styles.statItem} accent="blue">
                <span className={styles.statNumber}>
                  <AnimatedCounter target={10} suffix="+" />
                </span>
                <div className={styles.statMeta}>
                  <span className={styles.statTitle}>Events Hosted</span>
                  <span className={styles.statDesc}>Workshops, hackathons &amp; competitions</span>
                </div>
              </SpotlightCard>
              <SpotlightCard className={styles.statItem} accent="orange">
                <span className={styles.statNumber}>
                  <AnimatedCounter target={15} />
                </span>
                <div className={styles.statMeta}>
                  <span className={styles.statTitle}>Active Members</span>
                  <span className={styles.statDesc}>Learners, creators &amp; innovators</span>
                </div>
              </SpotlightCard>
              <SpotlightCard className={styles.statItem} accent="blue">
                <span className={styles.statNumber}>
                  <AnimatedCounter target={1} />
                </span>
                <div className={styles.statMeta}>
                  <span className={styles.statTitle}>Year Active</span>
                  <span className={styles.statDesc}>School of CSA community</span>
                </div>
              </SpotlightCard>
            </div>
          </Reveal>
        </div>
      </section>

      {/* About, Vision & Mission Band */}
      <section className={styles.band}>
        <div className="container">
          <Reveal>
            <div className={styles.aboutBlock}>
              <p className={styles.bandEyebrow}>About Us</p>
              <h2 className={styles.bandTitle}>
                Every great innovation begins with curiosity and the courage to start.
              </h2>
              <p className={styles.bandDesc}>
                <span className={styles.inlineBrand}>
                  Ignite<span className={styles.brandX}>X</span>{' '}
                  <span className={styles.brandIot}>IoT</span>
                </span>{' '}
                is a student-driven technology club under the School of Computer Science and
                Applications (CSA), dedicated to exploring emerging tech, collaborating on
                projects, and turning ideas into practical solutions through hands-on experience.
              </p>
            </div>
          </Reveal>

          <Reveal delay={80}>
            <blockquote className={styles.visionQuoteBox}>
              <div className={styles.visionMeta}>
                <span className={styles.visionTag}>Our Vision</span>
              </div>
              <p className={styles.visionLead}>
                &ldquo;We envision a future where students are not just users of technology, but
                creators, innovators, and problem-solvers who contribute meaningfully to
                society.&rdquo;
              </p>
              <footer className={styles.visionBody}>
                Building a community of curious, creative, and technology-driven students who use
                innovation, knowledge, and collaboration for real-world challenges.
              </footer>
            </blockquote>
          </Reveal>

          <Reveal delay={120}>
            <div className={styles.missionBlock}>
              <div className={styles.missionHeader}>
                <div>
                  <p className={`${styles.bandEyebrow} ${styles.bandEyebrowOrange}`}>
                    Our Mission
                  </p>
                  <h3 className={styles.missionTitle}>
                    Explore emerging tech, build real-world projects.
                  </h3>
                </div>
                <p className={styles.missionSub}>
                  Six principles guiding our workshops, events, and peer builds.
                </p>
              </div>

              <div className={styles.missionGrid}>
                {MISSION_POINTS.map((point) => (
                  <div key={point.code} className={styles.missionCell}>
                    <span className={styles.missionCode}>{point.code}</span>
                    <h4 className={styles.missionCellTitle}>{point.title}</h4>
                    <p className={styles.missionCellText}>{point.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* What We Do — Our Activities */}
      <section className={styles.band}>
        <div className="container">
          <Reveal>
            <div className={styles.splitHeader}>
              <div className={styles.bandHeaderCompact}>
                <p className={styles.bandEyebrow}>What We Do</p>
                <h2 className={styles.bandTitle}>Our Activities</h2>
                <p className={styles.bandDesc}>
                  Practical sessions, team challenges, and peer learning designed to help you build
                  real confidence with technology.
                </p>
              </div>
              <Link href="/events" className={styles.sectionLink}>
                <span>Explore events</span>
                <span aria-hidden="true">&rarr;</span>
              </Link>
            </div>
          </Reveal>

          <div className={styles.activitiesStack}>
            <Reveal delay={60}>
              <div className={styles.pillarsGridFour}>
                {CORE_ACTIVITIES.map((act) => (
                  <div key={act.title} className={styles.pillarCard}>
                    <div className={styles.pillarIconWrapper}>{act.icon}</div>
                    <h3 className={styles.pillarName}>{act.title}</h3>
                    <p className={styles.pillarText}>{act.text}</p>
                  </div>
                ))}
              </div>
            </Reveal>

            <Reveal delay={120}>
              <div className={styles.pillarsGridThree}>
                {COMMUNITY_ACTIVITIES.map((act) => (
                  <div key={act.title} className={styles.pillarCard}>
                    <div className={`${styles.pillarIconWrapper} ${styles.pillarIconWarm}`}>
                      {act.icon}
                    </div>
                    <h3 className={styles.pillarName}>{act.title}</h3>
                    <p className={styles.pillarText}>{act.text}</p>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Why Become a Member Band */}
      <section className={styles.band}>
        <div className="container">
          <div className={styles.joinWrapper}>
            <Reveal direction="left">
              <div className={styles.joinPitch}>
                <p className={styles.bandEyebrow}>Membership</p>
                <h2 className={styles.bandTitle}>Why Become a Member?</h2>
                <p className={styles.bandDesc}>
                  <span className={styles.inlineBrand}>
                    Ignite<span className={styles.brandX}>X</span>{' '}
                    <span className={styles.brandIot}>IoT</span>
                  </span>{' '}
                  is more than just a club. It&apos;s a place to explore your interests, discover new
                  technologies, and connect with people who share your passion for building.
                </p>
                <p className={styles.joinHighlight}>
                  You don&apos;t need to be an expert to join—just bring curiosity, enthusiasm, and
                  a willingness to learn.
                </p>
                <div className={styles.ctaGroup}>
                  <Link href="/#contact" className={styles.primaryCta}>
                    <span>Join the Club</span>
                    <span aria-hidden="true">&rarr;</span>
                  </Link>
                  <Link href="/#team" className={styles.secondaryCta}>
                    Meet the Team
                  </Link>
                </div>
              </div>
            </Reveal>

            <Reveal delay={100} direction="right">
              <div className={styles.benefitsGrid}>
                {MEMBER_BENEFITS.map((benefit, idx) => (
                  <div key={benefit} className={styles.benefitItem}>
                    <span className={styles.benefitNum}>
                      {String(idx + 1).padStart(2, '0')}
                    </span>
                    <span className={styles.benefitText}>{benefit}</span>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Past Highlights Band */}
      {pastEvents.length > 0 && (
        <section className={styles.band}>
          <div className="container">
            <Reveal>
              <div className={styles.splitHeader}>
                <div>
                  <p className={styles.bandEyebrow}>Selected highlights</p>
                  <h2 className={styles.bandTitle}>Recent workshops &amp; builds.</h2>
                </div>
                <Link href="/events" className={styles.sectionLink}>
                  <span>All events</span>
                  <span aria-hidden="true">&rarr;</span>
                </Link>
              </div>
            </Reveal>

            <div className={styles.pastGrid}>
              {pastEvents.map((event, idx) => (
                <Reveal key={event.id} delay={idx * 90}>
                  <SpotlightCard
                    className={styles.eventCard}
                    accent={idx % 2 === 0 ? 'blue' : 'orange'}
                  >
                    <div className={styles.eventMetaRow}>
                      <span className={styles.eventTag}>{event.tag}</span>
                      <span className={styles.eventDate}>{event.date}</span>
                    </div>
                    <h3 className={styles.eventTitle}>{event.title}</h3>
                    <p className={styles.eventDesc}>{event.description}</p>
                  </SpotlightCard>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
