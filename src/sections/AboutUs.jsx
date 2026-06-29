import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'motion/react';
import { Dialog, DialogContent, IconButton } from '@mui/material';

/* ─── Impact stats with modal ─── */
const impactData = [
  {
    id: 'screened',
    value: '595',
    suffix: '+',
    label: 'People Screened',
    accent: 'var(--rs-teal)',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
        <circle cx="12" cy="12" r="3"></circle>
      </svg>
    ),
    summary: 'Total number of people who received eye screenings through our community programs.',
    breakdown: [
      'Community Children Eye Screening Drive in Guntur, India — 385 children',
      'Community Senior Citizens Eye Screening Drive in Guntur, India — 210 seniors',
    ],
  },
  {
    id: 'glasses',
    value: '66',
    suffix: '',
    label: 'Glasses Donated',
    accent: 'var(--rs-orange)',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z"></path>
        <circle cx="12" cy="12" r="3"></circle>
      </svg>
    ),
    summary: 'Eyeglasses gathered, sorted, and donated to those in need.',
    breakdown: [
      'Pairs collected & donated: 26',
      'Pairs distributed at screenings: 40',
    ],
  },
  {
    id: 'funds',
    value: '$200',
    suffix: '',
    label: 'Funds Raised',
    accent: 'var(--rs-gold)',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
      </svg>
    ),
    summary: 'Funds raised to support outreach, screenings, and related mission costs.',
    breakdown: [
      'Door-to-door community fundraising: $200 USD',
    ],
  },
  {
    id: 'communities',
    value: '3',
    suffix: '',
    label: 'Communities Served',
    accent: 'var(--rs-teal)',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
        <circle cx="12" cy="10" r="3"></circle>
      </svg>
    ),
    summary: 'Communities where RecycleSpecs has directly provided vision care services.',
    breakdown: [
      'Coppell, Texas — Glasses collection drives',
      'Guntur, India — Children eye screening',
      'Guntur, India — Senior citizens screening',
    ],
  },
];

function useCounter(end, duration, start) {
  const [count, setCount] = useState('0');
  useEffect(() => {
    if (!start) return;
    const numStr = String(end).replace(/[^0-9]/g, '');
    const prefix = String(end).replace(/[0-9]/g, '');
    const num = parseInt(numStr, 10);
    if (!num) { setCount(end); return; }
    let startTime = null;
    const step = (ts) => {
      if (!startTime) startTime = ts;
      const progress = Math.min((ts - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(prefix + Math.round(eased * num).toLocaleString());
      if (progress < 1) requestAnimationFrame(step);
      else setCount(end);
    };
    requestAnimationFrame(step);
  }, [start, end, duration]);
  return count;
}

const ImpactCard = ({ stat, index }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-40px' });
  const animated = useCounter(stat.value, 1800, isInView);

  return (
    <>
      <motion.div
        ref={ref}
        className="about-impact-card"
        style={{ '--accent': stat.accent }}
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: index * 0.1 }}
        whileHover={{ y: -6, transition: { duration: 0.3 } }}
        onClick={() => setOpen(true)}
        role="button"
        tabIndex={0}
        onKeyDown={e => e.key === 'Enter' && setOpen(true)}
        aria-label={`${stat.label}: ${stat.value}. Click for details.`}
      >
        <motion.div
          className="about-impact-card__icon"
          style={{ color: stat.accent }}
          initial={{ scale: 0, rotate: -20 }}
          animate={isInView ? { scale: 1, rotate: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.34, 1.56, 0.64, 1], delay: index * 0.1 + 0.15 }}
        >
          {stat.icon}
        </motion.div>
        <div className="about-impact-card__num">{animated}{stat.suffix}</div>
        <div className="about-impact-card__label">{stat.label}</div>
        <div className="about-impact-card__cta">View Details →</div>
      </motion.div>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          style: {
            borderRadius: '20px',
            background: 'var(--bg-parchment)',
            fontFamily: 'Inter, sans-serif',
          }
        }}
      >
        <DialogContent style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
            <div>
              <div style={{ fontSize: '2rem', marginBottom: '0.25rem', color: stat.accent }}>{stat.icon}</div>
              <h3 style={{
                fontFamily: 'Fraunces, Georgia, serif',
                fontSize: '1.6rem',
                fontWeight: 700,
                color: 'var(--text-primary)',
                margin: 0,
              }}>{stat.label}</h3>
            </div>
            <IconButton
              onClick={() => setOpen(false)}
              style={{ color: 'var(--text-muted)', padding: '4px' }}
              aria-label="Close"
              size="small"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </IconButton>
          </div>

          <div style={{
            fontSize: '3rem',
            fontFamily: 'Fraunces, serif',
            fontWeight: 900,
            color: stat.accent,
            lineHeight: 1,
            marginBottom: '1rem',
          }}>{stat.value}{stat.suffix}</div>

          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.7, marginBottom: '1.5rem' }}>
            {stat.summary}
          </p>

          <div style={{
            background: 'rgba(64,58,58,0.04)',
            borderRadius: '12px',
            padding: '1rem 1.25rem',
          }}>
            <div style={{ fontWeight: 700, fontSize: '0.78rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
              Breakdown
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {stat.breakdown.map((item, i) => (
                <li key={i} style={{ display: 'flex', gap: '8px', fontSize: '0.92rem', color: 'var(--text-secondary)', alignItems: 'flex-start' }}>
                  <span style={{ color: stat.accent, fontWeight: 700, flexShrink: 0 }}>•</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

const AboutUs = () => {
  const headerRef = useRef(null);
  const isHeaderInView = useInView(headerRef, { once: true, margin: '-60px' });
  const gridRef = useRef(null);
  const isGridInView = useInView(gridRef, { once: true, margin: '-60px' });

  return (
    <section className="rs-about" id="about">
      {/* Section intro */}
      <div className="rs-about__header" ref={headerRef}>
        <motion.div
          className="rs-about__mission-tag"
          initial={{ opacity: 0, y: 15 }}
          animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          Our Core Intentions
        </motion.div>

        <motion.h2
          className="section-title"
          initial={{ opacity: 0, y: 30 }}
          animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
        >
          Optical Equity,<br /><em style={{ fontStyle: 'italic', color: 'var(--rs-teal)' }}>Driven by Youth</em>
        </motion.h2>
        <motion.p
          className="section-subtitle"
          initial={{ opacity: 0, y: 24 }}
          animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
        >
          Our goal is to help reduce global disparities in vision by funding surgeries and screenings, and raising awareness of racism and classism in optical health.
        </motion.p>
      </div>

      {/* Two-column: image + mission cards */}
      <div className="rs-about__grid" ref={gridRef}>
        <motion.div
          className="rs-about__story"
          initial={{ opacity: 0, x: -50 }}
          animate={isGridInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="rs-about__story-img-wrapper">
            <img src="/imgs/event2.jpg" alt="RecycleSpecs team at a senior citizen eye screening" className="rs-about__story-img" />
            <div className="rs-about__story-img-caption">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '4px' }}>
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
              Senior Eye Screening — Guntur, India (2025)
            </div>
          </div>
        </motion.div>

        <div className="rs-about__cards">
          {[
            {
              icon: (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
                </svg>
              ),
              title: 'Free Screenings',
              content: 'Fundraising to provide free screenings by partnering with eye clinics in the US and India, ensuring early detection and care.',
              color: 'var(--rs-teal)',
              bg: 'rgba(45,125,125,0.06)',
              border: 'rgba(45,125,125,0.15)',
            },
            {
              icon: (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z"/>
                  <circle cx="12" cy="12" r="3"/>
                </svg>
              ),
              title: 'Glasses & Donations',
              content: 'Collecting glasses and encouraging donations of gently used frames to match prescriptions and support outreach.',
              color: 'var(--rs-orange)',
              bg: 'rgba(198,93,7,0.06)',
              border: 'rgba(198,93,7,0.15)',
            },
            {
              icon: (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                  <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
                </svg>
              ),
              title: 'Youth Awareness',
              content: 'Spreading awareness on vision health for young people, while confronting systemic barriers like racism and classism in optical health.',
              color: 'var(--rs-gold)',
              bg: 'rgba(212,160,23,0.06)',
              border: 'rgba(212,160,23,0.15)',
            },
            {
              icon: (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="2" y1="12" x2="22" y2="12"/>
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                </svg>
              ),
              title: 'School Chapters',
              content: 'Setting up chapters in schools around the DFW area, then expanding across the United States and other countries.',
              color: 'var(--rs-teal)',
              bg: 'rgba(45,125,125,0.06)',
              border: 'rgba(45,125,125,0.15)',
            },
          ].map((card, i) => (
            <motion.div
              key={card.title}
              className="rs-about__card"
              style={{ '--accent': card.color, '--bg': card.bg, '--border': card.border }}
              initial={{ opacity: 0, x: 30, y: 20 }}
              animate={isGridInView ? { opacity: 1, x: 0, y: 0 } : {}}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: i * 0.12 + 0.1 }}
              whileHover={{ y: -4, transition: { duration: 0.3 } }}
            >
              <div className="rs-about__card-icon" style={{ color: card.color }}>{card.icon}</div>
              <div>
                <h3 className="rs-about__card-title">{card.title}</h3>
                <p className="rs-about__card-body">{card.content}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Impact Numbers */}
      <div className="rs-about__impact-section">
        <motion.div
          className="rs-about__impact-header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >

          <h2 className="section-title" style={{ color: 'var(--text-light)', fontSize: 'clamp(2rem, 4vw, 3rem)' }}>
            Numbers That<br /><em style={{ fontStyle: 'italic', color: 'var(--rs-gold-light)' }}>Tell Our Story</em>
          </h2>
          <p className="section-subtitle" style={{ color: 'rgba(249,244,236,0.65)' }}>
            Every figure represents a real person who can now see more clearly. Click any card to learn more.
          </p>
        </motion.div>
        <div className="rs-about__impact-grid">
          {impactData.map((stat, i) => (
            <ImpactCard key={stat.id} stat={stat} index={i} />
          ))}
        </div>
      </div>

      <style>{`
        .rs-about {
          background: var(--bg-parchment);
          padding: var(--section-pad-y) var(--section-pad-x);
          position: relative;
          overflow: clip;
        }

        .rs-about__header {
          max-width: 1280px;
          margin: 0 auto 3rem;
        }

        .rs-about__mission-tag {
          display: inline-flex;
          align-items: center;
          font-family: 'Inter', sans-serif;
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--rs-orange);
          background: rgba(198,93,7,0.08);
          border: 1px solid rgba(198,93,7,0.15);
          padding: 6px 16px;
          border-radius: var(--radius-full);
          margin-bottom: 1.25rem;
        }

        .rs-about__grid {
          max-width: 1280px;
          margin: 0 auto 4rem;
          display: grid;
          grid-template-columns: 1fr 1.3fr;
          gap: clamp(1.5rem, 4vw, 3rem);
          align-items: center;
        }

        .rs-about__story-img-wrapper {
          position: relative;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: var(--shadow-lg);
        }
        .rs-about__story-img {
          width: 100%;
          aspect-ratio: 4/3;
          object-fit: cover;
          display: block;
          transition: transform 0.8s var(--ease-out-expo);
        }
        .rs-about__story-img-wrapper:hover .rs-about__story-img {
          transform: scale(1.05);
        }
        .rs-about__story-img-caption {
          position: absolute;
          bottom: 0; left: 0; right: 0;
          background: linear-gradient(0deg, rgba(28,24,21,0.7), transparent);
          color: white;
          font-family: 'Inter', sans-serif;
          font-size: 0.82rem;
          font-weight: 500;
          padding: 2rem 1.25rem 1rem;
          display: flex;
          gap: 6px;
          align-items: center;
        }

        .rs-about__cards {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1.25rem;
        }
        .rs-about__card {
          background: var(--bg);
          border: 1px solid var(--border);
          border-left: 4px solid var(--accent);
          border-radius: 16px;
          padding: 1.25rem 1.5rem;
          display: flex;
          gap: 1rem;
          align-items: flex-start;
          cursor: default;
          transition: all 0.3s ease;
        }
        .rs-about__card:hover {
          box-shadow: var(--shadow-md);
          transform: translateY(-4px);
        }
        .rs-about__card-icon {
          font-size: 1.6rem;
          flex-shrink: 0;
          margin-top: 2px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .rs-about__card-title {
          font-family: 'Fraunces', Georgia, serif;
          font-size: 1.15rem;
          font-weight: 700;
          color: var(--accent);
          margin-bottom: 0.4rem;
        }
        .rs-about__card-body {
          font-family: 'Inter', sans-serif;
          font-size: 0.88rem;
          color: var(--text-secondary);
          line-height: 1.6;
          margin: 0;
        }

        /* Impact section */
        .rs-about__impact-section {
          max-width: 1280px;
          margin: 0 auto;
          background: var(--bg-dark);
          border-radius: 28px;
          padding: clamp(2.5rem, 5vw, 4rem);
          color: var(--text-light);
          position: relative;
          overflow: hidden;
        }

        .rs-about__impact-header {
          margin-bottom: 2.5rem;
        }

        .rs-about__impact-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1.25rem;
        }

        .about-impact-card {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 18px;
          padding: 1.75rem 1.5rem;
          text-align: center;
          cursor: pointer;
          position: relative;
          overflow: hidden;
        }
        .about-impact-card::before {
          content: '';
          position: absolute;
          bottom: 0; left: 0; right: 0;
          height: 3px;
          background: var(--accent);
          transform: scaleX(0);
          transition: transform 0.4s ease;
          transform-origin: left;
        }
        .about-impact-card:hover {
          background: rgba(255,255,255,0.09);
          box-shadow: 0 16px 48px rgba(0,0,0,0.3);
        }
        .about-impact-card:hover::before {
          transform: scaleX(1);
        }
        .about-impact-card__icon {
          font-size: 2rem;
          margin-bottom: 0.75rem;
        }
        .about-impact-card__num {
          font-family: 'Fraunces', serif;
          font-size: clamp(2rem, 3.5vw, 3rem);
          font-weight: 900;
          color: var(--accent);
          line-height: 1;
          margin-bottom: 6px;
        }
        .about-impact-card__label {
          font-family: 'Inter', sans-serif;
          font-weight: 700;
          font-size: 0.78rem;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: rgba(249,244,236,0.7);
          margin-bottom: 10px;
        }
        .about-impact-card__cta {
          font-family: 'Inter', sans-serif;
          font-size: 0.75rem;
          color: var(--accent);
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        .about-impact-card:hover .about-impact-card__cta {
          opacity: 1;
        }

        @media (max-width: 900px) {
          .rs-about__grid { grid-template-columns: 1fr; }
        }
        @media (max-width: 900px) {
          .rs-about__impact-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 640px) {
          .rs-about__impact-grid {
            grid-template-columns: 1fr;
            gap: 1rem;
          }
          .rs-about__cards {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </section>
  );
};

export default AboutUs;