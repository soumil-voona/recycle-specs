import React from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';

const Chapters = () => {
  const navigate = useNavigate();

  return (
    <section className="rs-chapters">
      <div className="rs-chapters__bg" aria-hidden="true">
        <motion.div
          className="rs-chapters__blob rs-chapters__blob-1"
          animate={{ x: [0, 20, -10, 0], y: [0, -20, 10, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="rs-chapters__blob rs-chapters__blob-2"
          animate={{ x: [0, -20, 15, 0], y: [0, 15, -15, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      <div className="rs-chapters__inner">
        <motion.div 
          className="rs-chapters__header"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <h1 className="rs-chapters__title">RecycleSpecs Chapters</h1>
          <p className="rs-chapters__subtitle">
            Join an existing chapter as a volunteer, or manage your chapter's impact.
          </p>
        </motion.div>

        <div className="rs-chapters__cards">
          {/* Volunteer Card */}
          <motion.div 
            className="rs-chapters__card"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="rs-chapters__card-icon" style={{ color: 'var(--rs-teal)' }}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
            <h2 className="rs-chapters__card-title">Volunteer Sign Up</h2>
            <p className="rs-chapters__card-desc">
              Connect with a local chapter to track your volunteer hours and participate in community events.
            </p>
            <button 
              className="rs-chapters__btn rs-chapters__btn--teal"
              onClick={() => navigate('/chapters/signup')}
            >
              Sign Up as Volunteer
            </button>
          </motion.div>

          {/* Admin Card */}
          <motion.div 
            className="rs-chapters__card"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="rs-chapters__card-icon" style={{ color: 'var(--rs-orange)' }}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <line x1="3" y1="9" x2="21" y2="9" />
                <line x1="9" y1="21" x2="9" y2="9" />
              </svg>
            </div>
            <h2 className="rs-chapters__card-title">Chapter Admin Portal</h2>
            <p className="rs-chapters__card-desc">
              Log in to your chapter's dashboard to manage members, report events, and access resources.
            </p>
            <button 
              className="rs-chapters__btn rs-chapters__btn--orange"
              onClick={() => navigate('/chapters/admin-login')}
            >
              Chapter Login
            </button>
          </motion.div>
        </div>
      </div>

      <style>{`
        .rs-chapters {
          height: 100vh;
          background: var(--bg-dark);
          color: white;
          padding: calc(80px + var(--section-pad-y)) var(--section-pad-x);
          position: relative;
          overflow: hidden;
          display: flex;
          align-items: center;
        }
        
        .rs-chapters__bg {
          position: absolute;
          inset: 0;
          pointer-events: none;
        }
        
        .rs-chapters__blob {
          position: absolute;
          border-radius: 50%;
          filter: blur(100px);
        }
        
        .rs-chapters__blob-1 {
          width: 500px; height: 500px;
          background: radial-gradient(circle, rgba(45,125,125,0.15) 0%, transparent 70%);
          top: -10%; left: -10%;
        }
        
        .rs-chapters__blob-2 {
          width: 400px; height: 400px;
          background: radial-gradient(circle, rgba(198,93,7,0.15) 0%, transparent 70%);
          bottom: -10%; right: -10%;
        }
        
        .rs-chapters__inner {
          max-width: 1000px;
          margin: 0 auto;
          position: relative;
          z-index: 1;
          width: 100%;
        }
        
        .rs-chapters__header {
          text-align: center;
          margin-bottom: 4rem;
        }
        
        .rs-chapters__title {
          font-family: 'Fraunces', serif;
          font-size: clamp(2.5rem, 5vw, 4rem);
          font-weight: 900;
          letter-spacing: -0.03em;
          margin-bottom: 1rem;
          color: white;
        }
        
        .rs-chapters__subtitle {
          font-family: 'Inter', sans-serif;
          font-size: 1.1rem;
          color: rgba(255,255,255,0.85);
          max-width: 600px;
          margin: 0 auto;
          line-height: 1.6;
        }
        
        .rs-chapters__cards {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
        }
        
        .rs-chapters__card {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 24px;
          padding: 3rem 2rem;
          text-align: center;
          backdrop-filter: blur(10px);
          transition: transform 0.3s ease, background 0.3s ease;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        
        .rs-chapters__card:hover {
          background: rgba(255,255,255,0.06);
          transform: translateY(-5px);
        }
        
        .rs-chapters__card-icon {
          margin-bottom: 1.5rem;
          background: rgba(255,255,255,0.05);
          width: 80px;
          height: 80px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .rs-chapters__card-title {
          font-family: 'Fraunces', serif;
          font-size: 1.5rem;
          font-weight: 700;
          margin-bottom: 1rem;
          color: white;
        }
        
        .rs-chapters__card-desc {
          font-family: 'Inter', sans-serif;
          color: rgba(255,255,255,0.85);
          line-height: 1.6;
          margin-bottom: 2.5rem;
          flex-grow: 1;
        }
        
        .rs-chapters__btn {
          font-family: 'Inter', sans-serif;
          font-weight: 600;
          font-size: 1rem;
          padding: 14px 32px;
          border-radius: 12px;
          border: none;
          cursor: pointer;
          transition: all 0.2s ease;
          width: 100%;
          color: white;
        }
        
        .rs-chapters__btn--teal {
          background: var(--rs-teal);
        }
        
        .rs-chapters__btn--teal:hover {
          background: #236565;
          transform: scale(1.02);
        }
        
        .rs-chapters__btn--orange {
          background: var(--rs-orange);
        }
        
        .rs-chapters__btn--orange:hover {
          background: var(--rs-orange-dark);
          transform: scale(1.02);
        }
        
        @media (max-width: 768px) {
          .rs-chapters__cards {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </section>
  );
};

export default Chapters;
