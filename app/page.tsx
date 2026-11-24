import HeroSection from '@/components/HeroSection';
import AnnouncementsSection from '@/components/AnnouncementsSection';
import GallerySection from '@/components/GallerySection';
import ContactSection from '@/components/ContactSection';

export const revalidate = 60;

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <AnnouncementsSection />
      <GallerySection />
      <ContactSection />
    </>
  );
}
