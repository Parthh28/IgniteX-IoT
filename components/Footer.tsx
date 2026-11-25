import Image from 'next/image';
import SocialLinks from './SocialLinks';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.inner}`}>
        <div className={styles.topRow}>
          <div className={styles.brand}>
            <Image
              src="/logo.png"
              alt="IgniteX IoT Club logo"
              width={40}
              height={40}
              className={styles.brandLogo}
            />
            <div className={styles.brandText}>
              <span className={styles.brandName}>
                Ignite<span className={styles.brandAccent}>X</span>{' '}
                <span className={styles.brandIot}>IoT</span> Club
              </span>
              <span className={styles.tagline}>
                Connect &middot; Automate &middot; Innovate
              </span>
            </div>
          </div>

          <div className={styles.contactGroup}>
            <a
              href="mailto:revaiotclub@gmail.com"
              className={styles.emailLink}
            >
              revaiotclub@gmail.com
            </a>

            <SocialLinks compact />
          </div>
        </div>

        <div className={styles.bottomRow}>
          <p className={styles.copyright}>
            &copy; 2026 IgniteX IoT Club. All rights reserved.
          </p>
          <span className={styles.focusArea}>
            School of CSA &middot; Coding &middot; AI &middot; IoT
          </span>
        </div>
      </div>
    </footer>
  );
}
