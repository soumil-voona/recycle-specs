import React, { useRef } from 'react';
import { motion, useInView } from 'motion/react';

const milestones = [
  {
    year: '2024',
    title: 'RecycleSpecs Founded',
    desc: 'A group of high school students launch RecycleSpecs with a mission to provide vision care access worldwide.',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/></svg>,
    color: 'var(--rs-teal)',
    location: 'Coppell, Texas',
  },
  {
    year: '2025',
    title: 'First Glasses Collection',
    desc: '66 pairs of glasses collected through door-to-door community drives and school campaigns.',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="6" cy="15" r="4"/><circle cx="18" cy="15" r="4"/><path d="M14 15a2 2 0 0 0-2-2 2 2 0 0 0-2 2"/><path d="M2.5 13 5 7c.7-1.3 1.4-2 3-2"/><path d="M21.5 13 19 7c-.7-1.3-1.5-2-3-2"/></svg>,
    color: 'var(--rs-orange)',
    location: 'Dallas-Fort Worth, TX',
  },
  {
    year: '2025',
    title: 'Children Eye Screening Drive',
    desc: '385 children screened at Zilla Parishad High School. 109 identified for further care. 40 glasses distributed.',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>,
    color: 'var(--rs-teal)',
    location: 'Guntur, India',
  },
  {
    year: '2025',
    title: 'Senior Citizens Screening',
    desc: '210 senior citizens screened. 120 cataract surgeries scheduled through partnership with Sankara Eye Hospitals.',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22v-4"/><path d="M12 18H8"/><path d="M12 18h4"/><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z"/><path d="M14 2v6h6"/><path d="M12 12v4"/><path d="M10 14h4"/></svg>,
    color: 'var(--rs-gold)',
    location: 'Guntur, India',
  },
  {
    year: '2025',
    title: '$200 Fundraised',
    desc: 'Door-to-door community fundraising generates crucial funds to support upcoming outreach and screenings.',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>,
    color: 'var(--rs-orange)',
    location: 'Texas, USA',
  },
  {
    year: 'Future',
    title: 'National Expansion',
    desc: 'Set up chapters in schools across the DFW area, then nationally and internationally to scale our impact.',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>,
    color: 'var(--rs-teal)',
    location: 'Nationwide & Global',
  },
];

const MilestoneCard = ({ milestone, index, isLeft }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <motion.div
      ref={ref}
      className={`tl-item ${isLeft ? 'tl-item--left' : 'tl-item--right'}`}
      initial={{ opacity: 0, x: isLeft ? -60 : 60 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
    >
      {/* Dot on the line */}
      <motion.div
        className="tl-item__dot"
        style={{ background: milestone.color }}
        initial={{ scale: 0 }}
        animate={isInView ? { scale: 1 } : {}}
        transition={{ duration: 0.5, ease: [0.34, 1.56, 0.64, 1], delay: 0.2 }}
      />

      {/* Card */}
      <motion.div
        className="tl-item__card"
        whileHover={{ y: -4, transition: { duration: 0.3 } }}
      >
        <div className="tl-item__year" style={{ color: milestone.color }}>
          <span className="tl-item__emoji">{milestone.icon}</span>
          {milestone.year}
        </div>
        <h3 className="tl-item__title">{milestone.title}</h3>
        <p className="tl-item__desc">{milestone.desc}</p>
        <div className="tl-item__location">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          {milestone.location}
        </div>
        <motion.div
          className="tl-item__accent"
          style={{ background: milestone.color }}
          initial={{ scaleX: 0 }}
          animate={isInView ? { scaleX: 1 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
        />
      </motion.div>
    </motion.div>
  );
};

const Timeline = () => {
  const headerRef = useRef(null);
  const isHeaderInView = useInView(headerRef, { once: true, margin: '-80px' });
  const lineRef = useRef(null);
  const isLineInView = useInView(lineRef, { once: true, margin: '-100px' });

  return (
    <section className="rs-timeline" id="timeline">
      <div className="rs-timeline__inner">
        <motion.div
          ref={headerRef}
          className="rs-timeline__header"
          initial={{ opacity: 0, y: 40 }}
          animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        >

          <h2 className="section-title rs-timeline__title">
            Growing Our <em>Impact</em>
          </h2>
          <p className="section-subtitle">
            From a small idea to hundreds of lives changed — every milestone represents a step closer to a world where everyone can see clearly.
          </p>
        </motion.div>

        <div className="rs-timeline__content" ref={lineRef}>
          {/* Center line */}
          <motion.div
            className="rs-timeline__line"
            initial={{ scaleY: 0 }}
            animate={isLineInView ? { scaleY: 1 } : {}}
            transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }}
          />

          {/* Milestone items */}
          {milestones.map((m, i) => (
            <MilestoneCard
              key={m.title}
              milestone={m}
              index={i}
              isLeft={i % 2 === 0}
            />
          ))}
        </div>
      </div>

      <style>{`
        .rs-timeline {
          background: var(--bg-sand);
          padding: var(--section-pad-y) var(--section-pad-x);
          position: relative;
          overflow: hidden;
        }

        .rs-timeline__inner {
          max-width: 1100px;
          margin: 0 auto;
        }

        .rs-timeline__header {
          text-align: center;
          margin-bottom: 4rem;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .rs-timeline__title em {
          font-style: italic;
          color: var(--rs-teal);
        }
        .rs-timeline__header .section-subtitle {
          text-align: center;
        }

        .rs-timeline__content {
          position: relative;
          padding: 2rem 0;
        }

        .rs-timeline__line {
          position: absolute;
          left: 50%;
          top: 0;
          bottom: 0;
          width: 2px;
          background: linear-gradient(180deg,
            var(--rs-teal) 0%,
            var(--rs-orange) 40%,
            var(--rs-gold) 70%,
            var(--rs-teal) 100%
          );
          transform-origin: top;
          opacity: 0.3;
        }

        .tl-item {
          display: flex;
          align-items: flex-start;
          position: relative;
          margin-bottom: 2.5rem;
          width: 50%;
        }

        .tl-item--left {
          padding-right: 3rem;
          justify-content: flex-end;
        }
        .tl-item--right {
          padding-left: 3rem;
          margin-left: 50%;
        }

        .tl-item__dot {
          position: absolute;
          width: 14px;
          height: 14px;
          border-radius: 50%;
          border: 3px solid var(--bg-sand);
          box-shadow: 0 0 0 3px currentColor;
          z-index: 5;
        }
        .tl-item--left .tl-item__dot {
          right: -7px;
        }
        .tl-item--right .tl-item__dot {
          left: -7px;
        }

        .tl-item__card {
          background: white;
          border: 1px solid rgba(64,58,58,0.06);
          border-radius: 18px;
          padding: 1.5rem 1.75rem;
          max-width: 400px;
          position: relative;
          overflow: hidden;
          transition: box-shadow 0.4s ease;
          width: 100%;
        }
        .tl-item__card:hover {
          box-shadow: 0 16px 48px rgba(64,58,58,0.12);
        }

        .tl-item__year {
          font-family: 'Fraunces', serif;
          font-size: 0.85rem;
          font-weight: 800;
          letter-spacing: 0.05em;
          margin-bottom: 0.5rem;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .tl-item__emoji {
          font-size: 1.1rem;
        }

        .tl-item__title {
          font-family: 'Fraunces', Georgia, serif;
          font-size: 1.15rem;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 0.5rem;
          letter-spacing: -0.01em;
        }

        .tl-item__desc {
          font-family: 'Inter', sans-serif;
          font-size: 0.88rem;
          line-height: 1.65;
          color: var(--text-secondary);
          margin: 0 0 0.75rem;
        }

        .tl-item__location {
          display: flex;
          align-items: center;
          gap: 5px;
          font-family: 'Inter', sans-serif;
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.06em;
        }

        .tl-item__accent {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 3px;
          transform-origin: left;
        }

        @media (max-width: 768px) {
          .rs-timeline__content {
            padding-left: 2rem;
          }
          .rs-timeline__line {
            left: 0;
          }
          .tl-item {
            width: 100%;
            margin-left: 0;
            padding-left: 2.5rem;
            padding-right: 0;
            justify-content: flex-start;
          }
          .tl-item--left { padding-right: 0; }
          .tl-item__dot {
            left: -7px !important;
            right: auto !important;
          }
          .tl-item__card { max-width: 100%; }
        }
      `}</style>
    </section>
  );
};

export default Timeline;
