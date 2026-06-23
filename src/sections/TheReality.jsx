import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useInView } from 'motion/react';

const stats = [
  { value: '2.7B', label: 'people worldwide have vision problems', color: 'var(--rs-teal)' },
  { value: '1B', label: 'could be treated with a simple pair of glasses', color: 'var(--rs-orange)' },
  { value: '90%', label: 'of vision impairment is in developing countries', color: 'var(--rs-gold)' },
];

const StatCard = ({ stat, index }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <motion.div
      ref={ref}
      className="reality-stat"
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: index * 0.15 }}
    >
      <motion.div
        className="reality-stat__num"
        style={{ color: stat.color }}
        initial={{ opacity: 0, scale: 0.5 }}
        animate={isInView ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 0.6, ease: [0.34, 1.56, 0.64, 1], delay: index * 0.15 + 0.2 }}
      >
        {stat.value}
      </motion.div>
      <div className="reality-stat__label">{stat.label}</div>
      <motion.div
        className="reality-stat__bar"
        style={{ background: stat.color }}
        initial={{ scaleX: 0 }}
        animate={isInView ? { scaleX: 1 } : {}}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: index * 0.15 + 0.4 }}
      />
    </motion.div>
  );
};

const TheReality = () => {
  const sectionRef = useRef(null);
  const headlineRef = useRef(null);
  const subRef = useRef(null);
  const isHeadlineInView = useInView(headlineRef, { once: true, margin: '-100px' });
  const isSubInView = useInView(subRef, { once: true, margin: '-60px' });

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });
  const parallaxY = useTransform(scrollYProgress, [0, 1], ['5%', '-5%']);

  return (
    <section className="rs-reality" ref={sectionRef}>
      {/* Ambient background */}
      <motion.div className="rs-reality__bg" style={{ y: parallaxY }} aria-hidden="true">
        <div className="rs-reality__bg-gradient" />
      </motion.div>

      <div className="rs-reality__inner">
        {/* Big statement 1 */}
        <motion.div
          className="rs-reality__statement"
          ref={headlineRef}
          initial={{ opacity: 0, y: 60 }}
          animate={isHeadlineInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        >

          <h2 className="rs-reality__headline">
            <motion.span
              className="rs-reality__line"
              initial={{ opacity: 0, x: -30 }}
              animate={isHeadlineInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            >
              1 pair of unused glasses
            </motion.span>
            <br />
            <motion.em
              className="rs-reality__line-em"
              initial={{ opacity: 0, x: -30 }}
              animate={isHeadlineInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.25 }}
            >
              can change someone's life.
            </motion.em>
          </h2>
        </motion.div>

        {/* Second statement */}
        <motion.div
          className="rs-reality__sub-statement"
          ref={subRef}
          initial={{ opacity: 0, y: 50 }}
          animate={isSubInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="rs-reality__sub-text">
            A child who can't see the board falls behind in school. An adult without glasses struggles at work.
            <strong> Millions of people</strong> have never received a basic vision screening.
          </p>
        </motion.div>

        {/* Stats */}
        <div className="rs-reality__stats">
          {stats.map((stat, i) => (
            <StatCard key={stat.value} stat={stat} index={i} />
          ))}
        </div>

        {/* Divider statement */}
        <motion.div
          className="rs-reality__bridge"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="rs-reality__bridge-line" />
          <p className="rs-reality__bridge-text">
            RecycleSpecs believes that <em>clear vision is a right, not a privilege.</em>
          </p>
        </motion.div>
      </div>

      <style>{`
        .rs-reality {
          position: relative;
          background: var(--bg-dark);
          padding: clamp(5rem, 10vw, 8rem) var(--section-pad-x);
          overflow: hidden;
          color: var(--text-light);
        }

        .rs-reality__bg {
          position: absolute;
          inset: -10%;
          pointer-events: none;
        }
        .rs-reality__bg-gradient {
          position: absolute;
          inset: 0;
          background:
            radial-gradient(ellipse 60% 50% at 20% 30%, rgba(45,125,125,0.08) 0%, transparent 60%),
            radial-gradient(ellipse 50% 40% at 80% 70%, rgba(198,93,7,0.06) 0%, transparent 60%);
        }

        .rs-reality__inner {
          max-width: 1000px;
          margin: 0 auto;
          position: relative;
          z-index: 2;
        }

        .rs-reality__statement {
          margin-bottom: clamp(3rem, 6vw, 5rem);
        }

        .rs-reality__headline {
          font-family: 'Fraunces', Georgia, serif;
          font-size: clamp(2.2rem, 5vw, 4.5rem);
          font-weight: 900;
          line-height: 1.1;
          letter-spacing: -0.03em;
          color: white;
        }
        .rs-reality__line { display: inline-block; }
        .rs-reality__line-em {
          font-style: italic;
          color: var(--rs-gold-light);
          display: inline-block;
        }

        .rs-reality__sub-statement {
          margin-bottom: clamp(3rem, 6vw, 5rem);
          max-width: 700px;
        }
        .rs-reality__sub-text {
          font-family: 'Inter', sans-serif;
          font-size: clamp(1.1rem, 2vw, 1.35rem);
          line-height: 1.8;
          color: rgba(249,244,236,0.65);
        }
        .rs-reality__sub-text strong {
          color: rgba(249,244,236,0.95);
          font-weight: 600;
        }

        .rs-reality__stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
          margin-bottom: clamp(3rem, 6vw, 5rem);
        }

        .reality-stat {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 20px;
          padding: 2rem 1.75rem;
          position: relative;
          overflow: hidden;
          transition: all 0.4s var(--ease-out-expo);
        }
        .reality-stat:hover {
          background: rgba(255,255,255,0.07);
          transform: translateY(-4px);
          box-shadow: 0 16px 48px rgba(0,0,0,0.3);
        }
        .reality-stat__num {
          font-family: 'Fraunces', serif;
          font-size: clamp(2.5rem, 5vw, 3.5rem);
          font-weight: 900;
          line-height: 1;
          margin-bottom: 0.75rem;
        }
        .reality-stat__label {
          font-family: 'Inter', sans-serif;
          font-size: 0.92rem;
          line-height: 1.5;
          color: rgba(249,244,236,0.6);
        }
        .reality-stat__bar {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 3px;
          transform-origin: left;
        }

        .rs-reality__bridge {
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1.5rem;
        }
        .rs-reality__bridge-line {
          width: 1px;
          height: 50px;
          background: linear-gradient(180deg, transparent, rgba(249,244,236,0.3));
        }
        .rs-reality__bridge-text {
          font-family: 'Fraunces', Georgia, serif;
          font-size: clamp(1.2rem, 2.5vw, 1.6rem);
          font-weight: 500;
          color: rgba(249,244,236,0.8);
          max-width: 500px;
          line-height: 1.5;
        }
        .rs-reality__bridge-text em {
          font-style: italic;
          color: var(--rs-teal-light);
        }

        @media (max-width: 768px) {
          .rs-reality__stats {
            grid-template-columns: 1fr;
            gap: 1rem;
          }
          .rs-reality__headline {
            font-size: clamp(1.8rem, 7vw, 2.5rem);
          }
        }
      `}</style>
    </section>
  );
};

export default TheReality;
