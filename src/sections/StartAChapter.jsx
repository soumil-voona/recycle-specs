import React, { useRef } from 'react';
import { motion, useInView } from 'motion/react';

const StartAChapter = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <section className="rs-chapter" id="start-chapter">
      <div className="rs-chapter__inner">
        <motion.a
          ref={ref}
          href="https://docs.google.com/forms/d/e/1FAIpQLSd9aEDApzvprFccS0C4DPUSffluMbAHRuKF1YGDuayXgre_hQ/viewform"
          target="_blank"
          rel="noopener noreferrer"
          className="rs-chapter__banner"
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          whileHover={{ y: -5, scale: 1.02, transition: { duration: 0.3 } }}
          whileTap={{ scale: 0.98 }}
        >
          <picture>
            <source srcSet="/imgs/start-chapter-banner.webp" type="image/webp" />
            <img
              src="/imgs/start-chapter-banner.png"
              alt="Start a RecycleSpecs Chapter"
              className="rs-chapter__img"
              loading="lazy"
            />
          </picture>
          <div className="rs-chapter__overlay">
            <span className="rs-chapter__cta">Click to Apply</span>
          </div>
        </motion.a>
      </div>

      <style>{`
        .rs-chapter {
          background: var(--bg-cream);
          padding: 2rem var(--section-pad-x) var(--section-pad-y);
          position: relative;
        }

        .rs-chapter__inner {
          max-width: 1000px;
          margin: 0 auto;
        }

        .rs-chapter__banner {
          display: block;
          position: relative;
          border-radius: 24px;
          overflow: hidden;
          box-shadow: 0 12px 40px rgba(64,58,58,0.1);
          text-decoration: none;
          cursor: pointer;
        }

        .rs-chapter__img {
          width: 100%;
          height: auto;
          display: block;
          object-fit: cover;
        }

        .rs-chapter__overlay {
          position: absolute;
          inset: 0;
          background: rgba(0,0,0,0.4);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .rs-chapter__banner:hover .rs-chapter__overlay {
          opacity: 1;
        }

        .rs-chapter__cta {
          font-family: 'Inter', sans-serif;
          font-weight: 700;
          font-size: 1.1rem;
          color: white;
          background: var(--rs-orange);
          padding: 12px 28px;
          border-radius: 999px;
          transform: translateY(10px);
          transition: transform 0.3s var(--ease-out-expo);
        }

        .rs-chapter__banner:hover .rs-chapter__cta {
          transform: translateY(0);
        }

        @media (max-width: 768px) {
          .rs-chapter__banner {
            border-radius: 16px;
          }
        }
      `}</style>
    </section>
  );
};

export default StartAChapter;
