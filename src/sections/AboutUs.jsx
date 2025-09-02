import React, { useState, useEffect } from 'react';

const AboutUs = () => {
  const [hoveredSection, setHoveredSection] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

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
        className={`section-card ${hoveredSection === index ? 'hovered' : ''} ${sectionVisible ? 'section-visible' : ''}`}
        onMouseEnter={() => setHoveredSection(index)}
        onMouseLeave={() => setHoveredSection(null)}
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
        {sections.map((section, index) => (
          <SectionCard 
            key={section.id}
            section={section}
            index={index}
          />
        ))}
      </div>

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

        .section-card {
          position: relative;
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(12px);
          border-radius: 2rem;
          padding: 3rem;
          overflow: hidden;
          border: 1px solid rgba(255, 255, 255, 0.3);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
          transition: all 0.8s cubic-bezier(0.25, 0.25, 0.25, 1);
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

        .section-card.hovered {
          transform: translateY(-8px) scale(1.02);
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
          background: rgba(255, 255, 255, 0.95);
          border: 1px solid rgba(0, 0, 0, 0.1);
        }

        .section-card.section-visible.hovered {
          transform: translateY(-8px) scale(1.02);
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

        .section-card.hovered .section-title {
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

        .section-card.hovered .title-underline {
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

        .section-card.hovered .section-text {
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

        .section-card.hovered .diagonal-accent {
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

        .section-card.hovered .hover-glow {
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

        .section-card.hovered .interactive-stripes {
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

          .section-card.hovered .diagonal-accent {
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