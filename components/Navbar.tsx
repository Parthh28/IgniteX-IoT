'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import styles from './Navbar.module.css';

export interface NavUser {
  href: '/admin' | '/account';
  name: string;
  photoUrl?: string | null;
  isAdmin: boolean;
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() || '')
    .join('');
}

const navItems = [
  { label: 'Home', href: '/', sectionId: 'home', isPage: false },
  { label: 'Announcements', href: '/#announcements', sectionId: 'announcements', isPage: false },
  { label: 'Gallery', href: '/#gallery', sectionId: 'gallery', isPage: false },
  { label: 'Contact', href: '/#contact', sectionId: 'contact', isPage: false },
  { label: 'Events', href: '/events', sectionId: 'events', isPage: true },
  { label: 'Team', href: '/team', sectionId: 'team', isPage: true },
];

export default function Navbar({ navUser = null }: { navUser?: NavUser | null }) {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;
      setIsScrolled(y > 20);
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(docHeight > 0 ? Math.min(1, Math.max(0, y / docHeight)) : 0);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsMenuOpen(false);
      }
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  useEffect(() => {
    if (pathname === '/team') {
      setActiveSection('team');
      return;
    }
    if (pathname === '/events') {
      setActiveSection('events');
      return;
    }
    if (pathname !== '/') {
      setActiveSection('');
      return;
    }

    const sectionElements = navItems
      .filter((item) => !item.isPage)
      .map((item) => document.getElementById(item.sectionId))
      .filter((el): el is HTMLElement => el !== null);

    if (sectionElements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        threshold: 0.2,
        rootMargin: '-72px 0px 0px 0px',
      }
    );

    sectionElements.forEach((el) => observer.observe(el));

    return () => {
      sectionElements.forEach((el) => observer.unobserve(el));
    };
  }, [pathname]);

  const handleNavClick = () => {
    setIsMenuOpen(false);
  };

  const handleSectionLinkClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    item: (typeof navItems)[number]
  ) => {
    setIsMenuOpen(false);
    if (item.isPage || pathname !== '/') return;

    e.preventDefault();
    if (item.sectionId === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      window.history.replaceState(null, '', '/');
      setActiveSection('home');
      return;
    }

    const target = document.getElementById(item.sectionId);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      window.history.replaceState(null, '', '/');
      setActiveSection(item.sectionId);
    }
  };

  return (
    <header className={styles.header}>
      {/* Top Scroll Progress Line */}
      <div
        aria-hidden="true"
        className={styles.progressBar}
        style={{ transform: `scaleX(${scrollProgress})` }}
      />

      <div
        id="navbar"
        className={`${styles.navContainer} ${isScrolled ? styles.scrolled : ''}`}
      >
        {/* Brand */}
        <Link
          href="/"
          className={styles.logoLink}
          onClick={handleNavClick}
          aria-label="IgniteX IoT Club Home"
        >
          <Image
            src="/ignitex-logo.png"
            alt="IgniteX IoT Club logo"
            width={48}
            height={48}
            className={styles.logoImage}
            priority
          />
          <span className={styles.logoText}>
            Ignite<span className={styles.logoAccent}>X</span>{' '}
            <span className={styles.logoIot}>IoT</span>
          </span>
        </Link>

        {/* Desktop Links & Action */}
        <nav className={styles.desktopNav} aria-label="Primary navigation">
          <ul className={styles.navLinks}>
            {navItems.map((item, idx) => {
              const isActive = item.isPage
                ? pathname === item.href
                : pathname === '/' && activeSection === item.sectionId;
              const isFirstPageItem = item.isPage && !navItems[idx - 1]?.isPage;

              return (
                <li
                  key={item.sectionId}
                  className={isFirstPageItem ? styles.navPageItem : undefined}
                >
                  <Link
                    href={item.href}
                    className={`${styles.navLink} ${isActive ? styles.activeLink : ''}`}
                    onClick={(e) => handleSectionLinkClick(e, item)}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className={styles.navActions}>
            <Link
              href="/events"
              className={styles.navCta}
              onClick={handleNavClick}
            >
              Explore Events
            </Link>
            {navUser ? (
              <Link
                key="nav-profile"
                href={navUser.href}
                className={`${styles.profileAvatarBtn} ${
                  pathname === navUser.href ? styles.profileAvatarActive : ''
                }`}
                onClick={handleNavClick}
                aria-label={
                  navUser.isAdmin
                    ? 'Admin Console'
                    : `${navUser.name} Profile`
                }
                title={
                  navUser.isAdmin
                    ? 'Admin Console'
                    : `${navUser.name} · My Profile`
                }
              >
                {navUser.photoUrl ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={navUser.photoUrl}
                    alt={navUser.name}
                    className={styles.profileAvatarImg}
                  />
                ) : (
                  <span className={styles.profileAvatarInitials}>
                    {getInitials(navUser.name)}
                  </span>
                )}
              </Link>
            ) : (
              <Link
                key="nav-login"
                href="/login"
                className={`${styles.adminBtn} ${
                  pathname === '/login' ? styles.adminBtnActive : ''
                }`}
                onClick={handleNavClick}
              >
                Login
              </Link>
            )}
          </div>
        </nav>

        {/* Mobile Hamburger */}
        <button
          className={`${styles.hamburger} ${isMenuOpen ? styles.hamburgerOpen : ''}`}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle navigation menu"
          aria-expanded={isMenuOpen}
        >
          <span className={styles.bar}></span>
          <span className={styles.bar}></span>
          <span className={styles.bar}></span>
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`${styles.mobileMenu} ${isMenuOpen ? styles.mobileMenuOpen : ''}`}
      >
        {navItems.map((item) => {
          const isActive = item.isPage
            ? pathname === item.href
            : pathname === '/' && activeSection === item.sectionId;

          return (
            <Link
              key={item.sectionId}
              href={item.href}
              className={`${styles.mobileNavLink} ${isActive ? styles.mobileNavActive : ''}`}
              onClick={(e) => handleSectionLinkClick(e, item)}
            >
              {item.label}
            </Link>
          );
        })}
        <Link
          href="/events"
          className={styles.mobileCta}
          onClick={handleNavClick}
        >
          Explore Events
        </Link>
        {navUser ? (
          <Link
            key="mobile-profile"
            href={navUser.href}
            className={styles.mobileProfileLink}
            onClick={handleNavClick}
          >
            <span className={styles.mobileProfileCircle}>
              {navUser.photoUrl ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={navUser.photoUrl}
                  alt={navUser.name}
                  className={styles.profileAvatarImg}
                />
              ) : (
                <span className={styles.profileAvatarInitials}>
                  {getInitials(navUser.name)}
                </span>
              )}
            </span>
            <span>
              {navUser.isAdmin ? 'Admin Console' : `${navUser.name} · Profile`}
            </span>
          </Link>
        ) : (
          <Link
            key="mobile-login"
            href="/login"
            className={styles.mobileAdminLink}
            onClick={handleNavClick}
          >
            Login
          </Link>
        )}
      </div>
    </header>
  );
}
