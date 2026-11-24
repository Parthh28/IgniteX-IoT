'use client';

import { useEffect, useState } from 'react';
import styles from './IntroOverlay.module.css';

const INTRO_STORAGE_KEY = 'ignitex_intro_seen';

export default function IntroOverlay() {
  const [visible, setVisible] = useState(false);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const reducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    if (reducedMotion) return;

    try {
      if (sessionStorage.getItem(INTRO_STORAGE_KEY) === '1') {
        return;
      }
    } catch {
      // continue if sessionStorage is unavailable
    }

    setVisible(true);

    const exitTimer = setTimeout(() => {
      setExiting(true);
      try {
        sessionStorage.setItem(INTRO_STORAGE_KEY, '1');
      } catch {
        // ignore storage errors
      }
    }, 2200);

    const hideTimer = setTimeout(() => {
      setVisible(false);
    }, 2750);

    return () => {
      clearTimeout(exitTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      className={`${styles.overlay} ${exiting ? styles.exiting : ''}`}
      aria-hidden="true"
    >
      <div className={styles.stage}>
        {/* Animated IoT Signal Pulse Emblem */}
        <div className={styles.pulseWrap}>
          <span className={styles.pulseRingOuter} />
          <span className={styles.pulseRingInner} />
          <span className={styles.pulseCore} />
        </div>

        {/* Masked Editorial Wordmark Reveal */}
        <div className={styles.wordmarkMask}>
          <div className={styles.wordmarkRow}>
            <span className={styles.igniteText}>
              Ignite<span className={styles.brandX}>X</span>
            </span>
            <span className={styles.iotText}>IoT</span>
          </div>
        </div>

        {/* Sweeping Signal Hairline */}
        <div className={styles.dividerTrack}>
          <span className={styles.dividerBeam} />
        </div>

        {/* Monospace Tagline with Tracking Tighten */}
        <p className={styles.tagline}>
          Connect &middot; Automate &middot; Innovate
        </p>
      </div>
    </div>
  );
}
