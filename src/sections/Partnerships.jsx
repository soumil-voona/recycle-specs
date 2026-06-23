import React, { useRef } from 'react';
import { motion, useInView } from 'motion/react';

const partners = [
  {
    name: 'Sankara Eye Hospitals',
    desc: 'Conducting free eye screenings and cataract surgery scheduling at our community events.',
    logo: '/imgs/partnership_sankara-eye-care.png',
    color: '#2d7d7d',
    type: 'Medical Partner',
  },
  {
    name: 'Rotary Club of Guntur',
    desc: 'Community organizing and logistics support for our screening drives across India.',
    logo: '/imgs/partnership_rotary-international.png',
    color: '#c65d07',
    type: 'Community Partner',
  },
];

const publications = [
  {
    image: "/imgs/pub_1.jpg",
    title: "Rotary Club of Guntur Vikas - Guntar Vikas (Aug 2025)",
    description: "The Rotary Club of Guntur (one of our partners) has published the August 2025 article on one of the eye camps we have done in collabaration with them.",
    link: "/guntur_vikas_aug_2025.pdf"
  },
  {
    image: "/imgs/SidekickPublication.png",
    title: "Coppell Student Media - Seeing a Brighter Future as RecycleSpecs Brings Optical Health to Marginalized Communities (Sep 2025)",
    description: "We were published in our school newspaper for our door-to-door glasses collection and the positive community impact it created.",
    link: "https://coppellstudentmedia.com/141106/studentlife/seeing-a-brighter-future-as-recyclespecs-brings-optical-health-to-marginalized-communities/"
  },
];

const PartnerCard = ({ partner, index }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <motion.article
      ref={ref}
      className="partner-card"
      style={{ '--pc': partner.color }}
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: index * 0.12 }}
      whileHover={{ y: -6, transition: { duration: 0.3 } }}
    >
      <div className="partner-card__badge">{partner.type}</div>

      <motion.div
        className="partner-card__logo-wrap"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={isInView ? { scale: 1, opacity: 1 } : {}}
        transition={{ duration: 0.6, ease: [0.34, 1.56, 0.64, 1], delay: index * 0.12 + 0.15 }}
      >
        <img
          src={partner.logo}
          alt={`${partner.name} logo`}
          className="partner-card__logo"
          onError={e => { e.target.style.display = 'none'; }}
        />
      </motion.div>

      <h3 className="partner-card__name">{partner.name}</h3>
      <p className="partner-card__desc">{partner.desc}</p>

      <motion.div
        className="partner-card__bar"
        initial={{ scaleX: 0 }}
        animate={isInView ? { scaleX: 1 } : {}}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: index * 0.12 + 0.3 }}
      />
    </motion.article>
  );
};

const Partnerships = () => {
  const headerRef = useRef(null);
  const isHeaderInView = useInView(headerRef, { once: true, margin: '-60px' });
  const pubRef = useRef(null);
  const isPubInView = useInView(pubRef, { once: true, margin: '-40px' });

  return (
    <section className="rs-partners" id="partnerships">
      <div className="rs-partners__inner">
        <motion.div
          ref={headerRef}
          className="rs-partners__header"
          initial={{ opacity: 0, y: 40 }}
          animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        >

          <h2 className="section-title rs-partners__title">
            Our <em>Partners</em>
          </h2>
          <p className="section-subtitle">
            We collaborate with hospitals, community groups, and organizations to extend our reach and impact.
          </p>
        </motion.div>

        <div className="rs-partners__grid">
          {partners.map((partner, i) => (
            <PartnerCard key={partner.name} partner={partner} index={i} />
          ))}
        </div>

        {/* Publications */}
        <motion.div
          ref={pubRef}
          className="rs-partners__pub-section"
          initial={{ opacity: 0, y: 30 }}
          animate={isPubInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <h3 className="rs-partners__pub-header">Featured In</h3>
          <div className="rs-partners__pub-grid">
            {publications.map((pub, i) => (
              <motion.a
                key={pub.title}
                href={pub.link}
                target="_blank"
                rel="noopener noreferrer"
                className="rs-pub-card"
                initial={{ opacity: 0, y: 20 }}
                animate={isPubInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: i * 0.1 + 0.2 }}
                whileHover={{ y: -6, transition: { duration: 0.3 } }}
              >
                <div className="rs-pub-card__img-wrap">
                  <img src={pub.image} alt={pub.title} className="rs-pub-card__img" />
                </div>
                <div className="rs-pub-card__content">
                  <h4 className="rs-pub-card__title">{pub.title}</h4>
                  <p className="rs-pub-card__desc">{pub.description}</p>
                  <div className="rs-pub-card__cta">
                    Read Article
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </div>
                </div>
              </motion.a>
            ))}
          </div>
        </motion.div>
      </div>

      <style>{`
        .rs-partners {
          background: var(--bg-parchment);
          padding: var(--section-pad-y) var(--section-pad-x);
          position: relative;
          overflow: hidden;
        }

        .rs-partners__inner {
          max-width: 1280px;
          margin: 0 auto;
        }

        .rs-partners__header { margin-bottom: 2.5rem; max-width: 680px; }
        .rs-partners__title { font-size: clamp(2.4rem, 4.5vw, 3.8rem); }
        .rs-partners__title em {
          font-style: italic;
          color: var(--rs-teal);
        }

        .rs-partners__grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1.5rem;
          margin-bottom: 3rem;
        }

        .partner-card {
          background: white;
          border: 1px solid rgba(64,58,58,0.06);
          border-radius: 22px;
          padding: 2rem 2rem 1.75rem;
          position: relative;
          overflow: hidden;
        }
        .partner-card:hover {
          box-shadow: 0 20px 56px rgba(64,58,58,0.12);
          border-color: var(--pc);
        }
        .partner-card__bar {
          position: absolute;
          bottom: 0; left: 0; right: 0;
          height: 3px;
          background: var(--pc);
          transform-origin: left;
        }

        .partner-card__badge {
          font-family: 'Inter', sans-serif;
          font-size: 0.68rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--pc);
          background: color-mix(in srgb, var(--pc) 8%, transparent);
          padding: 4px 12px;
          border-radius: 999px;
          display: inline-flex;
          margin-bottom: 1.25rem;
        }

        .partner-card__logo-wrap {
          width: 72px;
          height: 72px;
          border-radius: 16px;
          background: var(--bg-cream);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1.25rem;
          overflow: hidden;
          border: 1px solid rgba(64,58,58,0.06);
        }
        .partner-card__logo {
          max-width: 56px;
          max-height: 56px;
          object-fit: contain;
        }

        .partner-card__name {
          font-family: 'Fraunces', Georgia, serif;
          font-size: 1.3rem;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 0.5rem;
        }
        .partner-card__desc {
          font-family: 'Inter', sans-serif;
          font-size: 0.92rem;
          line-height: 1.7;
          color: var(--text-secondary);
          margin: 0;
        }

        /* Publications Section */
        .rs-partners__pub-section {
          background: var(--bg-warm);
          border-radius: 20px;
          padding: 2rem 2.5rem;
          border: 1px solid rgba(64,58,58,0.06);
        }
        
        .rs-partners__pub-header {
          font-family: 'Fraunces', Georgia, serif;
          font-size: 1.4rem;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 1.5rem;
        }

        .rs-partners__pub-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1.5rem;
        }

        .rs-pub-card {
          display: flex;
          background: white;
          border-radius: 16px;
          overflow: hidden;
          text-decoration: none;
          border: 1px solid rgba(64,58,58,0.06);
          box-shadow: 0 4px 12px rgba(64,58,58,0.04);
          transition: all 0.3s ease;
        }

        .rs-pub-card:hover {
          box-shadow: 0 16px 40px rgba(64,58,58,0.1);
          border-color: var(--rs-teal);
        }

        .rs-pub-card__img-wrap {
          width: 160px;
          flex-shrink: 0;
          background: var(--bg-sand);
          border-right: 1px solid rgba(64,58,58,0.06);
        }

        .rs-pub-card__img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .rs-pub-card__content {
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .rs-pub-card__title {
          font-family: 'Fraunces', serif;
          font-weight: 700;
          font-size: 1.15rem;
          color: var(--text-primary);
          margin: 0 0 0.5rem;
          line-height: 1.3;
        }

        .rs-pub-card__desc {
          font-family: 'Inter', sans-serif;
          font-size: 0.85rem;
          line-height: 1.6;
          color: var(--text-secondary);
          margin: 0 0 1rem;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .rs-pub-card__cta {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-family: 'Inter', sans-serif;
          font-weight: 700;
          font-size: 0.85rem;
          color: var(--rs-teal);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-top: auto;
          transition: transform 0.3s ease;
        }

        .rs-pub-card:hover .rs-pub-card__cta svg {
          transform: translateX(4px);
        }

        @media (max-width: 900px) {
          .rs-partners__grid { grid-template-columns: 1fr; }
          .rs-partners__pub-grid { grid-template-columns: 1fr; }
        }

        @media (max-width: 600px) {
          .rs-pub-card {
            flex-direction: column;
          }
          .rs-pub-card__img-wrap {
            width: 100%;
            height: 180px;
            border-right: none;
            border-bottom: 1px solid rgba(64,58,58,0.06);
          }
        }
      `}</style>
    </section>
  );
};

export default Partnerships;