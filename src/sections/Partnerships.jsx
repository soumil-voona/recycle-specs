import React, { useState, useEffect } from 'react';

const PartnerCard = ({
  logo,
  name,
  description,
  website,
  color = '#c65d07',
  stripeAngle = '45deg',
  index = 0
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  
  const ref = React.useRef(null);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setTimeout(() => {
            setIsVisible(true);
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
  }, [index, isVisible]);

  return (
    <div
      ref={ref}
      className={`partner-card ${isHovered ? 'hovered' : ''} ${isVisible ? 'visible' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        '--partner-color': color,
        '--stripe-angle': stripeAngle,
      }}
    >
      {/* Background diagonal stripes */}
      <div className="partner-bg-stripes">
        <div className="partner-bg-stripe stripe-bg-1"></div>
        <div className="partner-bg-stripe stripe-bg-2"></div>
        <div className="partner-bg-stripe stripe-bg-3"></div>
      </div>

      {/* Logo Container */}
      <div className="logo-container">
        <div className="logo-frame">
          {!imageError ? (
            <img
              src={logo}
              alt={`${name} logo`}
              className="partner-logo"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="logo-placeholder">
              <div className="placeholder-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                  <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
          )}
          
          {/* Animated border stripes */}
          <div className="logo-border-stripes">
            <div className="border-stripe stripe-1"></div>
            <div className="border-stripe stripe-2"></div>
            <div className="border-stripe stripe-3"></div>
          </div>
        </div>
        <div className="logo-glow"></div>
      </div>

      {/* Partner Content */}
      <div className="partner-content">
        <div className="name-section">
          <h3 className="partner-name">{name}</h3>
          <div className="name-underline"></div>
        </div>
        
        <div className="description-section">
          <p className="partner-description">{description}</p>
        </div>

        {website && (
          <div className="website-section">
            <a 
              href={website} 
              target="_blank" 
              rel="noopener noreferrer"
              className="website-link"
              onClick={(e) => e.stopPropagation()}
            >
              <span>Visit Website</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </a>
          </div>
        )}
      </div>

      {/* Interactive stripes */}
      <div className="interactive-stripes">
        <div className="interactive-stripe stripe-i-1"></div>
        <div className="interactive-stripe stripe-i-2"></div>
      </div>

      {/* Hover overlay */}
      <div className="hover-overlay"></div>

      <style jsx>{`
        .partner-card {
          position: relative;
          width: 100%;
          max-width: 400px;
          height: auto;
          min-height: 350px;
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(12px);
          border-radius: 24px;
          padding: 2.5rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          overflow: hidden;
          border: 1px solid rgba(255, 255, 255, 0.3);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
          cursor: pointer;
          
          /* Initial state - hidden */
          opacity: 0;
          transform: translateY(50px) scale(0.9);
          filter: blur(8px);
          transition: all 0.8s cubic-bezier(0.25, 0.25, 0.25, 1);
        }

        .partner-card.visible {
          opacity: 1;
          transform: translateY(0) scale(1);
          filter: blur(0px);
        }

        .partner-card.hovered {
          transform: translateY(-12px) scale(1.03);
          box-shadow: 0 24px 80px rgba(0, 0, 0, 0.2);
          background: rgba(255, 255, 255, 0.95);
          border: 1px solid var(--partner-color);
        }

        .partner-card.visible.hovered {
          transform: translateY(-12px) scale(1.03);
        }

        .partner-bg-stripes {
          position: absolute;
          inset: 0;
          overflow: hidden;
          z-index: 1;
          opacity: 0.06;
        }

        .partner-bg-stripe {
          position: absolute;
          width: 200%;
          height: 4px;
          left: -50%;
          animation: partnerBgFloat 10s ease-in-out infinite;
        }

        .stripe-bg-1 {
          background: linear-gradient(90deg, transparent, var(--partner-color), transparent);
          top: 20%;
          transform: rotate(var(--stripe-angle));
          animation-delay: 0s;
        }

        .stripe-bg-2 {
          background: linear-gradient(90deg, transparent, #e6b800, transparent);
          top: 50%;
          transform: rotate(calc(var(--stripe-angle) * -1));
          animation-delay: -3s;
        }

        .stripe-bg-3 {
          background: linear-gradient(90deg, transparent, #2d7d7d, transparent);
          bottom: 20%;
          transform: rotate(var(--stripe-angle));
          animation-delay: -6s;
        }

        @keyframes partnerBgFloat {
          0%, 100% { transform: translateX(-20px) rotate(var(--stripe-angle)); }
          50% { transform: translateX(20px) rotate(var(--stripe-angle)); }
        }

        .logo-container {
          position: relative;
          margin-bottom: 2rem;
          z-index: 5;
          opacity: 0;
          transform: scale(0.8);
          transition: all 0.6s ease;
          transition-delay: 0.3s;
        }

        .partner-card.visible .logo-container {
          opacity: 1;
          transform: scale(1);
        }

        .logo-frame {
          position: relative;
          width: 140px;
          height: 140px;
          border-radius: 20px;
          overflow: hidden;
          transition: all 0.4s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .partner-card.hovered .logo-frame {
          transform: scale(1.08) rotate(2deg);
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.2);
          background: linear-gradient(135deg, var(--partner-color), rgba(255, 255, 255, 0.4));
        }

        .partner-logo {
          width: 100%;
          height: 100%;
          object-fit: contain;
          transition: all 0.4s ease;
          filter: brightness(1.1) contrast(1.1);
        }

        .logo-placeholder {
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, #f8f9fa, #e9ecef);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #6c757d;
        }

        .placeholder-icon {
          opacity: 0.7;
        }

        .logo-border-stripes {
          position: absolute;
          inset: 0;
          border-radius: 20px;
          overflow: hidden;
          opacity: 0;
          transition: all 0.4s ease;
        }

        .partner-card.hovered .logo-border-stripes {
          opacity: 0.3;
        }

        .border-stripe {
          position: absolute;
          width: 200%;
          height: 2px;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.8), transparent);
          left: -50%;
          animation: borderStripeSlide 2s linear infinite;
        }

        .border-stripe.stripe-1 {
          top: 25%;
          animation-delay: 0s;
        }

        .border-stripe.stripe-2 {
          top: 50%;
          animation-delay: -0.7s;
        }

        .border-stripe.stripe-3 {
          bottom: 25%;
          animation-delay: -1.3s;
        }

        @keyframes borderStripeSlide {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }

        .logo-glow {
          position: absolute;
          inset: -8px;
          background: linear-gradient(135deg, var(--partner-color), transparent, var(--partner-color));
          border-radius: 28px;
          opacity: 0;
          transition: all 0.4s ease;
          filter: blur(16px);
          z-index: -1;
        }

        .partner-card.hovered .logo-glow {
          opacity: 0.4;
          animation: logoGlowPulse 2s ease-in-out infinite;
        }

        @keyframes logoGlowPulse {
          0%, 100% { transform: scale(1); opacity: 0.4; }
          50% { transform: scale(1.1); opacity: 0.6; }
        }

        .partner-content {
          position: relative;
          z-index: 5;
          width: 100%;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          opacity: 0;
          transform: translateY(20px);
          transition: all 0.7s ease;
          transition-delay: 0.5s;
        }

        .partner-card.visible .partner-content {
          opacity: 1;
          transform: translateY(0);
        }

        .name-section {
          position: relative;
          margin-bottom: 1.5rem;
        }

        .partner-name {
          font-family: 'DM Serif Text', 'Inter', 'SF Pro Display', -apple-system, sans-serif;
          font-weight: 700;
          font-size: 1.6rem;
          color: #2d2d2d;
          margin: 0;
          letter-spacing: -0.5px;
          transition: all 0.3s ease;
        }

        .partner-card.hovered .partner-name {
          color: var(--partner-color);
          transform: translateY(-2px);
        }

        .name-underline {
          width: 0;
          height: 3px;
          background: linear-gradient(90deg, var(--partner-color), #e6b800);
          margin: 0.5rem auto;
          border-radius: 2px;
          transition: all 0.4s ease;
        }

        .partner-card.hovered .name-underline {
          width: 100px;
          box-shadow: 0 0 15px rgba(0, 0, 0, 0.2);
        }

        .description-section {
          position: relative;
          margin-bottom: 1.5rem;
        }

        .partner-description {
          font-family: 'Segoe UI', 'Inter', -apple-system, sans-serif;
          font-size: 0.95rem;
          line-height: 1.6;
          color: #555;
          margin: 0;
          transition: all 0.3s ease;
          opacity: 0.9;
        }

        .partner-card.hovered .partner-description {
          color: #333;
          opacity: 1;
        }

        .website-section {
          margin-top: auto;
        }

        .website-link {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.5rem;
          background: linear-gradient(135deg, var(--partner-color), #e6b800);
          color: white;
          text-decoration: none;
          border-radius: 12px;
          font-family: 'Inter', 'SF Pro Display', -apple-system, sans-serif;
          font-weight: 600;
          font-size: 0.9rem;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .website-link:hover {
          transform: translateY(-2px) scale(1.05);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
          background: linear-gradient(135deg, #e67309, #ffcc00);
        }

        .website-link svg {
          transition: transform 0.3s ease;
        }

        .website-link:hover svg {
          transform: translate(2px, -2px);
        }

        .interactive-stripes {
          position: absolute;
          inset: 0;
          overflow: hidden;
          border-radius: 24px;
          opacity: 0;
          transition: all 0.4s ease;
        }

        .partner-card.hovered .interactive-stripes {
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
          top: 30%;
          transform: rotate(var(--stripe-angle));
          animation-delay: 0s;
        }

        .interactive-stripe.stripe-i-2 {
          bottom: 30%;
          transform: rotate(calc(var(--stripe-angle) * -1));
          animation-delay: -1.5s;
        }

        @keyframes interactiveStripeSlide {
          0%, 100% { 
            transform: translateX(-30px) rotate(var(--stripe-angle)); 
          }
          50% { 
            transform: translateX(30px) rotate(var(--stripe-angle)); 
          }
        }

        .hover-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.1), transparent);
          border-radius: 24px;
          opacity: 0;
          transition: all 0.4s ease;
          z-index: 10;
          pointer-events: none;
        }

        .partner-card.hovered .hover-overlay {
          opacity: 1;
        }

        /* Mobile Responsiveness */
        @media (max-width: 768px) {
          .partner-card {
            max-width: 320px;
            min-height: 320px;
            padding: 2rem;
          }

          .logo-frame {
            width: 120px;
            height: 120px;
          }

          .partner-name {
            font-size: 1.4rem;
          }

          .partner-description {
            font-size: 0.9rem;
          }
        }

        @media (max-width: 480px) {
          .partner-card {
            max-width: 280px;
            min-height: 300px;
            padding: 1.5rem;
          }

          .logo-frame {
            width: 100px;
            height: 100px;
          }

          .partner-name {
            font-size: 1.3rem;
          }

          .partner-description {
            font-size: 0.85rem;
          }
        }
      `}</style>
    </div>
  );
};

const Partnerships = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [headerVisible, setHeaderVisible] = useState(false);
  const headerRef = React.useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHeaderVisible(true);
        }
      },
      { threshold: 0.5 }
    );

    if (headerRef.current) {
      observer.observe(headerRef.current);
    }

    return () => {
      if (headerRef.current) {
        observer.unobserve(headerRef.current);
      }
    };
  }, []);

  // Example partnerships - replace with your actual data
  const partnerships = [
    {
      logo: "/imgs/partnership_sankara-eye-care.png",
      name: "Sankara Eye Care Institutions",
      description: "An organization aiming to treat preventable and treatable blindness",
      website: "https://sankaraeye.com",
      color: "#2d7d7d",
      stripeAngle: "45deg"
    },
    {
      logo: "/imgs/partnership_rotary-international.png",
      name: "Rotary Club of Guntur",
      description: "A branch of Rotary International, the second-largest service club organization in the world",
      website: "https://www.rotary.org/en",
      color: "#924014",
      stripeAngle: "-45deg"
    }
  ];

  return (
    <div className={`partnerships-container ${isVisible ? 'visible' : ''}`}>
      {/* Background diagonal stripes */}
      <div className="bg-decoration">
        <div className="bg-stripe bg-stripe-1"></div>
        <div className="bg-stripe bg-stripe-2"></div>
        <div className="bg-stripe bg-stripe-3"></div>
        <div className="bg-stripe bg-stripe-4"></div>
        <div className="bg-stripe bg-stripe-5"></div>
      </div>

      <div 
        ref={headerRef}
        className={`partnerships-header ${headerVisible ? 'header-visible' : ''}`}
      >
        <h2 className="section-title" style={{fontSize: 'clamp(3rem, 8vw, 6rem)'}}>Our Partnerships</h2>
        <p className="section-subtitle">
          Collaborating with amazing organizations to amplify our impact and reach more communities in need
        </p>
        <div className="header-underline"></div>
      </div>

      <div className="partnerships-grid">
        {partnerships.map((partner, index) => (
          <PartnerCard
            key={index}
            logo={partner.logo}
            name={partner.name}
            description={partner.description}
            website={partner.website}
            color={partner.color}
            stripeAngle={partner.stripeAngle}
            index={index}
          />
        ))}
      </div>

      <style jsx>{`
        .partnerships-container {
          position: relative;
          padding: 0rem 2rem;
          max-width: 1400px;
          margin: 0 auto;
          overflow: hidden;
          opacity: 0;
          transform: translateY(50px);
          transition: all 0.8s cubic-bezier(0.4, 0.0, 0.2, 1);
        }

        .partnerships-container.visible {
          opacity: 1;
          transform: translateY(0);
        }

        .bg-decoration {
          position: absolute;
          inset: 0;
          overflow: hidden;
          z-index: 1;
          opacity: 0.1;
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
          top: 10%;
          transform: rotate(-15deg);
          animation-delay: 0s;
        }

        .bg-stripe-2 {
          background: linear-gradient(45deg, #924014, transparent);
          top: 25%;
          transform: rotate(15deg);
          animation-delay: -2s;
        }

        .bg-stripe-3 {
          background: linear-gradient(45deg, #EAC19E, transparent);
          top: 40%;
          transform: rotate(-15deg);
          animation-delay: -4s;
        }

        .bg-stripe-4 {
          background: linear-gradient(45deg, #DA9F1A, transparent);
          top: 55%;
          transform: rotate(15deg);
          animation-delay: -6s;
        }

        .bg-stripe-5 {
          background: linear-gradient(45deg, #21544E, transparent);
          top: 70%;
          transform: rotate(-15deg);
          animation-delay: -8s;
        }

        @keyframes bgFloat {
          0%, 100% { 
            transform: translateX(-20px) rotate(-15deg); 
            opacity: 0.05; 
          }
          50% { 
            transform: translateX(20px) rotate(-15deg); 
            opacity: 0.15; 
          }
        }

        .partnerships-header {
          position: relative;
          z-index: 10;
          text-align: center;
          margin-bottom: 4rem;
          opacity: 0;
          transform: translateY(-30px);
          filter: blur(6px);
          transition: all 1s cubic-bezier(0.25, 0.25, 0.25, 1);
        }

        .partnerships-header.header-visible {
          opacity: 1;
          transform: translateY(0);
          filter: blur(0px);
        }

        .section-title {
          font-family: 'DM Serif Text', Times, serif;
          color: #2d2d2d;
          margin: 0 0 1rem 0;
          font-weight: 700;
          letter-spacing: -0.5px;
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.05);
        }

        .section-subtitle {
          font-family: 'Segoe UI', 'Inter', -apple-system, sans-serif;
          font-size: clamp(1rem, 2.2vw, 1.2rem);
          color: #666;
          max-width: 800px;
          margin: 0 auto 2rem auto;
          line-height: 1.6;
          opacity: 0;
          transition: opacity 0.8s ease 0.3s;
        }

        .partnerships-header.header-visible .section-subtitle {
          opacity: 1;
        }

        .header-underline {
          width: 0;
          height: 4px;
          background: linear-gradient(90deg, #c65d07, #e6b800, #2d7d7d);
          margin: 0 auto;
          border-radius: 2px;
          transition: width 1s ease 0.6s;
        }

        .partnerships-header.header-visible .header-underline {
          width: 120px;
        }

        .partnerships-grid {
          position: relative;
          z-index: 10;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(380px, 1fr));
          gap: 3rem;
          justify-items: center;
          max-width: 1400px;
          margin: 0 auto;
        }

        /* Breakpoint adjustments to prevent overlap */
        @media (min-width: 1024px) {
          .partnerships-grid {
            grid-template-columns: repeat(auto-fit, minmax(420px, 1fr));
            gap: 4rem;
          }
        }

        @media (max-width: 1023px) {
          .partnerships-grid {
            grid-template-columns: 1fr;
            gap: 3rem;
            max-width: 420px;
          }
        }

        @media (max-width: 768px) {
          .partnerships-container {
            padding: 3rem 1rem;
          }

          .partnerships-header {
            margin-bottom: 3rem;
          }

          .partnerships-grid {
            max-width: 380px;
            gap: 2rem;
          }
        }

        @media (max-width: 480px) {
          .partnerships-container {
            padding: 2rem 0.5rem;
          }

          .partnerships-grid {
            max-width: 300px;
            gap: 1.5rem;
          }

          .bg-stripe {
            height: 6vh;
          }
        }
      `}</style>
    </div>
  );
};

export default Partnerships;