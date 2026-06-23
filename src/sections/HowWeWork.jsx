import React, { useRef } from 'react';
import { motion, useInView } from 'motion/react';

const steps = [
  {
    num: '01',
    title: 'Collect',
    desc: 'We organize community eyeglass drives, collecting unused and donated glasses from neighborhoods, schools, and local businesses.',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="23 4 23 10 17 10"></polyline>
        <polyline points="1 20 1 14 7 14"></polyline>
        <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
      </svg>
    ),
    color: 'var(--rs-teal)',
    colorBg: 'rgba(45,125,125,0.1)',
  },
  {
    num: '02',
    title: 'Sort',
    desc: 'Each pair is carefully inspected, cleaned, and sorted by prescription strength to ensure a proper match for recipients.',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="8" y1="6" x2="21" y2="6"></line>
        <line x1="8" y1="12" x2="21" y2="12"></line>
        <line x1="8" y1="18" x2="21" y2="18"></line>
        <line x1="3" y1="6" x2="3.01" y2="6"></line>
        <line x1="3" y1="12" x2="3.01" y2="12"></line>
        <line x1="3" y1="18" x2="3.01" y2="18"></line>
      </svg>
    ),
    color: 'var(--rs-orange)',
    colorBg: 'rgba(198,93,7,0.1)',
  },
  {
    num: '03',
    title: 'Partner',
    desc: 'We collaborate with hospitals, eye care institutions, and community organizations like Sankara Eye Care and the Rotary Club.',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
        <circle cx="9" cy="7" r="4"></circle>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
      </svg>
    ),
    color: 'var(--rs-gold)',
    colorBg: 'rgba(212,160,23,0.1)',
  },
  {
    num: '04',
    title: 'Distribute',
    desc: 'We provide free vision screenings and distribute glasses directly to those in need — reaching hundreds across underserved communities.',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
        <circle cx="12" cy="12" r="3"></circle>
      </svg>
    ),
    color: 'var(--rs-teal)',
    colorBg: 'rgba(45,125,125,0.1)',
  },
];

const StepCard = ({ step, index, total }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <motion.div
      ref={ref}
      className="hw-step"
      style={{ '--step-color': step.color, '--step-bg': step.colorBg }}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: index * 0.12 }}
    >
      {/* Connection line to next step */}
      {index < total - 1 && (
        <motion.div
          className="hw-step__connector"
          initial={{ scaleX: 0 }}
          animate={isInView ? { scaleX: 1 } : {}}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: index * 0.12 + 0.4 }}
        />
      )}

      <motion.div
        className="hw-step__icon-wrap"
        initial={{ scale: 0, rotate: -30 }}
        animate={isInView ? { scale: 1, rotate: 0 } : {}}
        transition={{ duration: 0.6, ease: [0.34, 1.56, 0.64, 1], delay: index * 0.12 + 0.1 }}
      >
        <div className="hw-step__icon">{step.icon}</div>
      </motion.div>

      <motion.div
        className="hw-step__num"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 0.5, delay: index * 0.12 + 0.2 }}
      >
        {step.num}
      </motion.div>

      <h3 className="hw-step__title">{step.title}</h3>
      <p className="hw-step__desc">{step.desc}</p>

      {/* Animated bottom accent */}
      <motion.div
        className="hw-step__accent"
        initial={{ scaleX: 0 }}
        animate={isInView ? { scaleX: 1 } : {}}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: index * 0.12 + 0.3 }}
      />
    </motion.div>
  );
};

const HowWeWork = () => {
  const headerRef = useRef(null);
  const isHeaderInView = useInView(headerRef, { once: true, margin: '-80px' });

  return (
    <section className="rs-howwework" id="how-we-work">
      <div className="rs-howwework__inner">
        <motion.div
          ref={headerRef}
          className="rs-howwework__header"
          initial={{ opacity: 0, y: 40 }}
          animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        >

          <h2 className="section-title rs-howwework__title">
            How We <em>Make It Happen</em>
          </h2>
          <p className="section-subtitle">
            From collection to distribution — every step is designed to maximize impact and ensure every pair of glasses reaches someone who needs them.
          </p>
        </motion.div>

        <div className="rs-howwework__grid">
          {steps.map((step, i) => (
            <StepCard key={step.num} step={step} index={i} total={steps.length} />
          ))}
        </div>
      </div>

      <style>{`
        .rs-howwework {
          background: var(--bg-parchment);
          padding: var(--section-pad-y) var(--section-pad-x);
          position: relative;
          overflow: hidden;
        }

        .rs-howwework__inner {
          max-width: 1280px;
          margin: 0 auto;
        }

        .rs-howwework__header {
          margin-bottom: 3.5rem;
          max-width: 680px;
        }
        .rs-howwework__title em {
          font-style: italic;
          color: var(--rs-teal);
        }

        .rs-howwework__grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1.5rem;
          position: relative;
        }

        .hw-step {
          background: white;
          border: 1px solid rgba(64,58,58,0.06);
          border-radius: 22px;
          padding: 2rem 1.5rem;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          position: relative;
          overflow: hidden;
          transition: all 0.4s var(--ease-out-expo);
        }
        .hw-step:hover {
          transform: translateY(-8px);
          box-shadow: 0 24px 64px rgba(64,58,58,0.12);
          border-color: var(--step-color);
        }

        .hw-step__connector {
          position: absolute;
          top: 40px;
          right: -1.5rem;
          width: 1.5rem;
          height: 2px;
          background: linear-gradient(90deg, var(--step-color), rgba(64,58,58,0.1));
          transform-origin: left;
          z-index: 5;
        }

        .hw-step__icon-wrap {
          width: 56px;
          height: 56px;
          border-radius: 16px;
          background: var(--step-bg);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1.25rem;
          transition: all 0.3s ease;
        }
        .hw-step:hover .hw-step__icon-wrap {
          transform: scale(1.08);
          box-shadow: 0 8px 24px color-mix(in srgb, var(--step-color) 20%, transparent);
        }
        .hw-step__icon {
          color: var(--step-color);
        }

        .hw-step__num {
          font-family: 'Fraunces', serif;
          font-size: 0.75rem;
          font-weight: 800;
          letter-spacing: 0.1em;
          color: var(--step-color);
          opacity: 0.5;
          margin-bottom: 0.5rem;
        }

        .hw-step__title {
          font-family: 'Fraunces', Georgia, serif;
          font-size: 1.3rem;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 0.75rem;
          letter-spacing: -0.01em;
        }

        .hw-step__desc {
          font-family: 'Inter', sans-serif;
          font-size: 0.88rem;
          line-height: 1.7;
          color: var(--text-secondary);
          margin: 0;
          flex: 1;
        }

        .hw-step__accent {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: linear-gradient(90deg, var(--step-color), transparent);
          transform-origin: left;
        }

        @media (max-width: 1024px) {
          .rs-howwework__grid {
            grid-template-columns: repeat(2, 1fr);
          }
          .hw-step__connector { display: none; }
        }
        @media (max-width: 640px) {
          .rs-howwework__grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </section>
  );
};

export default HowWeWork;
