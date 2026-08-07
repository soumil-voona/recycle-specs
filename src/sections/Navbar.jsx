import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { currentUser, userData, logout } = useAuth();

  // Force solid navbar on pages with dark backgrounds like /chapters
  const isDarkPage = 
    location.pathname.startsWith('/chapters') || 
    location.pathname.startsWith('/volunteers') ||
    location.pathname.startsWith('/unlisted-chapter-signup');
  const isSolid = scrolled || isDarkPage;

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileMenuOpen]);

  const baseNavItems = [
    { name: 'Our Story',   targetId: 'about' },
    { name: 'Impact',      targetId: 'events' },
    { name: 'Team',        targetId: 'board' },
    { name: 'Partners',    targetId: 'partnerships' },
    { name: 'Journey',     targetId: 'timeline' },
    { name: 'Upcoming',    route: '/upcoming' },
  ];

  let navItems = [...baseNavItems];

  if (currentUser) {
    navItems.push({ name: 'Volunteer', route: '/volunteers' });
    if (userData?.chapterLead || userData?.foundingMember) {
      navItems.push({ name: 'Chapter Dashboard', route: '/chapters/dashboard' });
    }
    if (userData?.foundingMember) {
      navItems.push({ name: 'Admin', route: '/hq-admin' });
    }
    navItems.push({ name: 'Logout', action: 'logout' });
  } else {
    navItems.push({ name: 'Login', route: '/login' });
  }

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (!el) return;
    const nav = document.querySelector('.rs-navbar');
    const offset = nav ? nav.offsetHeight + 12 : 80;
    window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - offset, behavior: 'smooth' });
  };

  const handleNavClick = async (item) => {
    setMobileMenuOpen(false);
    
    if (item.action === 'logout') {
      await logout();
      navigate('/');
      return;
    }

    setTimeout(() => {
      if (item.route) {
        navigate(item.route);
        return;
      }
      if (location.pathname !== '/') {
        navigate('/', { state: { scrollTo: item.targetId } });
      } else {
        scrollToSection(item.targetId);
      }
    }, mobileMenuOpen ? 350 : 0);
  };

  const handleLogoClick = () => {
    setMobileMenuOpen(false);
    if (location.pathname === '/') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      navigate('/', { state: { scrollToTop: true } });
    }
  };

  return (
    <>
      <nav className={`rs-navbar navbar-wrapper ${isSolid ? 'scrolled' : ''}`}>
        <div className="rs-navbar__inner">
          {/* Logo */}
          <button className="rs-navbar__logo" onClick={handleLogoClick} aria-label="RecycleSpecs Home">
            <picture>
              <source srcSet="/imgs/logo.webp" type="image/webp" />
              <img src="/imgs/logo.png" alt="RecycleSpecs logo" className="rs-navbar__logo-img" />
            </picture>
            <div className="rs-navbar__logo-text">
              <span className="rs-navbar__logo-name">RecycleSpecs</span>
              <span className="rs-navbar__logo-tagline">Optical Access Initiative</span>
            </div>
          </button>

          {/* Desktop Nav */}
          <ul className="rs-navbar__menu">
            {navItems.map((item) => (
              <li key={item.name}>
                <button
                  className="rs-navbar__link"
                  onClick={() => handleNavClick(item)}
                >
                  {item.name}
                </button>
              </li>
            ))}
          </ul>

          {/* CTA */}
          <div className="rs-navbar__cta">
            <button
              className="rs-navbar__donate"
              onClick={() => {
                if (location.pathname !== '/') {
                  navigate('/', { state: { scrollTo: 'contact' } });
                } else {
                  scrollToSection('contact');
                }
              }}
            >
              <span>Get Involved</span>
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>

          {/* Hamburger */}
          <button
            className={`rs-navbar__hamburger ${mobileMenuOpen ? 'is-open' : ''}`}
            onClick={() => setMobileMenuOpen(v => !v)}
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            <span className="rs-navbar__bar bar-1" />
            <span className="rs-navbar__bar bar-2" />
            <span className="rs-navbar__bar bar-3" />
          </button>
        </div>
      </nav>

      {/* Mobile Overlay */}
      <div className={`rs-mobile-menu ${mobileMenuOpen ? 'is-open' : ''}`} role="dialog" aria-label="Navigation menu">
        <div className="rs-mobile-menu__content">
          <div className="rs-mobile-menu__header">
            <picture>
              <source srcSet="/imgs/logo.webp" type="image/webp" />
              <img src="/imgs/logo.png" alt="RecycleSpecs" style={{ height: '44px' }} />
            </picture>
            <button
              className="rs-mobile-menu__close"
              onClick={() => setMobileMenuOpen(false)}
              aria-label="Close menu"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
              </svg>
            </button>
          </div>

          <ul className="rs-mobile-menu__links">
            {navItems.map((item, i) => (
              <li key={item.name} style={{ animationDelay: `${0.06 * i}s` }}>
                <button
                  className="rs-mobile-menu__link"
                  onClick={() => handleNavClick(item)}
                >
                  {item.name}
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </li>
            ))}
          </ul>

          <div className="rs-mobile-menu__footer">
            <button
              className="rs-mobile-menu__cta"
              onClick={() => {
                setMobileMenuOpen(false);
                setTimeout(() => {
                  if (location.pathname !== '/') navigate('/', { state: { scrollTo: 'contact' } });
                  else scrollToSection('contact');
                }, 350);
              }}
            >
              Get Involved →
            </button>
            <p className="rs-mobile-menu__email">
              <a href="mailto:recycle.specs@gmail.com">recycle.specs@gmail.com</a>
            </p>
          </div>
        </div>

        {/* Decorative bg pattern */}
        <div className="rs-mobile-menu__deco" aria-hidden="true">
          <div className="rs-mobile-menu__deco-circle circle-1" />
          <div className="rs-mobile-menu__deco-circle circle-2" />
          <div className="rs-mobile-menu__deco-circle circle-3" />
        </div>
      </div>

      <style>{`
        /* ── Navbar ── */
        .rs-navbar {
          position: fixed;
          top: 0; left: 0; right: 0;
          z-index: 900;
          transition: background 0.4s ease, box-shadow 0.4s ease, padding 0.3s ease;
          padding: 0 clamp(1rem, 4vw, 3rem);
          box-shadow: 0 1px 0 rgba(64,58,58,0.08), 0 8px 32px rgba(64,58,58,0.06);
        }

        .rs-navbar::before {
          content: '';
          position: absolute;
          inset: 0;
          background: var(--bg-cream);
          backdrop-filter: blur(20px);
          z-index: -1;
        }

        .rs-navbar__inner {
          max-width: 1280px;
          margin: 0 auto;
          height: 72px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
        }

        /* Logo */
        .rs-navbar__logo {
          display: flex;
          align-items: center;
          gap: 12px;
          background: none;
          border: none;
          cursor: pointer;
          padding: 4px;
          border-radius: 8px;
          transition: transform 0.3s ease, opacity 0.2s ease;
          flex-shrink: 0;
        }
        .rs-navbar__logo:hover { transform: scale(1.03); }

        .rs-navbar__logo-img {
          height: 44px;
          width: auto;
          object-fit: contain;
        }

        .rs-navbar__logo-text {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
        }

        .rs-navbar__logo-name {
          font-family: 'Fraunces', Georgia, serif;
          font-weight: 700;
          font-size: 1.1rem;
          color: var(--text-primary);
          line-height: 1.2;
          letter-spacing: -0.02em;
        }

        .rs-navbar__logo-tagline {
          font-family: 'Inter', sans-serif;
          font-size: 0.65rem;
          font-weight: 500;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--rs-orange);
          line-height: 1;
        }

        /* Desktop Menu */
        .rs-navbar__menu {
          display: flex;
          list-style: none;
          gap: 4px;
          align-items: center;
        }

        .rs-navbar__link {
          font-family: 'Inter', sans-serif;
          font-weight: 500;
          font-size: 0.9rem;
          color: var(--text-secondary);
          background: none;
          border: none;
          cursor: pointer;
          padding: 8px 14px;
          border-radius: 8px;
          transition: all 0.2s ease;
          position: relative;
          letter-spacing: 0.01em;
        }
        .rs-navbar__link::after {
          content: '';
          position: absolute;
          bottom: 4px; left: 14px; right: 14px;
          height: 2px;
          background: var(--rs-orange);
          border-radius: 2px;
          transform: scaleX(0);
          transition: transform 0.25s var(--ease-out-expo);
          transform-origin: left;
        }
        .rs-navbar__link:hover {
          color: var(--text-primary);
          background: rgba(198, 93, 7, 0.06);
        }
        .rs-navbar__link:hover::after {
          transform: scaleX(1);
        }

        /* Donate Button */
        .rs-navbar__donate {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-family: 'Inter', sans-serif;
          font-weight: 600;
          font-size: 0.88rem;
          color: white;
          background: var(--rs-orange);
          border: none;
          border-radius: 10px;
          padding: 10px 20px;
          cursor: pointer;
          transition: all 0.3s var(--ease-out-expo);
          box-shadow: 0 4px 14px rgba(198, 93, 7, 0.28);
        }
        .rs-navbar__donate:hover {
          background: var(--rs-orange-dark);
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(198, 93, 7, 0.38);
        }

        /* Hamburger */
        .rs-navbar__hamburger {
          display: none;
          flex-direction: column;
          justify-content: center;
          gap: 5px;
          width: 40px;
          height: 40px;
          background: none;
          border: none;
          cursor: pointer;
          padding: 8px;
          border-radius: 8px;
          transition: background 0.2s ease;
        }
        .rs-navbar__hamburger:hover { background: rgba(64,58,58,0.06); }

        .rs-navbar__bar {
          display: block;
          width: 100%;
          height: 2px;
          background: var(--text-primary);
          border-radius: 2px;
          transition: transform 0.3s ease, opacity 0.2s ease;
          transform-origin: center;
        }
        .rs-navbar__hamburger.is-open .bar-1 {
          transform: translateY(7px) rotate(45deg);
        }
        .rs-navbar__hamburger.is-open .bar-2 {
          opacity: 0; transform: scaleX(0);
        }
        .rs-navbar__hamburger.is-open .bar-3 {
          transform: translateY(-7px) rotate(-45deg);
        }

        /* ── Mobile Menu ── */
        .rs-mobile-menu {
          position: fixed;
          inset: 0;
          z-index: 950;
          background: var(--bg-dark);
          display: flex;
          flex-direction: column;
          opacity: 0;
          visibility: hidden;
          transition: opacity 0.35s ease, visibility 0.35s ease;
          overflow: hidden;
        }
        .rs-mobile-menu.is-open {
          opacity: 1;
          visibility: visible;
        }

        .rs-mobile-menu__content {
          position: relative;
          z-index: 2;
          display: flex;
          flex-direction: column;
          height: 100%;
          padding: 0 2rem 2.5rem;
        }

        .rs-mobile-menu__header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 72px;
          flex-shrink: 0;
        }

        .rs-mobile-menu__close {
          background: rgba(255,255,255,0.08);
          border: none;
          border-radius: 10px;
          width: 40px; height: 40px;
          display: flex; align-items: center; justify-content: center;
          color: white;
          cursor: pointer;
          transition: background 0.2s ease;
        }
        .rs-mobile-menu__close:hover { background: rgba(255,255,255,0.14); }

        .rs-mobile-menu__links {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 6px;
          flex: 1;
          padding-top: 2rem;
        }

        .rs-mobile-menu__links li {
          opacity: 0;
          transform: translateX(-20px);
          animation: none;
        }
        .rs-mobile-menu.is-open .rs-mobile-menu__links li {
          animation: mobileItemIn 0.4s var(--ease-out-expo) both;
        }
        @keyframes mobileItemIn {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }

        .rs-mobile-menu__link {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          font-family: 'Fraunces', Georgia, serif;
          font-size: clamp(1.6rem, 5vw, 2.2rem);
          font-weight: 700;
          color: rgba(249, 244, 236, 0.9);
          background: none;
          border: none;
          border-bottom: 1px solid rgba(255,255,255,0.06);
          padding: 16px 0;
          cursor: pointer;
          text-align: left;
          letter-spacing: -0.02em;
          transition: color 0.2s ease, padding-left 0.25s ease;
        }
        .rs-mobile-menu__link:hover {
          color: var(--rs-gold-light);
          padding-left: 8px;
        }
        .rs-mobile-menu__link svg {
          opacity: 0.4;
          flex-shrink: 0;
          transition: opacity 0.2s ease, transform 0.2s ease;
        }
        .rs-mobile-menu__link:hover svg {
          opacity: 1;
          transform: translateX(4px);
        }

        .rs-mobile-menu__footer {
          flex-shrink: 0;
          display: flex;
          flex-direction: column;
          gap: 12px;
          padding-top: 2rem;
        }

        .rs-mobile-menu__cta {
          font-family: 'Inter', sans-serif;
          font-weight: 700;
          font-size: 1rem;
          color: white;
          background: var(--rs-orange);
          border: none;
          border-radius: 14px;
          padding: 16px 24px;
          cursor: pointer;
          transition: all 0.25s ease;
          text-align: center;
        }
        .rs-mobile-menu__cta:hover {
          background: var(--rs-orange-dark);
          transform: scale(1.02);
        }

        .rs-mobile-menu__email {
          text-align: center;
          font-size: 0.85rem;
          color: rgba(255,255,255,0.4);
        }
        .rs-mobile-menu__email a {
          color: rgba(255,255,255,0.5);
          transition: color 0.2s;
        }
        .rs-mobile-menu__email a:hover { color: var(--rs-gold-light); }

        /* Decorative circles */
        .rs-mobile-menu__deco {
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 1;
          overflow: hidden;
        }
        .rs-mobile-menu__deco-circle {
          position: absolute;
          border-radius: 50%;
          opacity: 0.06;
        }
        .circle-1 {
          width: 500px; height: 500px;
          background: var(--rs-teal);
          top: -200px; right: -200px;
        }
        .circle-2 {
          width: 300px; height: 300px;
          background: var(--rs-orange);
          bottom: 10%; left: -100px;
        }
        .circle-3 {
          width: 180px; height: 180px;
          background: var(--rs-gold);
          top: 40%; right: 5%;
        }

        /* ── Responsive ── */
        @media (max-width: 920px) {
          .rs-navbar__menu { display: none; }
          .rs-navbar__cta { display: none; }
          .rs-navbar__hamburger { display: flex; }
        }
        @media (max-width: 480px) {
          .rs-navbar__logo-tagline { display: none; }
          .rs-navbar__logo-img { height: 38px; }
        }
      `}</style>
    </>
  );
};

export default Navbar;