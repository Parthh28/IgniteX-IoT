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
                  &middot; Engineering &amp; Innovation Collective
                </p>
              </Reveal>

              <Reveal delay={80}>
                <h1 className={styles.title}>
                  Engineering connected systems, intelligent software, and real-world prototypes.
                </h1>
              </Reveal>

              <Reveal delay={160}>
                <p className={styles.subTagline}>
                  Rooted in IoT and embedded hardware, Ignite<span className={styles.brandX}>X</span>{' '}
                  <span className={styles.brandIot}>IoT</span> Club unites student engineers building
                  across Artificial Intelligence, Robotics, Cybersecurity, Cloud, and Full-Stack
                  Development.
                </p>
              </Reveal>

              <Reveal delay={240}>
                <div className={styles.ctaGroup}>
                  <Link href="/events" className={styles.primaryCta}>
                    <span>Explore Events</span>
                    <span aria-hidden="true">&rarr;</span>
                  </Link>
                  <Link href="/team" className={styles.secondaryCta}>
                    Meet the Team
                  </Link>
                </div>
              </Reveal>
            </div>

            <Reveal delay={180} direction="right" className={styles.heroLogoWrap}>
              <FloatWrapper>
                <Image
                  src="/ignitex-logo.png"
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
                  <span className={styles.statDesc}>Workshops, hackathons &amp; seminars</span>
                </div>
              </SpotlightCard>
              <SpotlightCard className={styles.statItem} accent="orange">
                <span className={styles.statNumber}>
                  <AnimatedCounter target={15} />
                </span>
                <div className={styles.statMeta}>
                  <span className={styles.statTitle}>Active Members</span>
                  <span className={styles.statDesc}>Engineers, developers &amp; builders</span>
                </div>
              </SpotlightCard>
              <SpotlightCard className={styles.statItem} accent="blue">
                <span className={styles.statNumber}>
                  <AnimatedCounter target={1} />
                </span>
                <div className={styles.statMeta}>
                  <span className={styles.statTitle}>Year Active</span>
                  <span className={styles.statDesc}>Growing campus innovation</span>
                </div>
              </SpotlightCard>
            </div>
          </Reveal>
        </div>
      </section>

      {/* How IgniteX Works / About the Club Band */}
      <section className={styles.band}>
        <div className="container">
          <Reveal>
            <div className={styles.bandHeader}>
              <p className={styles.bandEyebrow}>What We Do</p>
              <h2 className={styles.bandTitle}>Built for builders across every frontier of tech.</h2>
              <p className={styles.bandDesc}>
                Ignite<span className={styles.brandX}>X</span>{' '}
                <span className={styles.brandIot}>IoT</span> Club is a student-driven engineering
                collective where ideas turn into shipped products. Through hands-on workshops,
                coding sprints, and hackathons, we bring together curious minds across software,
                AI, design, and smart systems.
              </p>
            </div>
          </Reveal>

          <Reveal delay={100}>
            <div className={styles.pillarsGrid}>
              <SpotlightCard className={styles.pillarCard} accent="blue">
                <div className={styles.pillarIconWrapper}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="16 18 22 12 16 6" />
                    <polyline points="8 6 2 12 8 18" />
                  </svg>
                </div>
                <h3 className={styles.pillarName}>Software &amp; Full-Stack</h3>
                <p className={styles.pillarText}>
                  Shipping modern web apps, backend APIs, developer tools, and scalable cloud products using industry-grade stacks.
                </p>
              </SpotlightCard>

              <SpotlightCard className={styles.pillarCard} accent="orange">
                <div className={styles.pillarIconWrapper}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2a4 4 0 0 0-4 4v2H6a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h2v3a4 4 0 0 0 8 0v-3h2a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2h-2V6a4 4 0 0 0-4-4z" />
                  </svg>
                </div>
                <h3 className={styles.pillarName}>AI &amp; Machine Learning</h3>
                <p className={styles.pillarText}>
                  Exploring applied AI, LLM workflows, computer vision, and intelligent automation built to solve real-world problems.
                </p>
              </SpotlightCard>

              <SpotlightCard className={styles.pillarCard} accent="blue">
                <div className={styles.pillarIconWrapper}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                  </svg>
                </div>
                <h3 className={styles.pillarName}>Hackathons &amp; Sprints</h3>
                <p className={styles.pillarText}>
                  Rapid prototyping, team collaboration, and live product demos across campus buildathons and national hackathons.
                </p>
              </SpotlightCard>

              <SpotlightCard className={styles.pillarCard} accent="orange">
                <div className={styles.pillarIconWrapper}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="14" height="14" x="5" y="5" rx="2" />
                    <path d="M9 1v4" /><path d="M15 1v4" />
                    <path d="M9 19v4" /><path d="M15 19v4" />
                    <path d="M1 9h4" /><path d="M1 15h4" />
                    <path d="M19 9h4" /><path d="M19 15h4" />
                  </svg>
                </div>
                <h3 className={styles.pillarName}>Hands-On IoT Workshops</h3>
                <p className={styles.pillarText}>
                  Interactive workshops where we teach students IoT fundamentals, microcontrollers, sensors, and building connected projects from scratch.
                </p>
              </SpotlightCard>
            </div>
          </Reveal>
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
