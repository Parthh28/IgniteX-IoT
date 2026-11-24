import { createClient, isSupabaseConfigured } from '@/lib/supabase/server';
import { EventPhoto } from '@/lib/types';
import GalleryClient from './GalleryClient';
import { Reveal } from './MotionKit';
import styles from './GallerySection.module.css';

export default async function GallerySection() {
  let photos: EventPhoto[] = [];

  if (isSupabaseConfigured()) {
    try {
      const supabase = await createClient();
      const { data, error } = await supabase
        .from('event_photos')
        .select('*')
        .order('order_index', { ascending: true })
        .order('created_at', { ascending: false });

      if (!error && data) {
        photos = data as EventPhoto[];
      }
    } catch (err) {
      console.error('Error fetching event photos:', err);
    }
  }

  return (
    <section id="gallery" className={styles.section}>
      <div className="container">
        <Reveal>
          <div className={styles.header}>
            <p className={styles.categoryTag}>Event Gallery</p>
            <h2 className={styles.title}>Moments from Our Labs &amp; Events</h2>
            <p className={styles.subtitle}>
              Snapshots from workshops, hardware builds, hackathons, and campus
              sessions. Click any photo to view full size.
            </p>
          </div>
        </Reveal>

        <GalleryClient photos={photos} />
      </div>
    </section>
  );
}

