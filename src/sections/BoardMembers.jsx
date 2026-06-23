import React, { useState, useRef } from 'react';
import { motion, useInView } from 'motion/react';

const teamMembers = [
  {
    profileImage: '/imgs/pfp-vidhisha.png',
    name: 'Vidhisha Paleti',
    title: 'Chief Executive Officer',
    mission: 'Ensuring no one struggles with vision the way she once did — leading on-ground screening drives worldwide.',
    color: '#2d7d7d',
    initials: 'VP',
  },
  {
    profileImage: '/imgs/pfp-soukhya.png',
    name: 'Soukhya Voona',
    title: 'Chief Operating Officer',
    mission: 'Turning passion for medicine and community service into operational strategies that make lasting impact.',
    color: '#c65d07',
    initials: 'SV',
  },
  {
    profileImage: '/imgs/pfp-akshata.png',
    name: 'Akshata Ghosh',
    title: 'Chief Communications Officer',
    mission: 'Amplifying our message through law, policy, and international affairs to reach the communities that need it.',
    color: '#d4a017',
    initials: 'AG',
  },
  {
    profileImage: '/imgs/pfp-soumil.png',
    name: 'Soumil Voona',
    title: 'Chief Technical Officer',
    mission: 'Building the digital backbone that connects our mission to the world through technology.',
    color: '#924014',
    initials: 'SV',
  },
  {
    profileImage: '/imgs/pfp-sidharta.png',
    name: 'Sidharta De',
    title: 'Chief Financial Officer',
    mission: 'Growing our financial foundation through exceptional interpersonal skills and fundraising expertise.',
    color: '#21544E',
    initials: 'SD',
  },
  {
    profileImage: '/imgs/pfp-aditi.png',
    name: 'Aditi Ahuja',
    title: 'Chief Design Officer',
    mission: 'Channeling creativity into every visual element so our design amplifies our mission.',
    color: '#5a3d2b',
    initials: 'AA',
  },
];

const MemberCard = ({ member, index }) => {
  const [imageError, setImageError] = useState(false);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-40px' });

  return (
    <motion.article
      ref={ref}
      className="member-card"
      style={{ '--mc': member.color }}
      initial={{ opacity: 0, y: 50, scale: 0.95 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: index * 0.08 }}
      whileHover={{ y: -8, transition: { duration: 0.3 } }}
    >
      <div className="member-card__avatar-wrap">
        {!imageError ? (
          <img
            src={member.profileImage}
            alt={`${member.name}, ${member.title}`}
            className="member-card__avatar"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="member-card__avatar-fallback" style={{ background: member.color }}>
            <span>{member.initials}</span>
          </div>
        )}
        <motion.div
          className="member-card__avatar-ring"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={isInView ? { scale: 1, opacity: 0.3 } : {}}
          transition={{ duration: 0.6, delay: index * 0.08 + 0.3 }}
        />
      </div>

      <div className="member-card__body">
        <div className="member-card__role">{member.title}</div>
        <h3 className="member-card__name">{member.name}</h3>
        <p className="member-card__mission">{member.mission}</p>
      </div>

      <motion.div
        className="member-card__accent-bar"
        initial={{ height: 0 }}
        animate={isInView ? { height: '100%' } : {}}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: index * 0.08 + 0.2 }}
      />
    </motion.article>
  );
};

const BoardMembers = () => {
  const headerRef = useRef(null);
  const isHeaderInView = useInView(headerRef, { once: true, margin: '-60px' });

  return (
    <section className="rs-team" id="board">
      <div className="rs-team__inner">
        <motion.div
          ref={headerRef}
          className="rs-team__header"
          initial={{ opacity: 0, y: 40 }}
          animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        >

          <h2 className="section-title rs-team__title">
            Meet Our <em>Leadership</em>
          </h2>
          <p className="section-subtitle">
            Six students. One shared belief: that everyone deserves to see the world clearly.
          </p>
        </motion.div>

        <div className="rs-team__grid">
          {teamMembers.map((member, i) => (
            <MemberCard key={member.name} member={member} index={i} />
          ))}
        </div>

        <motion.div
          className="rs-team__footer"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="rs-team__footer-text">
            <span>Interested in joining the team or volunteering?</span>
          </div>
          <motion.a
            href="mailto:recycle.specs@gmail.com"
            className="btn btn-primary"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            Reach Out
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M2 8h12M10 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </motion.a>
        </motion.div>
      </div>

      <style>{`
        .rs-team {
          background: var(--bg-cream);
          padding: var(--section-pad-y) 0;
          position: relative;
          overflow: hidden;
        }

        .rs-team__inner {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 var(--section-pad-x);
        }

        .rs-team__header {
          margin-bottom: 2.5rem;
          max-width: 680px;
        }
        .rs-team__title { font-size: clamp(2.4rem, 4.5vw, 3.8rem); }
        .rs-team__title em {
          font-style: italic;
          color: var(--rs-orange);
        }

        .rs-team__grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
          margin-bottom: 3rem;
        }

        .member-card {
          background: var(--bg-parchment);
          border: 1px solid rgba(64,58,58,0.06);
          border-radius: 22px;
          padding: 2rem 1.75rem;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          position: relative;
          overflow: hidden;
          cursor: default;
        }
        .member-card:hover {
          box-shadow: 0 24px 60px rgba(64,58,58,0.14);
          border-color: var(--mc);
        }
        .member-card__accent-bar {
          position: absolute;
          top: 0; left: 0;
          width: 4px;
          background: var(--mc);
          border-radius: 0 2px 2px 0;
        }

        .member-card__avatar-wrap {
          position: relative;
          margin-bottom: 1.25rem;
          width: 72px;
          height: 72px;
          flex-shrink: 0;
        }
        .member-card__avatar {
          width: 72px;
          height: 72px;
          border-radius: 50%;
          object-fit: cover;
          display: block;
          transition: transform 0.5s var(--ease-out-expo);
          border: 3px solid transparent;
        }
        .member-card:hover .member-card__avatar {
          transform: scale(1.08);
          border-color: var(--mc);
        }
        .member-card__avatar-fallback {
          width: 72px;
          height: 72px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-family: 'Fraunces', serif;
          font-size: 1.3rem;
          font-weight: 700;
        }
        .member-card__avatar-ring {
          position: absolute;
          inset: -5px;
          border-radius: 50%;
          border: 2px solid var(--mc);
        }

        .member-card__role {
          font-family: 'Inter', sans-serif;
          font-size: 0.7rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--mc);
          margin-bottom: 4px;
        }
        .member-card__name {
          font-family: 'Fraunces', Georgia, serif;
          font-size: 1.15rem;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 0.6rem;
          letter-spacing: -0.01em;
        }
        .member-card__mission {
          font-family: 'Inter', sans-serif;
          font-size: 0.88rem;
          line-height: 1.65;
          color: var(--text-secondary);
          margin: 0;
        }

        .rs-team__footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          background: rgba(45,125,125,0.06);
          border: 1px solid rgba(45,125,125,0.15);
          border-radius: 16px;
          padding: 1.25rem 2rem;
          flex-wrap: wrap;
        }
        .rs-team__footer-text {
          font-family: 'Inter', sans-serif;
          font-size: 1rem;
          color: var(--text-secondary);
          font-weight: 500;
        }

        @media (max-width: 1024px) {
          .rs-team__grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 640px) {
          .rs-team__grid { grid-template-columns: 1fr; }
          .rs-team__footer {
            flex-direction: column;
            text-align: center;
          }
        }
      `}</style>
    </section>
  );
};

export default BoardMembers;