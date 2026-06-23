import { useRef, useState, useEffect } from 'react'
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { motion, useInView } from 'motion/react'
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from "@vercel/speed-insights/react"
import Home from './sections/Home'
import Navbar from './sections/Navbar'
import BoardMembers from './sections/BoardMembers'
import AboutUs from './sections/AboutUs'
import TheReality from './sections/TheReality'
import HowWeWork from './sections/HowWeWork'
import Timeline from './sections/Timeline'
import Partnerships from './sections/Partnerships'
import PastEvents from './sections/PastEvents'
import StartAChapter from './sections/StartAChapter'
import Upcoming from './sections/Upcoming'
import UpcomingEvent from './sections/UpcomingEvent'
import Volunteers from './sections/Volunteers'
import Login from './sections/Login'
import Signup from './sections/Signup'
import ProtectedRoute from './components/ProtectedRoute'
import Chapters from './sections/Chapters'
import VolunteerSignup from './sections/VolunteerSignup'
import ChapterAdminLogin from './sections/ChapterAdminLogin'
import UnlistedChapterSignup from './sections/UnlistedChapterSignup'
import ChapterDashboard from './sections/ChapterDashboard'
import HQAdminPanel from './sections/HQAdminPanel'

/* ─────────────────────────────────────
   Global scroll-reveal observer
   Adds .revealed to any .reveal / .reveal-left / .reveal-right
   elements that don't already have their own per-element observer.
   ───────────────────────────────────── */
function useGlobalReveal() {
  useEffect(() => {
    const selector = '.reveal:not([data-observed]), .reveal-left:not([data-observed]), .reveal-right:not([data-observed])';

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: '-20px 100% -20px 100%' }
    );

    function observeAll() {
      document.querySelectorAll(selector).forEach((el) => {
        el.setAttribute('data-observed', '1');
        io.observe(el);
      });
    }

    observeAll();

    // Re-scan when new nodes appear (route changes, lazy renders)
    const mo = new MutationObserver(observeAll);
    mo.observe(document.body, { childList: true, subtree: true });

    return () => { io.disconnect(); mo.disconnect(); };
  }, []);
}

/* ─────────────────────────────────────
   Contact / Footer section — Enhanced
   ───────────────────────────────────── */
const ContactSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <section className="rs-contact" id="contact" ref={ref}>
      {/* Ambient orbs */}
      <div className="rs-contact__bg-blobs" aria-hidden="true">
        <motion.div
          className="rs-contact__blob blob-a"
          animate={{ x: [0, 30, -20, 0], y: [0, -20, 15, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="rs-contact__blob blob-b"
          animate={{ x: [0, -20, 30, 0], y: [0, 15, -20, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      <div className="rs-contact__inner">
        <motion.div
          className="rs-contact__content"
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Tag */}
          <div className="rs-contact__tag">
            Get In Touch
          </div>

          <h2 className="rs-contact__title">
            Help Someone See<br />Their <em>Future.</em>
          </h2>
          <p className="rs-contact__body">
            Whether you want to volunteer, donate glasses, partner with us, or simply learn more — we'd love to hear from you. Every message brings us one step closer to clear vision for all.
          </p>

          <div className="rs-contact__actions">
            <motion.a
              href="mailto:recycle.specs@gmail.com"
              className="rs-contact__email-btn"
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97 }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
              </svg>
              recycle.specs@gmail.com
            </motion.a>
            <span className="rs-contact__divider">or</span>
            <motion.a
              href="/upcoming"
              className="rs-contact__volunteer-btn"
              whileHover={{ x: 4 }}
              onClick={e => {
                e.preventDefault();
                window.location.href = '/upcoming';
              }}
            >
              See Upcoming Events →
            </motion.a>
          </div>
        </motion.div>

        {/* Info cards */}
        <div className="rs-contact__cards">
          {[
            {
              icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--rs-orange)' }}><polyline points="23 4 23 10 17 10"></polyline><polyline points="1 20 1 14 7 14"></polyline><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path></svg>,
              title: 'Donate Glasses',
              body: 'Have old eyeglasses? Donate them to someone who needs them. Contact us to arrange a drop-off or pick-up.',
            },
            {
              icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--rs-teal)' }}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>,
              title: 'Volunteer',
              body: 'Join our growing network of volunteers to help at events, fundraisers, and outreach programs.',
            },
            {
              icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--rs-gold)' }}><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><polyline points="16 11 18 13 22 9"></polyline></svg>,
              title: 'Partner With Us',
              body: 'Organizations aligned with our mission can partner to amplify impact across communities worldwide.',
            },
          ].map((card, i) => (
            <motion.div
              key={card.title}
              className="rs-contact__card"
              initial={{ opacity: 0, x: 40 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: i * 0.1 + 0.2 }}
              whileHover={{ x: 6, transition: { duration: 0.25 } }}
            >
              <div className="rs-contact__card-icon">{card.icon}</div>
              <div>
                <div className="rs-contact__card-title">{card.title}</div>
                <div className="rs-contact__card-body">{card.body}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <style>{`
        .rs-contact {
          background: var(--bg-dark);
          padding: var(--section-pad-y) var(--section-pad-x);
          position: relative;
          overflow: hidden;
          color: var(--text-light);
        }

        .rs-contact__bg-blobs {
          position: absolute;
          inset: 0;
          pointer-events: none;
        }
        .rs-contact__blob {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
        }
        .blob-a {
          width: 400px; height: 400px;
          background: radial-gradient(circle, rgba(198,93,7,0.08) 0%, transparent 70%);
          top: -10%; right: 10%;
        }
        .blob-b {
          width: 350px; height: 350px;
          background: radial-gradient(circle, rgba(45,125,125,0.06) 0%, transparent 70%);
          bottom: -10%; left: 5%;
        }

        .rs-contact__inner {
          max-width: 1280px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: clamp(2rem, 5vw, 5rem);
          align-items: center;
          position: relative;
          z-index: 1;
        }

        /* Left content */
        .rs-contact__tag {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-family: 'Inter', sans-serif;
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--rs-gold-light);
          background: rgba(240,200,74,0.1);
          border: 1px solid rgba(240,200,74,0.2);
          padding: 7px 16px;
          border-radius: 999px;
          margin-bottom: 1.5rem;
        }
        .rs-contact__tag-dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          background: var(--rs-gold-light);
          animation: tagPulse 2s ease-in-out infinite;
        }

        .rs-contact__title {
          font-family: 'Fraunces', Georgia, serif;
          font-size: clamp(2.4rem, 4.5vw, 4rem);
          font-weight: 900;
          color: white;
          line-height: 1.1;
          letter-spacing: -0.03em;
          margin-bottom: 1.25rem;
        }
        .rs-contact__title em {
          font-style: italic;
          color: var(--rs-gold-light);
        }

        .rs-contact__body {
          font-family: 'Inter', sans-serif;
          font-size: 1rem;
          line-height: 1.8;
          color: rgba(249,244,236,0.65);
          max-width: 480px;
          margin-bottom: 2rem;
        }

        .rs-contact__actions {
          display: flex;
          align-items: center;
          gap: 1rem;
          flex-wrap: wrap;
        }
        .rs-contact__email-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-family: 'Inter', sans-serif;
          font-weight: 600;
          font-size: 0.95rem;
          color: white;
          background: var(--rs-orange);
          padding: 14px 24px;
          border-radius: 12px;
          text-decoration: none;
          transition: all 0.3s ease;
          box-shadow: 0 6px 20px rgba(198,93,7,0.35);
        }
        .rs-contact__email-btn:hover {
          background: var(--rs-orange-dark);
          box-shadow: 0 10px 30px rgba(198,93,7,0.45);
          color: white;
        }
        .rs-contact__divider {
          font-family: 'Inter', sans-serif;
          font-size: 0.85rem;
          color: rgba(249,244,236,0.35);
        }
        .rs-contact__volunteer-btn {
          font-family: 'Inter', sans-serif;
          font-weight: 600;
          font-size: 0.92rem;
          color: rgba(249,244,236,0.75);
          text-decoration: none;
          border-bottom: 1px solid rgba(249,244,236,0.3);
          padding-bottom: 2px;
          transition: all 0.2s ease;
        }
        .rs-contact__volunteer-btn:hover {
          color: white;
          border-color: white;
        }

        /* Right cards */
        .rs-contact__cards {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .rs-contact__card {
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 16px;
          padding: 1.25rem 1.5rem;
          display: flex;
          align-items: flex-start;
          gap: 1rem;
          transition: background 0.3s ease;
        }
        .rs-contact__card:hover {
          background: rgba(255,255,255,0.10);
        }
        .rs-contact__card-icon {
          font-size: 1.5rem;
          flex-shrink: 0;
          margin-top: 2px;
        }
        .rs-contact__card-title {
          font-family: 'Fraunces', Georgia, serif;
          font-size: 1.05rem;
          font-weight: 700;
          color: white;
          margin-bottom: 4px;
        }
        .rs-contact__card-body {
          font-family: 'Inter', sans-serif;
          font-size: 0.875rem;
          line-height: 1.65;
          color: rgba(249,244,236,0.55);
        }

        @media (max-width: 900px) {
          .rs-contact__inner { grid-template-columns: 1fr; }
          .rs-contact__body { max-width: 100%; }
        }
      `}</style>
    </section>
  );
};

/* ─────────────────────────────────────
   Footer
   ───────────────────────────────────── */
const Footer = () => (
  <footer className="rs-footer">
    <div className="rs-footer__inner">
      <div className="rs-footer__brand">
        <img src="/imgs/logo.png" alt="RecycleSpecs" className="rs-footer__logo" />
        <div>
          <div className="rs-footer__name">RecycleSpecs</div>
          <div className="rs-footer__tagline">Youth-Led Optical Access Initiative</div>
        </div>
      </div>

      <div className="rs-footer__nav">
        <a href="#about" className="rs-footer__link" onClick={e => { e.preventDefault(); document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' }); }}>Our Story</a>
        <a href="#board" className="rs-footer__link" onClick={e => { e.preventDefault(); document.getElementById('board')?.scrollIntoView({ behavior: 'smooth' }); }}>Team</a>
        <a href="#events" className="rs-footer__link" onClick={e => { e.preventDefault(); document.getElementById('events')?.scrollIntoView({ behavior: 'smooth' }); }}>Impact</a>
        <a href="#partnerships" className="rs-footer__link" onClick={e => { e.preventDefault(); document.getElementById('partnerships')?.scrollIntoView({ behavior: 'smooth' }); }}>Partners</a>
        <a href="#timeline" className="rs-footer__link" onClick={e => { e.preventDefault(); document.getElementById('timeline')?.scrollIntoView({ behavior: 'smooth' }); }}>Journey</a>
        <a href="/upcoming" className="rs-footer__link">Upcoming Events</a>
      </div>

      <div className="rs-footer__right">
        <a href="mailto:recycle.specs@gmail.com" className="rs-footer__email">recycle.specs@gmail.com</a>
        <div className="rs-footer__copy">
          © {new Date().getFullYear()} RecycleSpecs. All rights reserved.
        </div>
      </div>
    </div>

    <style>{`
      .rs-footer {
        background: var(--bg-charcoal, #1e1a17);
        padding: 2.5rem var(--section-pad-x);
        border-top: 1px solid rgba(255,255,255,0.06);
      }
      .rs-footer__inner {
        max-width: 1280px;
        margin: 0 auto;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 2rem;
        flex-wrap: wrap;
      }
      .rs-footer__brand {
        display: flex;
        align-items: center;
        gap: 12px;
      }
      .rs-footer__logo {
        height: 36px;
        width: auto;
        object-fit: contain;
        opacity: 0.85;
      }
      .rs-footer__name {
        font-family: 'Fraunces', serif;
        font-size: 1rem;
        font-weight: 700;
        color: white;
        line-height: 1.2;
      }
      .rs-footer__tagline {
        font-family: 'Inter', sans-serif;
        font-size: 0.7rem;
        font-weight: 500;
        letter-spacing: 0.07em;
        text-transform: uppercase;
        color: rgba(255,255,255,0.35);
        margin-top: 2px;
      }
      .rs-footer__nav {
        display: flex;
        gap: 1.5rem;
        flex-wrap: wrap;
      }
      .rs-footer__link {
        font-family: 'Inter', sans-serif;
        font-size: 0.85rem;
        color: rgba(255,255,255,0.45);
        text-decoration: none;
        transition: color 0.2s ease;
      }
      .rs-footer__link:hover { color: rgba(255,255,255,0.85); }

      .rs-footer__right {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        gap: 4px;
      }
      .rs-footer__email {
        font-family: 'Inter', sans-serif;
        font-size: 0.85rem;
        color: var(--rs-orange-light, #e8722a);
        text-decoration: none;
        transition: opacity 0.2s ease;
      }
      .rs-footer__email:hover { opacity: 0.8; color: var(--rs-orange-light, #e8722a); }
      .rs-footer__copy {
        font-family: 'Inter', sans-serif;
        font-size: 0.75rem;
        color: rgba(255,255,255,0.25);
      }

      @media (max-width: 768px) {
        .rs-footer__inner { flex-direction: column; align-items: flex-start; gap: 1.5rem; }
        .rs-footer__right { align-items: flex-start; }
        .rs-footer__nav { gap: 1rem; }
      }
    `}</style>
  </footer>
);

/* ─────────────────────────────────────
   Home Page — New section order
   ───────────────────────────────────── */
const HomePage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const targetId = location.state?.scrollTo;
    const shouldScrollToTop = location.state?.scrollToTop;
    if (!targetId && !shouldScrollToTop) return;

    const scrollToTarget = () => {
      if (shouldScrollToTop) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        navigate(location.pathname, { replace: true, state: null });
        return;
      }
      const element = document.getElementById(targetId);
      if (!element) return;
      const navbar = document.querySelector('.rs-navbar');
      const navbarHeight = navbar ? navbar.offsetHeight + 12 : 80;
      const offsetPosition = element.getBoundingClientRect().top + window.scrollY - navbarHeight;
      window.scrollTo({ top: Math.max(offsetPosition, 0), behavior: 'smooth' });
      navigate(location.pathname, { replace: true, state: null });
    };

    const timer = window.setTimeout(scrollToTarget, 80);
    return () => window.clearTimeout(timer);
  }, [location.pathname, location.state, navigate]);

  return (
    <div>
      <Home />
      <TheReality />
      <AboutUs />
      <HowWeWork />
      <PastEvents />
      <BoardMembers />
      <Partnerships />
      <Timeline />
      <StartAChapter />
      <ContactSection />
      <Footer />
    </div>
  );
};

/* ─────────────────────────────────────
   App
   ───────────────────────────────────── */
function App() {
  useGlobalReveal();

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Navigate to="/volunteer-login" replace />} />
        <Route path="/volunteer-login" element={<Login mode="volunteer" />} />
        <Route path="/event-login" element={<Login mode="event" />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/upcoming" element={<Upcoming />} />
        <Route path="/upcoming/:eventPath" element={<UpcomingEvent />} />
        <Route path="/community" element={<Navigate to="/upcoming" replace />} />
        <Route
          path="/volunteers"
          element={
            <ProtectedRoute message="Log in to access the volunteer dashboard." redirectTo="/volunteer-login">
              <Volunteers />
            </ProtectedRoute>
          }
        />
        <Route path="/chapters" element={<Chapters />} />
        <Route path="/chapters/signup" element={<VolunteerSignup />} />
        <Route path="/chapters/admin-login" element={<ChapterAdminLogin />} />
        <Route path="/chapters/dashboard" element={<ChapterDashboard />} />
        <Route path="/unlisted-chapter-signup" element={<UnlistedChapterSignup />} />
        <Route path="/hq-admin" element={<HQAdminPanel />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Analytics />
      <SpeedInsights />
    </>
  );
}

export default App;