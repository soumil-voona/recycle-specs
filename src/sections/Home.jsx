import React, { useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';

const Home = () => {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });

  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.4], [1, 0]);
  const contentY = useTransform(scrollYProgress, [0, 0.4], [0, -60]);

  return (
    <section className="rs-hero" id="home" ref={sectionRef}>
      {/* Animated background elements */}
      <div className="rs-hero__bg" aria-hidden="true">
        <motion.div
          className="rs-hero__bg-orb orb-1"
          animate={{
            x: [0, 40, -20, 0],
            y: [0, -30, 20, 0],
            scale: [1, 1.1, 0.95, 1],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="rs-hero__bg-orb orb-2"
          animate={{
            x: [0, -30, 20, 0],
            y: [0, 20, -30, 0],
            scale: [1, 0.9, 1.1, 1],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="rs-hero__bg-orb orb-3"
          animate={{
            x: [0, 20, -40, 0],
            y: [0, -20, 10, 0],
          }}
          transition={{ duration: 30, repeat: Infinity, ease: 'easeInOut' }}
        />
        {/* Lens flare accents */}
        <motion.div
          className="rs-hero__lens-flare flare-1"
          animate={{ opacity: [0, 0.15, 0], scale: [0.8, 1.3, 0.8] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="rs-hero__lens-flare flare-2"
          animate={{ opacity: [0, 0.1, 0], scale: [1, 1.5, 1] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
        />
      </div>

      {/* Hero Content */}
      <motion.div
        className="rs-hero__content"
        style={{ opacity: contentOpacity, y: contentY }}
      >
        <div className="rs-hero__text">


          <motion.h1
            className="rs-hero__headline"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
          >
            Seeing Changes{' '}
            <br />
            <em className="rs-hero__headline-em">Everything.</em>
          </motion.h1>

          <motion.p
            className="rs-hero__body"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
          >
            RecycleSpecs redistributes eyeglasses and expands access to optical care in underserved communities worldwide — driven by a passionate team of high school students.
          </motion.p>

          <motion.div
            className="rs-hero__actions"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.45 }}
          >
            <motion.a
              href="mailto:recycle.specs@gmail.com"
              className="btn btn-primary rs-hero__cta-primary"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
            >
              Donate Glasses
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </motion.a>
            <motion.a
              href="/volunteer-login"
              className="btn btn-secondary rs-hero__cta-secondary"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
            >
              Get Involved
            </motion.a>
          </motion.div>
        </div>

        {/* Hero visual */}
        <motion.div
          className="rs-hero__visual"
          initial={{ opacity: 0, scale: 0.88, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
        >
          <div className="rs-hero__frame-outer">
            <div className="rs-hero__frame-inner">
              <motion.img
                src="/imgs/event1.jpg"
                alt="RecycleSpecs team conducting an eye screening drive in Guntur, India"
                className="rs-hero__img"
                style={{ y: bgY }}
              />
              <div className="rs-hero__frame-overlay" />
            </div>
            {/* Floating badges */}
            <motion.div
              className="rs-hero__badge badge-tl"
              initial={{ opacity: 0, x: -30, y: -20 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.8 }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2"/>
                <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <div>
                <div className="badge-num">595+</div>
                <div className="badge-label">People Served</div>
              </div>
            </motion.div>
            <motion.div
              className="rs-hero__badge badge-br"
              initial={{ opacity: 0, x: 30, y: 20 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 1.0 }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--rs-teal)' }}>
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
              <div>
                <div className="badge-num">100%</div>
                <div className="badge-label">Youth-Led</div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="rs-hero__scroll-hint"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.8 }}
      >
      </motion.div>

      <style>{`
        .rs-hero {
          position: relative;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 80px var(--section-pad-x) 2rem;
          overflow: hidden;
          background: var(--bg-cream);
        }

        /* Background orbs */
        .rs-hero__bg {
          position: absolute;
          inset: 0;
          pointer-events: none;
          overflow: hidden;
        }
        .rs-hero__bg-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
        }
        .orb-1 {
          width: 600px; height: 600px;
          background: radial-gradient(circle, rgba(45,125,125,0.12) 0%, transparent 70%);
          top: -10%; right: -5%;
        }
        .orb-2 {
          width: 500px; height: 500px;
          background: radial-gradient(circle, rgba(198,93,7,0.08) 0%, transparent 70%);
          bottom: -15%; left: -5%;
        }
        .orb-3 {
          width: 400px; height: 400px;
          background: radial-gradient(circle, rgba(212,160,23,0.06) 0%, transparent 70%);
          top: 30%; left: 40%;
        }

        /* Lens flare */
        .rs-hero__lens-flare {
          position: absolute;
          border-radius: 50%;
          pointer-events: none;
        }
        .flare-1 {
          width: 200px; height: 200px;
          background: radial-gradient(circle, rgba(45,125,125,0.2), transparent 70%);
          top: 20%; right: 25%;
        }
        .flare-2 {
          width: 150px; height: 150px;
          background: radial-gradient(circle, rgba(240,200,74,0.15), transparent 70%);
          bottom: 30%; left: 30%;
        }

        /* Content Layout */
        .rs-hero__content {
          max-width: 1280px;
          margin: 0 auto;
          width: 100%;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: clamp(2rem, 5vw, 5rem);
          align-items: center;
          min-height: calc(100vh - 120px);
          position: relative;
          z-index: 2;
        }

        /* Text block */


        .rs-hero__headline {
          font-family: 'Fraunces', Georgia, serif;
          font-size: clamp(3rem, 6vw, 5.5rem);
          font-weight: 900;
          line-height: 1.0;
          letter-spacing: -0.03em;
          color: var(--text-primary);
          margin-bottom: 1.5rem;
        }
        .rs-hero__headline-em {
          font-style: italic;
          color: var(--rs-teal);
          position: relative;
          display: inline-block;
        }
        .rs-hero__headline-em::after {
          content: '';
          position: absolute;
          bottom: -6px;
          left: 0;
          width: 100%;
          height: 4px;
          background: linear-gradient(90deg, var(--rs-teal), var(--rs-teal-light));
          border-radius: 2px;
          transform-origin: left;
          animation: draw-line 1.2s var(--ease-out-expo) 0.8s both;
        }

        .rs-hero__body {
          font-family: 'Inter', sans-serif;
          font-size: clamp(1rem, 1.5vw, 1.15rem);
          color: var(--text-secondary);
          max-width: 500px;
          line-height: 1.8;
          margin-bottom: 2.5rem;
        }

        .rs-hero__actions {
          display: flex;
          gap: 14px;
          flex-wrap: wrap;
        }

        .rs-hero__cta-primary {
          font-size: 0.95rem;
          padding: 14px 28px;
          background: var(--rs-orange);
        }
        .rs-hero__cta-secondary {
          font-size: 0.95rem;
          padding: 14px 28px;
        }

        /* Hero Visual */
        .rs-hero__visual {
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .rs-hero__frame-outer {
          position: relative;
          width: 100%;
          max-width: 540px;
        }

        .rs-hero__frame-inner {
          position: relative;
          border-radius: 24px;
          overflow: hidden;
          aspect-ratio: 4/3;
          box-shadow: 0 30px 80px rgba(64,58,58,0.22), 0 0 0 1px rgba(64,58,58,0.05);
        }

        .rs-hero__img {
          width: 100%;
          height: 120%;
          object-fit: cover;
          transform: scale(1);
          transition: transform 8s ease;
        }
        .rs-hero__frame-inner:hover .rs-hero__img {
          transform: scale(1.04);
        }

        .rs-hero__frame-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, rgba(45,125,125,0.05) 0%, rgba(28,24,21,0.15) 100%);
        }

        /* Floating Badges */
        .rs-hero__badge {
          position: absolute;
          display: flex;
          align-items: center;
          gap: 10px;
          background: rgba(255,255,255,0.95);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-radius: 14px;
          padding: 12px 16px;
          box-shadow: 0 8px 32px rgba(64,58,58,0.16), 0 0 0 1px rgba(255,255,255,0.8);
          font-family: 'Inter', sans-serif;
          animation: float-gentle 8s ease-in-out infinite;
          z-index: 5;
        }
        .badge-tl {
          top: -16px;
          left: -20px;
          color: var(--rs-teal);
          animation-delay: 0s;
        }
        .badge-br {
          bottom: -16px;
          right: -20px;
          animation-delay: -4s;
        }
        .badge-num {
          font-family: 'Fraunces', serif;
          font-size: 1.3rem;
          font-weight: 900;
          color: var(--text-primary);
          line-height: 1;
        }
        .badge-label {
          font-size: 0.68rem;
          font-weight: 600;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          color: var(--text-muted);
          line-height: 1;
          margin-top: 2px;
        }

        /* Scroll hint */
        .rs-hero__scroll-hint {
          position: absolute;
          bottom: clamp(1.5rem, 4vw, 2.5rem);
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          z-index: 5;
        }
        .rs-hero__scroll-dot {
          width: 24px;
          height: 40px;
          border: 2px solid rgba(64,58,58,0.2);
          border-radius: 12px;
          position: relative;
        }
        .rs-hero__scroll-dot::before {
          content: '';
          position: absolute;
          top: 6px;
          left: 50%;
          transform: translateX(-50%);
          width: 4px;
          height: 4px;
          background: var(--rs-orange);
          border-radius: 50%;
          animation: scroll-dot 2s ease-in-out infinite;
        }
        .rs-hero__scroll-text {
          font-family: 'Inter', sans-serif;
          font-size: 0.65rem;
          font-weight: 600;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: var(--text-muted);
        }
        @keyframes scroll-dot {
          0% { top: 6px; opacity: 1; }
          80% { top: 22px; opacity: 0.3; }
          100% { top: 6px; opacity: 0; }
        }

        /* Responsive */
        @media (max-width: 900px) {
          .rs-hero {
            padding-top: 90px;
          }
          .rs-hero__content {
            grid-template-columns: 1fr;
            text-align: center;
            min-height: auto;
            gap: 2.5rem;
          }
          .rs-hero__text {
            order: 1;
            display: flex;
            flex-direction: column;
            align-items: center;
          }
          .rs-hero__body {
            max-width: 100%;
          }
          .rs-hero__actions {
            justify-content: center;
          }
          .rs-hero__visual {
            order: 2;
          }
          .rs-hero__frame-outer {
            max-width: 480px;
          }
          .rs-hero__scroll-hint { display: none; }
        }
        @media (max-width: 480px) {
          .rs-hero__headline { font-size: clamp(2.4rem, 10vw, 3.2rem); }
          .badge-tl { top: -10px; left: -8px; padding: 8px 12px; }
          .badge-br { bottom: -10px; right: -8px; padding: 8px 12px; }
          .badge-num { font-size: 1.1rem; }
        }
      `}</style>
    </section>
  );
};

export default Home;