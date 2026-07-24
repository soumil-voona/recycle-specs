import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'motion/react';

/* ─── Data ─── */
const pastEvents = [
  {
    image: '/imgs/event1.jpg',
    imageWebp: '/imgs/event1.webp',
    title: 'Community Children Eye Screening Drive',
    subtitle: 'Guntur, India',
    date: 'July 2025',
    location: 'Zilla Parishad High School, Guntur, India',
    description: 'We successfully screened 385 students at Zilla Parishad High School, Guntur, and identified 109 who needed further care. Huge thanks to Vidhisha Paleti, our CEO for leading the effort, Sankara Eye Hospitals for conducting the screenings, and the Rotary Club of Guntur for organizing.',
    impact: '385 children screened · 40 glasses distributed',
    color: '#2d7d7d',
    tag: 'Children\'s Health',
  },
  {
    image: '/imgs/event2.jpg',
    imageWebp: '/imgs/event2.webp',
    title: 'Senior Citizens Eye Screening Drive',
    subtitle: 'Guntur, India',
    date: 'July 2025',
    location: 'Sankara Eye Hospital, Pedakkani, Guntur, India',
    description: 'We screened 210 senior citizens and assessed all needing cataract surgery, helping hundreds get the care they need. Huge thanks to Vidhisha Paleti for leading on the ground, Sankara Eye Hospitals for providing full support, and the Rotary Club of Guntur for organizing.',
    impact: '210 seniors screened · 120 cataract surgeries scheduled',
    color: '#c65d07',
    tag: 'Senior Care',
  },
];

const carouselImages = [
  '/imgs/events/pic1.webp', '/imgs/events/pic2.webp', '/imgs/events/pic3.webp',
  '/imgs/events/pic4.webp', '/imgs/events/pic5.webp', '/imgs/events/pic6.webp',
  '/imgs/events/pic7.webp', '/imgs/events/pic8.webp', '/imgs/events/pic9.webp',
  '/imgs/events/pic10.webp', '/imgs/events/pic11.webp', '/imgs/events/pic12.webp',
  '/imgs/events/pic13.webp', '/imgs/events/pic14.webp', '/imgs/events/pic15.webp',
  '/imgs/events/pic16.webp', '/imgs/events/pic17.webp', '/imgs/events/pic18.webp',
];

/* ─── Event Card ─── */
const EventCard = ({ event, index }) => {
  const [imageError, setImageError] = useState(false);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <motion.article
      ref={ref}
      className="event-card"
      style={{ '--ec': event.color }}
      initial={{ opacity: 0, y: 60, scale: 0.95 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: index * 0.15 }}
      whileHover={{ y: -8, transition: { duration: 0.35 } }}
    >
      {/* Image */}
      <div className="event-card__img-wrap">
        {!imageError ? (
          <picture>
            <source srcSet={event.imageWebp} type="image/webp" />
            <img
              src={event.image}
              alt={event.title}
              className="event-card__img"
              loading="lazy"
              width="540"
              height="260"
              onError={() => setImageError(true)}
            />
          </picture>
        ) : (
          <div className="event-card__img-placeholder">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="3" y="3" width="18" height="18" rx="3"/>
              <circle cx="8.5" cy="8.5" r="1.5"/>
              <path d="M21 15l-5-5L5 21"/>
            </svg>
          </div>
        )}
        <div className="event-card__img-overlay" />
        <motion.div
          className="event-card__tag"
          initial={{ opacity: 0, x: -10 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.5, delay: index * 0.15 + 0.3 }}
        >
          {event.tag}
        </motion.div>
        <div className="event-card__date">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
            <line x1="16" y1="2" x2="16" y2="6"/>
            <line x1="8" y1="2" x2="8" y2="6"/>
            <line x1="3" y1="10" x2="21" y2="10"/>
          </svg>
          {event.date}
        </div>
      </div>

      {/* Content */}
      <div className="event-card__content">
        <div className="event-card__location">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
            <circle cx="12" cy="10" r="3"/>
          </svg>
          {event.location}
        </div>
        <h3 className="event-card__title">{event.title}</h3>
        <p className="event-card__subtitle">{event.subtitle}</p>
        <p className="event-card__desc">{event.description}</p>

        <motion.div
          className="event-card__impact"
          initial={{ opacity: 0, x: -20 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6, delay: index * 0.15 + 0.4 }}
        >
          <span className="event-card__impact-icon">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'block' }}>
              <line x1="18" y1="20" x2="18" y2="10"></line>
              <line x1="12" y1="20" x2="12" y2="4"></line>
              <line x1="6" y1="20" x2="6" y2="14"></line>
            </svg>
          </span>
          <span>{event.impact}</span>
        </motion.div>
      </div>

      <div className="event-card__accent-bar" />
    </motion.article>
  );
};

/* ─── Gallery Carousel ─── */
const PhotoGallery = () => {
  const [loaded, setLoaded] = useState({});
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-40px' });

  return (
    <motion.div
      className="rs-gallery"
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="rs-gallery__header">

        <h3 className="rs-gallery__title">Moments from Our Drives</h3>
        <p className="rs-gallery__subtitle">Candid photos from our screening events in Guntur, India</p>
      </div>

      <div className="rs-gallery__track-wrapper">
        <div className="rs-gallery__track">
          {[...carouselImages, ...carouselImages].map((src, i) => (
            <div
              key={i}
              className="rs-gallery__item"
              style={{ display: loaded[i % carouselImages.length] === false ? 'none' : 'block' }}
            >
              <img
                src={src}
                alt={`RecycleSpecs event photo ${(i % carouselImages.length) + 1}`}
                className="rs-gallery__img"
                onError={() => setLoaded(prev => ({ ...prev, [i % carouselImages.length]: false }))}
                onLoad={() => setLoaded(prev => ({ ...prev, [i % carouselImages.length]: true }))}
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

/* ─── Main Component ─── */
const PastEvents = () => {
  const headerRef = useRef(null);
  const isHeaderInView = useInView(headerRef, { once: true, margin: '-60px' });

  return (
    <section className="rs-events" id="events">
      <div className="rs-events__inner">
        <motion.div
          ref={headerRef}
          className="rs-events__header"
          initial={{ opacity: 0, y: 40 }}
          animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        >

          <h2 className="section-title rs-events__title">
            Our Work in<br /><em>the Field</em>
          </h2>
          <p className="section-subtitle">
            Every event is a step forward in our mission to bring clear vision to communities that need it most.
          </p>
        </motion.div>

        <div className="rs-events__grid">
          {pastEvents.map((event, i) => (
            <EventCard key={event.title} event={event} index={i} />
          ))}
        </div>

        <PhotoGallery />
      </div>

      <style>{`
        .rs-events {
          background: var(--bg-sand);
          padding: var(--section-pad-y) 0;
          position: relative;
          overflow: hidden;
        }

        .rs-events__inner {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 var(--section-pad-x);
        }

        .rs-events__header { margin-bottom: 2.5rem; max-width: 680px; }
        .rs-events__title { font-size: clamp(2.4rem, 4.5vw, 3.8rem); }
        .rs-events__title em {
          font-style: italic;
          color: var(--rs-teal);
        }

        .rs-events__grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1.75rem;
          margin-bottom: 3rem;
        }

        .event-card {
          background: var(--bg-parchment);
          border-radius: 22px;
          overflow: hidden;
          border: 1px solid rgba(64,58,58,0.06);
          position: relative;
          display: flex;
          flex-direction: column;
        }
        .event-card:hover {
          box-shadow: 0 28px 70px rgba(64,58,58,0.15);
        }
        .event-card__accent-bar {
          position: absolute;
          top: 0; left: 0;
          width: 100%; height: 4px;
          background: var(--ec);
        }

        .event-card__img-wrap {
          position: relative;
          height: 260px;
          overflow: hidden;
          flex-shrink: 0;
        }
        .event-card__img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.8s var(--ease-out-expo);
        }
        .event-card:hover .event-card__img {
          transform: scale(1.06);
        }
        .event-card__img-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, transparent 40%, rgba(28,24,21,0.5) 100%);
        }
        .event-card__img-placeholder {
          width: 100%;
          height: 100%;
          background: var(--bg-warm);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-muted);
        }

        .event-card__tag {
          position: absolute;
          top: 16px; left: 16px;
          font-family: 'Inter', sans-serif;
          font-size: 0.7rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: white;
          background: var(--ec);
          padding: 5px 12px;
          border-radius: 999px;
        }
        .event-card__date {
          position: absolute;
          bottom: 12px; right: 16px;
          display: flex;
          align-items: center;
          gap: 5px;
          font-family: 'Inter', sans-serif;
          font-size: 0.75rem;
          font-weight: 600;
          color: white;
        }

        .event-card__content {
          padding: 1.5rem 1.75rem;
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .event-card__location {
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
        .event-card__title {
          font-family: 'Fraunces', Georgia, serif;
          font-size: 1.3rem;
          font-weight: 700;
          color: var(--text-primary);
          line-height: 1.25;
          margin: 0;
        }
        .event-card__subtitle {
          font-family: 'Inter', sans-serif;
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--ec);
          margin: 0;
        }
        .event-card__desc {
          font-family: 'Inter', sans-serif;
          font-size: 0.9rem;
          line-height: 1.75;
          color: var(--text-secondary);
          margin: 0.25rem 0 0;
          flex: 1;
        }
        .event-card__impact {
          display: flex;
          align-items: center;
          gap: 8px;
          background: rgba(64,58,58,0.05);
          border-radius: 10px;
          padding: 10px 14px;
          font-family: 'Inter', sans-serif;
          font-size: 0.82rem;
          font-weight: 600;
          color: var(--ec);
          margin-top: auto;
        }

        /* Gallery */
        .rs-gallery {
          padding-top: 0;
        }
        .rs-gallery__header {
          margin-bottom: 1.5rem;
        }
        .rs-gallery__title {
          font-family: 'Fraunces', Georgia, serif;
          font-size: clamp(1.5rem, 3vw, 2rem);
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 0.35rem;
        }
        .rs-gallery__subtitle {
          font-family: 'Inter', sans-serif;
          font-size: 0.9rem;
          color: var(--text-muted);
        }

        .rs-gallery__track-wrapper {
          overflow: hidden;
          border-radius: 18px;
          position: relative;
        }
        .rs-gallery__track-wrapper::before,
        .rs-gallery__track-wrapper::after {
          content: '';
          position: absolute;
          top: 0; bottom: 0;
          width: 80px;
          z-index: 10;
          pointer-events: none;
        }
        .rs-gallery__track-wrapper::before {
          left: 0;
          background: linear-gradient(90deg, var(--bg-sand), transparent);
        }
        .rs-gallery__track-wrapper::after {
          right: 0;
          background: linear-gradient(270deg, var(--bg-sand), transparent);
        }

        .rs-gallery__track {
          display: flex;
          gap: 16px;
          width: max-content;
          animation: marquee-left 50s linear infinite;
        }
        .rs-gallery__track:hover { animation-play-state: paused; }

        .rs-gallery__item {
          flex-shrink: 0;
          width: 280px;
          height: 200px;
          border-radius: 14px;
          overflow: hidden;
          border: 2px solid rgba(64,58,58,0.06);
          transition: transform 0.4s var(--ease-out-expo);
        }
        .rs-gallery__item:hover {
          transform: scale(1.03);
        }
        .rs-gallery__img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 0.6s ease;
        }
        .rs-gallery__item:hover .rs-gallery__img {
          transform: scale(1.08);
        }

        @media (max-width: 768px) {
          .rs-events__grid {
            grid-template-columns: 1fr;
            gap: 1.5rem;
          }
          .rs-gallery__item { width: 220px; height: 160px; }
        }
      `}</style>
    </section>
  );
};

export default PastEvents;