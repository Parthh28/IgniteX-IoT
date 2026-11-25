import styles from './Skeletons.module.css';

export function AnnouncementsSkeleton() {
  return (
    <section className={styles.section} aria-busy="true" aria-label="Loading announcements">
      <div className="container">
        <div className={styles.headerStack}>
          <div className={`${styles.bone} ${styles.eyebrow}`} />
          <div className={`${styles.bone} ${styles.title}`} />
          <div className={`${styles.bone} ${styles.subtitle}`} />
        </div>
        <div className={styles.listFrame}>
          {[0, 1, 2].map((i) => (
            <div key={i} className={styles.listItem}>
              <div className={styles.cardRow}>
                <div className={`${styles.bone} ${styles.badge}`} />
                <div className={`${styles.bone} ${styles.lineShort}`} style={{ width: '90px' }} />
              </div>
              <div className={`${styles.bone} ${styles.lineMed}`} />
              <div className={`${styles.bone} ${styles.lineFull}`} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function GallerySkeleton() {
  return (
    <section className={styles.section} aria-busy="true" aria-label="Loading gallery">
      <div className="container">
        <div className={styles.headerStack}>
          <div className={`${styles.bone} ${styles.eyebrow}`} />
          <div className={`${styles.bone} ${styles.title}`} />
          <div className={`${styles.bone} ${styles.subtitle}`} />
        </div>
        <div className={styles.gridThree}>
          {[0, 1, 2].map((i) => (
            <div key={i} className={styles.card}>
              <div className={`${styles.bone} ${styles.mediaBox}`} />
              <div className={`${styles.bone} ${styles.lineMed}`} />
              <div className={`${styles.bone} ${styles.lineShort}`} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function HomeSkeleton() {
  return (
    <div aria-busy="true" aria-label="Loading homepage">
      <section className={styles.section}>
        <div className="container">
          <div className={styles.heroRow}>
            <div className={styles.heroCopy}>
              <div className={`${styles.bone} ${styles.eyebrow}`} style={{ width: '240px' }} />
              <div className={`${styles.bone} ${styles.heroTitle}`} />
              <div className={`${styles.bone} ${styles.heroTitleShort}`} />
              <div className={`${styles.bone} ${styles.lineFull}`} />
              <div className={`${styles.bone} ${styles.lineMost}`} />
              <div className={styles.heroActions}>
                <div className={`${styles.bone} ${styles.btn}`} />
                <div className={`${styles.bone} ${styles.btn}`} />
              </div>
            </div>
            <div className={`${styles.bone} ${styles.heroLogo}`} />
          </div>

          <div className={styles.statsStrip}>
            {[0, 1, 2].map((i) => (
              <div key={i} className={styles.statCell}>
                <div className={`${styles.bone} ${styles.statNum}`} />
                <div className={styles.statLines}>
                  <div className={`${styles.bone} ${styles.lineShort}`} style={{ width: '110px' }} />
                  <div className={`${styles.bone} ${styles.lineShort}`} style={{ width: '160px' }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <AnnouncementsSkeleton />
      <GallerySkeleton />
    </div>
  );
}

export function EventsSkeleton() {
  return (
    <section className={styles.pageSection} aria-busy="true" aria-label="Loading events">
      <div className="container">
        <div className={styles.headerStack}>
          <div className={`${styles.bone} ${styles.eyebrow}`} />
          <div className={`${styles.bone} ${styles.title}`} />
          <div className={`${styles.bone} ${styles.subtitle}`} />
        </div>
        <div className={`${styles.bone} ${styles.filterBar}`} />
        <div className={styles.gridThree}>
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <div key={i} className={styles.card}>
              <div className={styles.cardRow}>
                <div className={`${styles.bone} ${styles.badge}`} />
                <div className={`${styles.bone} ${styles.lineShort}`} style={{ width: '80px' }} />
              </div>
              <div className={`${styles.bone} ${styles.lineMed}`} />
              <div className={`${styles.bone} ${styles.lineFull}`} />
              <div className={`${styles.bone} ${styles.lineMost}`} />
              <div className={`${styles.bone} ${styles.btn}`} style={{ width: '100%', marginTop: '8px' }} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function TeamSkeleton() {
  return (
    <section className={styles.pageSection} aria-busy="true" aria-label="Loading team">
      <div className="container">
        <div className={styles.headerStack}>
          <div className={`${styles.bone} ${styles.eyebrow}`} />
          <div className={`${styles.bone} ${styles.title}`} />
          <div className={`${styles.bone} ${styles.subtitle}`} />
        </div>
        <div className={styles.gridThree}>
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <div key={i} className={styles.card}>
              <div className={styles.avatarRow}>
                <div className={`${styles.bone} ${styles.avatar}`} />
                <div className={styles.statLines}>
                  <div className={`${styles.bone} ${styles.lineShort}`} style={{ width: '90px' }} />
                  <div className={`${styles.bone} ${styles.lineMed}`} />
                </div>
              </div>
              <div className={`${styles.bone} ${styles.lineFull}`} />
              <div className={`${styles.bone} ${styles.lineMost}`} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function AdminSkeleton() {
  return (
    <section className={styles.pageSection} aria-busy="true" aria-label="Loading admin console">
      <div className="container">
        <div className={styles.headerStack}>
          <div className={`${styles.bone} ${styles.eyebrow}`} />
          <div className={`${styles.bone} ${styles.title}`} style={{ width: '280px' }} />
        </div>
        <div className={styles.tabBar}>
          {[0, 1, 2, 3, 4].map((i) => (
            <div key={i} className={`${styles.bone} ${styles.tab}`} />
          ))}
        </div>
        <div className={styles.listFrame}>
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className={styles.listItem}>
              <div className={styles.cardRow}>
                <div className={`${styles.bone} ${styles.lineMed}`} style={{ width: '40%' }} />
                <div className={`${styles.bone} ${styles.badge}`} />
              </div>
              <div className={`${styles.bone} ${styles.lineMost}`} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function AccountSkeleton() {
  return (
    <section className={styles.pageSection} aria-busy="true" aria-label="Loading account studio">
      <div className="container">
        <div className={styles.accountCard}>
          <div className={styles.avatarRow}>
            <div className={`${styles.bone} ${styles.avatar}`} />
            <div className={styles.statLines}>
              <div className={`${styles.bone} ${styles.lineMed}`} style={{ width: '180px' }} />
              <div className={`${styles.bone} ${styles.lineShort}`} style={{ width: '130px' }} />
            </div>
          </div>
          <div className={`${styles.bone} ${styles.inputSkeleton}`} />
          <div className={`${styles.bone} ${styles.inputSkeleton}`} style={{ height: '96px' }} />
          <div className={`${styles.bone} ${styles.inputSkeleton}`} />
          <div className={`${styles.bone} ${styles.btn}`} />
        </div>
      </div>
    </section>
  );
}

