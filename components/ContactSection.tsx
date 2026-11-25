import { Reveal } from './MotionKit';
import SocialLinks from './SocialLinks';
import styles from './ContactSection.module.css';

export default function ContactSection() {
  return (
    <section id="contact" className={styles.section}>
      <div className="container">
        <Reveal>
          <div className={styles.header}>
            <p className={styles.categoryTag}>Connect</p>
            <h2 className={styles.title}>Reach Out &amp; Follow Us</h2>
            <p className={styles.subtitle}>
              Have a question, collaboration idea, or want to stay updated on upcoming sessions?
              Reach us directly via email or our community channels.
            </p>
          </div>
        </Reveal>

        <Reveal delay={80}>
          <div className={styles.infoGrid}>
            <div className={styles.infoBlock}>
              <span className={styles.infoLabel}>Department</span>
              <h3 className={styles.infoHeading}>
                School of Computer Science and Applications (CSA)
              </h3>
              <p className={styles.infoText}>
                IgniteX IoT Club &middot; Student-Driven Technology Community
              </p>
            </div>

            <div className={styles.infoBlock}>
              <span className={styles.infoLabel}>Email Inquiries</span>
              <a
                href="mailto:revaiotclub@gmail.com"
                className={styles.emailLink}
              >
                revaiotclub@gmail.com
              </a>
              <p className={styles.infoText}>
                For any queries, event details, or partnership requests.
              </p>
            </div>

            <div className={styles.infoBlock}>
              <span className={styles.infoLabel}>Socials</span>
              <p className={styles.infoText}>
                Follow updates or join our community channels:
              </p>
              <div style={{ marginTop: '4px' }}>
                <SocialLinks />
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
