import { Suspense } from 'react';
import HeroSection from '@/components/HeroSection';
import AnnouncementsSection from '@/components/AnnouncementsSection';
import GallerySection from '@/components/GallerySection';
import ContactSection from '@/components/ContactSection';
import {
  AnnouncementsSkeleton,
  GallerySkeleton,
} from '@/components/Skeletons';

export const revalidate = 60;

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <Suspense fallback={<AnnouncementsSkeleton />}>
        <AnnouncementsSection />
      </Suspense>
      <Suspense fallback={<GallerySkeleton />}>
        <GallerySection />
      </Suspense>
      <ContactSection />
    </>
  );
}
