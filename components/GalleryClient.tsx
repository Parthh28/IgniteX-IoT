'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { EventPhoto } from '@/lib/types';
import { Reveal } from './MotionKit';
import styles from './GallerySection.module.css';

interface GalleryClientProps {
  photos: EventPhoto[];
}

export default function GalleryClient({ photos }: GalleryClientProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (activeIndex === null) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActiveIndex(null);
      if (e.key === 'ArrowRight') {
        setActiveIndex((prev) =>
          prev === null ? null : (prev + 1) % photos.length
        );
      }
      if (e.key === 'ArrowLeft') {
        setActiveIndex((prev) =>
          prev === null ? null : (prev - 1 + photos.length) % photos.length
        );
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [activeIndex, photos.length]);

  if (photos.length === 0) {
    return (
      <Reveal>
        <div className={styles.emptyBox}>
          <div className={styles.emptyTitle}>Event Gallery Coming Soon</div>
          <p className={styles.emptyText}>
            Photos from our workshops, hardware sprints, and hackathons will
            appear here as soon as they are published from the Admin Console.
          </p>
        </div>
      </Reveal>
    );
  }

  const activePhoto = activeIndex !== null ? photos[activeIndex] : null;

  return (
    <>
      <div className={styles.grid}>
        {photos.map((photo, idx) => (
          <Reveal key={photo.id} delay={idx * 70}>
            <button
              type="button"
              className={styles.card}
              onClick={() => setActiveIndex(idx)}
              aria-label={`View photo: ${photo.title}`}
            >
              <div className={styles.imageFrame}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={photo.image_url}
                  alt={photo.title}
                  loading="lazy"
                  className={styles.photo}
                />
              </div>
              <div className={styles.cardBody}>
                <div className={styles.metaRow}>
                  <span className={styles.eventTag}>
                    {photo.event_name || 'IgniteX IoT Event'}
                  </span>
                  {photo.taken_date && (
                    <span className={styles.dateText}>{photo.taken_date}</span>
                  )}
                </div>
                <h3 className={styles.photoTitle}>{photo.title}</h3>
                {photo.caption && (
                  <p className={styles.caption}>{photo.caption}</p>
                )}
              </div>
            </button>
          </Reveal>
        ))}
      </div>

      {mounted &&
        activePhoto &&
        createPortal(
          <div
            className={styles.lightboxOverlay}
            role="dialog"
            aria-modal="true"
            aria-label={activePhoto.title}
            onClick={() => setActiveIndex(null)}
          >
            <div
              className={styles.lightboxContent}
              onClick={(e) => e.stopPropagation()}
            >
              <div className={styles.lightboxImgWrap}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={activePhoto.image_url}
                  alt={activePhoto.title}
                  className={styles.lightboxImg}
                />
              </div>
              <div className={styles.lightboxFooter}>
                <div>
                  <div className={styles.eventTag}>
                    {activePhoto.event_name || 'IgniteX IoT Event'}
                    {activePhoto.taken_date ? ` · ${activePhoto.taken_date}` : ''}
                  </div>
                  <div className={styles.photoTitle}>{activePhoto.title}</div>
                  {activePhoto.caption && (
                    <p className={styles.caption}>{activePhoto.caption}</p>
                  )}
                </div>

                <div className={styles.lightboxControls}>
                  {photos.length > 1 && (
                    <>
                      <button
                        type="button"
                        className={styles.lightboxBtn}
                        onClick={() =>
                          setActiveIndex((prev) =>
                            prev === null
                              ? 0
                              : (prev - 1 + photos.length) % photos.length
                          )
                        }
                      >
                        &larr; Prev
                      </button>
                      <button
                        type="button"
                        className={styles.lightboxBtn}
                        onClick={() =>
                          setActiveIndex((prev) =>
                            prev === null ? 0 : (prev + 1) % photos.length
                          )
                        }
                      >
                        Next &rarr;
                      </button>
                    </>
                  )}
                  <button
                    type="button"
                    className={styles.lightboxBtn}
                    onClick={() => setActiveIndex(null)}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}

