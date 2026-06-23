import React, { useEffect, useState } from 'react';

const Community = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const highlights = [
    'Community screenings and eyecare outreach',
    'Volunteer-driven support for local and international events',
    'Partnerships that expand access to care where it is needed most'
  ];

  return (
    <div className={`community-page ${isVisible ? 'visible' : ''}`}>
      <div className="bg-decoration">
        <div className="bg-stripe bg-stripe-1"></div>
        <div className="bg-stripe bg-stripe-2"></div>
        <div className="bg-stripe bg-stripe-3"></div>
        <div className="bg-stripe bg-stripe-4"></div>
      </div>

      <div className="community-shell">
        <div className="hero-card">
          <p className="eyebrow">Upcoming</p>
          <h1>Built with the people we serve</h1>
          <p className="intro">
            RecycleSpecs grows through community support, volunteer effort, and local partnerships.
            This page is the home for the work that connects our mission to the people around it.
          </p>
        </div>

        <div className="highlights-grid">
          {highlights.map((item) => (
            <div key={item} className="highlight-card">
              <div className="highlight-dot"></div>
              <p>{item}</p>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .community-page {
          position: relative;
          min-height: 100vh;
          padding: 110px 2rem 4rem;
          overflow: hidden;
          opacity: 0;
          transform: translateY(30px);
          transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
          background: rgba(45, 125, 125, 0.05);
        }

        .community-page.visible {
          opacity: 1;
          transform: translateY(0);
        }

        display: none;

        .bg-stripe {
          position: absolute;
          width: 220%;
          height: 8vh;
          left: -60%;
          transform-origin: center;
        }

        .bg-stripe-1 { display: none; }
        .bg-stripe-2 { display: none; }
        .bg-stripe-3 { display: none; }
        .bg-stripe-4 { display: none; }

        .community-shell {
          position: relative;
          z-index: 2;
          max-width: 1100px;
          margin: 0 auto;
        }

        .hero-card {
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.35);
          border-radius: 2rem;
          padding: clamp(2rem, 5vw, 4rem);
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.12);
          text-align: center;
        }

        .eyebrow {
          margin: 0 0 1rem;
          text-transform: uppercase;
          letter-spacing: 0.24em;
          font-size: 0.8rem;
          font-weight: 700;
          color: #8b5ba8;
          font-family: 'Segoe UI', sans-serif;
        }

        h1 {
          margin: 0;
          font-family: 'DM Serif Text', serif;
          font-size: clamp(2.5rem, 6vw, 5rem);
          line-height: 1;
          color: #2d2d2d;
        }

        .intro {
          max-width: 760px;
          margin: 1.5rem auto 0;
          font-family: 'Segoe UI', sans-serif;
          font-size: clamp(1.05rem, 2vw, 1.25rem);
          line-height: 1.8;
          color: #4a4a4a;
        }

        .highlights-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 1rem;
          margin-top: 1.5rem;
        }

        .highlight-card {
          background: rgba(255, 255, 255, 0.88);
          border-radius: 1.4rem;
          padding: 1.4rem;
          display: flex;
          align-items: flex-start;
          gap: 0.9rem;
          border: 1px solid rgba(0, 0, 0, 0.06);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
        }

        .highlight-dot {
          width: 0.8rem;
          height: 0.8rem;
          border-radius: 999px;
          margin-top: 0.35rem;
          background: #8b5ba8;
          flex: 0 0 auto;
        }

        .highlight-card p {
          margin: 0;
          font-family: 'Segoe UI', sans-serif;
          font-size: 1rem;
          line-height: 1.6;
          color: #333;
        }

        @media (max-width: 900px) {
          .highlights-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default Community;
