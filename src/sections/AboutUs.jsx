import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, IconButton, Typography, Box } from '@mui/material';

const AboutUs = () => {
  // Removed hoveredSection state - using pure CSS hover now
  const [isVisible, setIsVisible] = useState(false);
  const [activeImpact, setActiveImpact] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const sections = [
    {
      id: 'approach',
      title: 'Our Approach',
      content: 'Along with hosting fundraisers where all proceeds go to things like organizing optical checkups in marginalized areas, we also aim to collect old lenses and glasses which can be donated to these areas. More information coming soon!',
      color: '#c65d07',
      stripeAngle: '45deg'
    },
    {
      id: 'mission',
      title: 'Our Mission',
      content: 'To advance optical awareness by empowering and educating communities through accessible resources and outreach.',
      color: '#2d7d7d',
      stripeAngle: '-45deg'
    }
  ];

  const impactStats = [
    {
      id: 'screened',
      label: 'People Screened',
      value: '595',
      accent: '#2d7d7d',
      summary: 'Total number of people who received eye screenings through our programs.',
      breakdown: [
        'Community Children Eye Screening Drive in Guntur, India: 385',
        'Community Senior Citizens Eye Screening Drive in Guntur, India: 210',
        'Individual follow-ups: 120'
      ]
    },
    {
      id: 'glasses',
      label: 'Glasses Collected & Donated',
      value: '66',
      accent: '#c65d07',
      summary: 'Eyeglasses gathered, sorted, and donated to support access to vision care.',
      breakdown: [
        'Pairs donated: 26',
        'Pairs distributed: 40',
      ]
    },
    {
      id: 'funds',
      label: 'Money Fundraised',
      value: '$200',
      accent: '#e6b800',
      summary: 'Funds raised to support outreach, screenings, and related mission costs.',
      breakdown: [
        'Door-to-door fundraising: 200 USD',
      ]
    }
  ];

  const SectionCard = ({ section, index }) => {
    const [sectionVisible, setSectionVisible] = useState(false);
    const ref = React.useRef(null);

    React.useEffect(() => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting && !sectionVisible) {
            setTimeout(() => {
              setSectionVisible(true);
            }, index * 150);
          }
        },
        { 
          threshold: 0.2,
          rootMargin: "-50px 0px -50px 0px"
        }
      );

      if (ref.current) {
        observer.observe(ref.current);
      }

      return () => {
        if (ref.current) {
          observer.unobserve(ref.current);
        }
      };
    }, [index, sectionVisible]);

    return (
      <div
        ref={ref}
        className={`section-card ${sectionVisible ? 'section-visible' : ''}`}
        style={{
          '--section-color': section.color,
          '--stripe-angle': section.stripeAngle,
        }}
      >
        {/* Card background stripes */}
        <div className="card-bg-stripes">
          <div className="card-bg-stripe stripe-1"></div>
          <div className="card-bg-stripe stripe-2"></div>
          <div className="card-bg-stripe stripe-3"></div>
        </div>

        {/* Section header */}
        <div className="section-header">
          <h2 className="section-title">{section.title}</h2>
          <div className="title-underline"></div>
        </div>

        {/* Section content */}
        <div className="section-content">
          <p className="section-text">{section.content}</p>
        </div>

        {/* Decorative elements */}
        <div className="diagonal-accent"></div>
        <div className="hover-glow"></div>
        
        {/* Interactive stripes */}
        <div className="interactive-stripes">
          <div className="interactive-stripe stripe-i-1"></div>
          <div className="interactive-stripe stripe-i-2"></div>
          <div className="interactive-stripe stripe-i-3"></div>
        </div>
      </div>
    );
  };

  const ImpactCard = ({ stat, index }) => {
    const [cardVisible, setCardVisible] = useState(false);
    const ref = React.useRef(null);

    React.useEffect(() => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting && !cardVisible) {
            setTimeout(() => {
              setCardVisible(true);
            }, index * 120);
          }
        },
        {
          threshold: 0.2,
          rootMargin: '-40px 0px -40px 0px'
        }
      );

      if (ref.current) {
        observer.observe(ref.current);
      }

      return () => {
        if (ref.current) {
          observer.unobserve(ref.current);
        }
      };
    }, [index, cardVisible]);

    return (
      <button
        ref={ref}
        type="button"
        className={`impact-card ${cardVisible ? 'impact-visible' : ''}`}
        onClick={() => setActiveImpact(stat)}
        style={{ '--impact-accent': stat.accent }}
      >
        <div
          className="impact-card-glow"
          style={{ background: `radial-gradient(circle at top right, ${stat.accent}26, transparent 58%)` }}
        ></div>
        <div className="impact-card-topline"></div>
        <div className="impact-card-value">{stat.value}</div>
        <div className="impact-card-label">{stat.label}</div>
        <div className="impact-card-summary">{stat.summary}</div>
        <div className="impact-card-footer">Click for breakdown</div>
      </button>
    );
  };

  return (
    <div className={`about-us-container ${isVisible ? 'visible' : ''}`}>
      {/* Background diagonal stripes */}
      <div className="bg-decoration">
        <div className="bg-stripe bg-stripe-1"></div>
        <div className="bg-stripe bg-stripe-2"></div>
        <div className="bg-stripe bg-stripe-3"></div>
        <div className="bg-stripe bg-stripe-4"></div>
        <div className="bg-stripe bg-stripe-5"></div>
      </div>

      <div className="content-wrapper">
        <div className="section-title" style={{textAlign: 'center', fontSize: 'clamp(3rem, 8vw, 6rem)'}}>
            About Us
        </div>

        <div id="impact" className="impact-section">
          <div className="impact-header">
            <p className="impact-eyebrow">Impact</p>
            <h2 className="impact-title">Our measurable reach</h2>
            <p className="impact-description">
              These numbers will track the people we screen, the glasses we collect and donate, and the funds we raise.
            </p>
          </div>

          <div className="impact-grid">
            {impactStats.map((stat, index) => (
              <ImpactCard key={stat.id} stat={stat} index={index} />
            ))}
          </div>
        </div>

        {sections.map((section, index) => (
          <SectionCard 
            key={section.id}
            section={section}
            index={index}
          />
        ))}
      </div>

      <Dialog
        open={Boolean(activeImpact)}
        onClose={() => setActiveImpact(null)}
        maxWidth="md"
        fullWidth
        scroll="paper"
        BackdropProps={{
          sx: {
            background: 'linear-gradient(135deg, rgba(10, 12, 14, 0.62), rgba(32, 26, 18, 0.5))',
            backdropFilter: 'blur(10px) saturate(120%)'
          }
        }}
        PaperProps={{
          sx: {
            borderRadius: { xs: '20px', sm: '28px' },
            background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.98), rgba(248, 245, 240, 0.96))',
            boxShadow: '0 36px 100px rgba(0, 0, 0, 0.34)',
            border: '1px solid rgba(255, 255, 255, 0.52)',
            overflow: 'hidden',
            position: 'relative'
          }
        }}
      >
        {activeImpact && (
          <DialogContent
            sx={{
              p: { xs: 2, sm: 4 },
              position: 'relative',
              '&::before': {
                content: '""',
                position: 'absolute',
                inset: 0,
                background:
                  'radial-gradient(circle at top right, rgba(198, 93, 7, 0.14), transparent 34%), radial-gradient(circle at bottom left, rgba(45, 125, 125, 0.12), transparent 30%), linear-gradient(135deg, rgba(198, 93, 7, 0.09), transparent 62%)',
                pointerEvents: 'none'
              },
              '&::after': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '6px',
                background: 'linear-gradient(90deg, #2d7d7d, #c65d07, #e6b800)',
                pointerEvents: 'none'
              }
            }}
          >
            <IconButton
              onClick={() => setActiveImpact(null)}
              aria-label="Close impact details"
              sx={{
                position: 'absolute',
                top: 12,
                right: 12,
                zIndex: 2,
                width: 42,
                height: 42,
                border: '1px solid rgba(0, 0, 0, 0.08)',
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                boxShadow: '0 10px 25px rgba(0, 0, 0, 0.12)',
                fontSize: '1.2rem',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.98)'
                }
              }}
            >
              ×
            </IconButton>

            <Typography
              component="p"
              sx={{
                position: 'relative',
                zIndex: 1,
                mb: 1,
                textTransform: 'uppercase',
                letterSpacing: '0.26em',
                fontSize: '0.78rem',
                fontWeight: 700,
                color: activeImpact.accent,
                fontFamily: 'Segoe UI, sans-serif'
              }}
            >
              Impact breakdown
            </Typography>

            <Typography
              component="h3"
              sx={{
                position: 'relative',
                zIndex: 1,
                m: 0,
                fontFamily: 'DM Serif Text, serif',
                fontSize: 'clamp(2rem, 5vw, 3.2rem)',
                lineHeight: 1.05,
                color: '#2d2d2d'
              }}
            >
              {activeImpact.label}
            </Typography>

            <Typography
              component="p"
              sx={{
                position: 'relative',
                zIndex: 1,
                mt: 2,
                mb: 2,
                fontFamily: 'Segoe UI, sans-serif',
                fontSize: '1.04rem',
                lineHeight: 1.7,
                color: '#4a4a4a',
                maxWidth: '56ch'
              }}
            >
              {activeImpact.summary}
            </Typography>

            <Box
              sx={{
                position: 'relative',
                zIndex: 1,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                minWidth: 160,
                px: 2,
                py: 1,
                borderRadius: '999px',
                background: 'linear-gradient(135deg, rgba(198, 93, 7, 0.14), rgba(255, 255, 255, 0.92))',
                border: '1px solid rgba(198, 93, 7, 0.12)',
                boxShadow: '0 10px 22px rgba(0, 0, 0, 0.08)',
                fontFamily: 'DM Serif Text, serif',
                fontSize: '1.7rem',
                color: '#2d2d2d',
                mb: 2
              }}
            >
              {activeImpact.value}
            </Box>

            <Box
              sx={{
                position: 'relative',
                zIndex: 1,
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, minmax(0, 1fr))' },
                gap: 1.2
              }}
            >
              {activeImpact.breakdown.map((item) => (
                <Box
                  key={item}
                  sx={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 1,
                    p: '0.95rem 1rem',
                    borderRadius: '1rem',
                    background: 'rgba(255, 255, 255, 0.74)',
                    border: '1px solid rgba(0, 0, 0, 0.06)',
                    boxShadow: '0 8px 18px rgba(0, 0, 0, 0.05)',
                    fontFamily: 'Segoe UI, sans-serif',
                    fontSize: '1rem',
                    color: '#333',
                    lineHeight: 1.5
                  }}
                >
                  <Box
                    sx={{
                      width: 10,
                      height: 10,
                      borderRadius: '999px',
                      background: activeImpact.accent,
                      mt: '0.45rem',
                      flex: '0 0 auto'
                    }}
                  />
                  <span>{item}</span>
                </Box>
              ))}
            </Box>

            <Typography
              component="p"
              sx={{
                position: 'relative',
                zIndex: 1,
                mt: 2,
                mb: 0,
                fontFamily: 'Segoe UI, sans-serif',
                fontSize: '0.92rem',
                lineHeight: 1.6,
                color: '#666'
              }}
            >
            </Typography>
          </DialogContent>
        )}
      </Dialog>

      <style jsx>{`
        .about-us-container {
          position: relative;
          padding: 0rem 2rem;
          max-width: 1400px;
          margin: 0 auto;
          min-height: 80vh;
          display: flex;
          align-items: center;
          overflow: hidden;
          opacity: 0;
          transform: translateY(50px);
          transition: all 0.8s cubic-bezier(0.4, 0.0, 0.2, 1);
        }

        .about-us-container.visible {
          opacity: 1;
          transform: translateY(0);
        }

        .bg-decoration {
          position: absolute;
          inset: 0;
          overflow: hidden;
          z-index: 1;
          opacity: 0.15;
        }

        .bg-stripe {
          position: absolute;
          width: 200%;
          height: 8vh;
          left: -50%;
          animation: bgFloat 12s ease-in-out infinite;
          transform-origin: center;
        }

        .bg-stripe-1 {
          background: linear-gradient(45deg, #403A3A, transparent);
          top: 15%;
          transform: rotate(-15deg);
          animation-delay: 0s;
        }

        .bg-stripe-2 {
          background: linear-gradient(45deg, #924014, transparent);
          top: 30%;
          transform: rotate(15deg);
          animation-delay: -2s;
        }

        .bg-stripe-3 {
          background: linear-gradient(45deg, #EAC19E, transparent);
          top: 45%;
          transform: rotate(-15deg);
          animation-delay: -4s;
        }

        .bg-stripe-4 {
          background: linear-gradient(45deg, #DA9F1A, transparent);
          top: 60%;
          transform: rotate(15deg);
          animation-delay: -6s;
        }

        .bg-stripe-5 {
          background: linear-gradient(45deg, #21544E, transparent);
          top: 75%;
          transform: rotate(-15deg);
          animation-delay: -8s;
        }

        @keyframes bgFloat {
          0%, 100% { 
            transform: translateX(-20px) rotate(-15deg); 
            opacity: 0.1; 
          }
          50% { 
            transform: translateX(20px) rotate(-15deg); 
            opacity: 0.2; 
          }
        }

        .content-wrapper {
          position: relative;
          z-index: 10;
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 3rem;
          max-width: 1000px;
          margin: 0 auto;
        }

        .impact-section {
          background: rgba(255, 255, 255, 0.88);
          backdrop-filter: blur(12px);
          border-radius: 2rem;
          padding: 2.5rem;
          border: 1px solid rgba(255, 255, 255, 0.35);
          box-shadow: 0 14px 40px rgba(0, 0, 0, 0.12);
        }

        .impact-header {
          text-align: center;
          max-width: 760px;
          margin: 0 auto 1.75rem;
        }

        .impact-eyebrow {
          margin: 0 0 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.22em;
          font-size: 0.78rem;
          font-weight: 700;
          color: #c65d07;
          font-family: 'Segoe UI', sans-serif;
        }

        .impact-title {
          margin: 0;
          font-family: 'DM Serif Text', Times, serif;
          font-size: clamp(2rem, 4vw, 3rem);
          color: #2d2d2d;
          line-height: 1.1;
        }

        .impact-description {
          margin: 1rem auto 0;
          font-family: 'Segoe UI', sans-serif;
          font-size: clamp(1rem, 2vw, 1.1rem);
          line-height: 1.7;
          color: #4a4a4a;
        }

        .impact-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 1rem;
        }

        .impact-card {
          position: relative;
          padding: 1.75rem 1.5rem;
          border: 0;
          border-radius: 1.5rem;
          background: linear-gradient(180deg, rgba(255, 255, 255, 0.98), rgba(248, 248, 248, 0.9));
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
          cursor: pointer;
          text-align: left;
          overflow: hidden;
          transition: transform 0.35s ease, box-shadow 0.35s ease, border-color 0.35s ease;
          opacity: 0;
          transform: translateY(28px) scale(0.96);
          filter: blur(6px);
        }

        .impact-card.impact-visible {
          opacity: 1;
          transform: translateY(0) scale(1);
          filter: blur(0);
        }

        .impact-card:hover {
          transform: translateY(-6px) scale(1.01);
          box-shadow: 0 18px 45px rgba(0, 0, 0, 0.14);
        }

        .impact-card-glow {
          position: absolute;
          inset: 0;
          pointer-events: none;
        }

        .impact-card-topline {
          width: 56px;
          height: 4px;
          border-radius: 999px;
          background: var(--impact-accent);
          margin-bottom: 1.2rem;
          position: relative;
          z-index: 1;
        }

        .impact-card-value {
          position: relative;
          z-index: 1;
          font-family: 'DM Serif Text', serif;
          font-size: clamp(2.2rem, 5vw, 3.2rem);
          line-height: 1;
          color: #2d2d2d;
          margin-bottom: 0.75rem;
        }

        .impact-card-label {
          position: relative;
          z-index: 1;
          font-family: 'Segoe UI', sans-serif;
          font-weight: 700;
          font-size: 1rem;
          color: #2d2d2d;
          margin-bottom: 0.8rem;
        }

        .impact-card-summary {
          position: relative;
          z-index: 1;
          font-family: 'Segoe UI', sans-serif;
          font-size: 0.98rem;
          line-height: 1.6;
          color: #555;
          margin-bottom: 1.4rem;
        }

        .impact-card-footer {
          position: relative;
          z-index: 1;
          font-family: 'Segoe UI', sans-serif;
          font-size: 0.9rem;
          font-weight: 700;
          color: var(--impact-accent);
        }


        .section-card {
          position: relative;
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(12px);
          border-radius: 2rem;
          padding: 3rem;
          overflow: hidden;
          border: 1px solid rgba(255, 255, 255, 0.3);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
          transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          cursor: pointer;
          
          /* Initial state - hidden */
          opacity: 0;
          transform: translateY(50px) scale(0.9);
          filter: blur(8px);
        }

        .section-card.section-visible {
          opacity: 1;
          transform: translateY(0) scale(1);
          filter: blur(0px);
        }

        /* Hover effects only apply to visible cards */
        .section-card.section-visible:hover {
          transform: translateY(-8px) scale(1.02);
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
          background: rgba(255, 255, 255, 0.95);
          border: 1px solid rgba(0, 0, 0, 0.1);
        }

        .card-bg-stripes {
          position: absolute;
          inset: 0;
          overflow: hidden;
          z-index: 1;
          opacity: 0.05;
        }

        .card-bg-stripe {
          position: absolute;
          width: 200%;
          height: 4px;
          left: -50%;
          animation: cardBgFloat 8s ease-in-out infinite;
        }

        .card-bg-stripe.stripe-1 {
          background: linear-gradient(90deg, transparent, var(--section-color), transparent);
          top: 25%;
          transform: rotate(var(--stripe-angle));
          animation-delay: 0s;
        }

        .card-bg-stripe.stripe-2 {
          background: linear-gradient(90deg, transparent, #e6b800, transparent);
          top: 50%;
          transform: rotate(calc(var(--stripe-angle) * -1));
          animation-delay: -2s;
        }

        .card-bg-stripe.stripe-3 {
          background: linear-gradient(90deg, transparent, #21544E, transparent);
          bottom: 25%;
          transform: rotate(var(--stripe-angle));
          animation-delay: -4s;
        }

        @keyframes cardBgFloat {
          0%, 100% { 
            transform: translateX(-15px) rotate(var(--stripe-angle)); 
          }
          50% { 
            transform: translateX(15px) rotate(var(--stripe-angle)); 
          }
        }

        .section-header {
          position: relative;
          z-index: 5;
          margin-bottom: 2rem;
          text-align: center;
        }

        .section-title {
          font-family: 'DM Serif Text', Times, serif;
          font-size: clamp(2rem, 4vw, 2.5rem);
          color: #2d2d2d;
          margin: 0 0 1rem 0;
          font-weight: 700;
          letter-spacing: -0.5px;
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.05);
          transition: all 0.3s ease;
        }

        .section-card.section-visible:hover .section-title {
          color: var(--section-color);
          transform: translateY(-2px);
        }

        .title-underline {
          width: 0;
          height: 3px;
          background: linear-gradient(90deg, var(--section-color), #e6b800);
          margin: 0 auto;
          border-radius: 2px;
          transition: all 0.6s cubic-bezier(0.4, 0.0, 0.2, 1);
        }

        .section-card.section-visible:hover .title-underline {
          width: 100px;
          box-shadow: 0 0 15px rgba(0, 0, 0, 0.2);
        }

        .section-content {
          position: relative;
          z-index: 5;
        }

        .section-text {
          font-family: 'Segoe UI', 'Inter', -apple-system, sans-serif;
          font-size: clamp(1rem, 2.2vw, 1.2rem);
          color: #444;
          line-height: 1.7;
          margin: 0;
          font-weight: 400;
          transition: all 0.3s ease;
          text-align: center;
        }

        .section-card.section-visible:hover .section-text {
          color: #222;
        }

        .diagonal-accent {
          position: absolute;
          top: 0;
          right: 0;
          width: 120px;
          height: 120px;
          background: linear-gradient(135deg, var(--section-color), transparent);
          transform: rotate(var(--stripe-angle)) translateX(60px) translateY(-60px);
          border-radius: 20px;
          opacity: 0;
          transition: all 0.5s ease;
          z-index: 2;
        }

        .section-card.section-visible:hover .diagonal-accent {
          opacity: 0.1;
          transform: rotate(var(--stripe-angle)) translateX(40px) translateY(-40px);
        }

        .hover-glow {
          position: absolute;
          inset: -4px;
          background: linear-gradient(135deg, var(--section-color), transparent, var(--section-color));
          border-radius: 2.2rem;
          opacity: 0;
          transition: all 0.4s ease;
          filter: blur(20px);
          z-index: -1;
        }

        .section-card.section-visible:hover .hover-glow {
          opacity: 0.3;
          animation: glowPulse 2s ease-in-out infinite;
        }

        @keyframes glowPulse {
          0%, 100% { transform: scale(1); opacity: 0.3; }
          50% { transform: scale(1.05); opacity: 0.5; }
        }

        .interactive-stripes {
          position: absolute;
          inset: 0;
          overflow: hidden;
          border-radius: 2rem;
          opacity: 0;
          transition: all 0.4s ease;
        }

        .section-card.section-visible:hover .interactive-stripes {
          opacity: 1;
        }

        .interactive-stripe {
          position: absolute;
          width: 200%;
          height: 2px;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.6), transparent);
          left: -50%;
          animation: interactiveStripeSlide 3s ease-in-out infinite;
        }

        .interactive-stripe.stripe-i-1 {
          top: 20%;
          transform: rotate(var(--stripe-angle));
          animation-delay: 0s;
        }

        .interactive-stripe.stripe-i-2 {
          top: 50%;
          transform: rotate(calc(var(--stripe-angle) * -1));
          animation-delay: -1s;
        }

        .interactive-stripe.stripe-i-3 {
          bottom: 20%;
          transform: rotate(var(--stripe-angle));
          animation-delay: -2s;
        }

        @keyframes interactiveStripeSlide {
          0%, 100% { 
            transform: translateX(-30px) rotate(var(--stripe-angle)); 
          }
          50% { 
            transform: translateX(30px) rotate(var(--stripe-angle)); 
          }
        }

        /* Mobile Responsiveness */
        @media (max-width: 768px) {
          .about-us-container {
            padding: 3rem 1rem;
          }

          .content-wrapper {
            gap: 2rem;
          }

          .impact-section {
            padding: 1.5rem;
            border-radius: 1.5rem;
          }

          .impact-grid {
            grid-template-columns: 1fr;
          }

          .section-card {
            padding: 2rem;
            border-radius: 1.5rem;
          }

          .section-header {
            margin-bottom: 1.5rem;
          }

          .diagonal-accent {
            width: 80px;
            height: 80px;
            transform: rotate(var(--stripe-angle)) translateX(40px) translateY(-40px);
          }

          .section-card.section-visible:hover .diagonal-accent {
            transform: rotate(var(--stripe-angle)) translateX(20px) translateY(-20px);
          }
        }

        @media (max-width: 480px) {
          .about-us-container {
            padding: 2rem 0.5rem;
          }

          .section-card {
            padding: 1.5rem;
            border-radius: 1.2rem;
          }

          .section-header {
            margin-bottom: 1rem;
          }

          .bg-stripe {
            height: 6vh;
          }
        }
      `}</style>
    </div>
  );
};

export default AboutUs;