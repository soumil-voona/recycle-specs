import React, { useState, useEffect, useRef } from 'react';

const EventCard = ({
  image,
  title,
  date,
  location,
  description,
  impact,
  color = '#c65d07',
  stripeAngle = '45deg',
  index = 0
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  
  const ref = useRef(null);

  useEffect(() => {
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
      className={`event-card ${isHovered ? 'hovered' : ''} ${isVisible ? 'visible' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        '--event-color': color,
        '--stripe-angle': stripeAngle,
      }}
    >
      {/* Background diagonal stripes */}
      <div className="event-bg-stripes">
        <div className="event-bg-stripe stripe-bg-1"></div>
        <div className="event-bg-stripe stripe-bg-2"></div>
        <div className="event-bg-stripe stripe-bg-3"></div>
      </div>

      {/* Event Image Container */}
      <div className="image-container">
        <div className="image-frame-events">
          {!imageError ? (
            <img
              src={image}
              alt={`${title} event`}
              className="event-image"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="image-placeholder">
              <div className="placeholder-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke="currentColor" strokeWidth="2"/>
                  <circle cx="8.5" cy="8.5" r="1.5" stroke="currentColor" strokeWidth="2"/>
                  <path d="M21 15l-5-5L5 21" stroke="currentColor" strokeWidth="2"/>
                </svg>
              </div>
            </div>
          )}
          
          {/* Animated border stripes */}
          <div className="image-border-stripes">
            <div className="border-stripe stripe-1"></div>
            <div className="border-stripe stripe-2"></div>
            <div className="border-stripe stripe-3"></div>
          </div>
        </div>
        <div className="image-glow"></div>
      </div>

      {/* Event Content */}
      <div className="event-content">
        <div className="title-section">
          <h3 className="event-title">{title}</h3>
          <div className="title-underline"></div>
        </div>
        
        <div className="meta-section">
          <div className="meta-item">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke="currentColor" strokeWidth="2"/>
              <line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" strokeWidth="2"/>
              <line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" strokeWidth="2"/>
              <line x1="3" y1="10" x2="21" y2="10" stroke="currentColor" strokeWidth="2"/>
            </svg>
            <span className="meta-date">{date}</span>
          </div>
          
          <div className="meta-item">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" stroke="currentColor" strokeWidth="2"/>
              <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="2"/>
            </svg>
            <span className="meta-location">{location}</span>
          </div>
        </div>
        
        <div className="description-section">
          <p className="event-description">{description}</p>
        </div>

        {impact && (
          <div className="impact-section">
            <div className="impact-label">Impact:</div>
            <div className="impact-text">{impact}</div>
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
        .event-card {
          position: relative;
          width: 100%;
          max-width: 400px;
          height: auto;
          min-height: 450px;
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(12px);
          border-radius: 24px;
          padding: 2rem;
          display: flex;
          flex-direction: column;
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

        .event-card.visible {
          opacity: 1;
          transform: translateY(0) scale(1);
          filter: blur(0px);
        }

        .event-card.hovered {
          transform: translateY(-12px) scale(1.03);
          box-shadow: 0 24px 80px rgba(0, 0, 0, 0.2);
          background: rgba(255, 255, 255, 0.95);
          border: 1px solid var(--event-color);
        }

        .event-card.visible.hovered {
          transform: translateY(-12px) scale(1.03);
        }

        .event-bg-stripes {
          position: absolute;
          inset: 0;
          overflow: hidden;
          z-index: 1;
          opacity: 0.06;
        }

        .event-bg-stripe {
          position: absolute;
          width: 200%;
          height: 4px;
          left: -50%;
          animation: eventBgFloat 10s ease-in-out infinite;
        }

        .stripe-bg-1 {
          background: linear-gradient(90deg, transparent, var(--event-color), transparent);
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

        @keyframes eventBgFloat {
          0%, 100% { transform: translateX(-20px) rotate(var(--stripe-angle)); }
          50% { transform: translateX(20px) rotate(var(--stripe-angle)); }
        }

        .image-container {
          position: relative;
          margin-bottom: 1.5rem;
          z-index: 5;
          opacity: 0;
          transform: scale(0.8);
          transition: all 0.6s ease;
          transition-delay: 0.3s;
        }

        .event-card.visible .image-container {
          opacity: 1;
          transform: scale(1);
        }

        .image-frame-events {
          position: relative;
          width: 100%;
          height: 200px;
          border-radius: 16px;
          overflow: hidden;
          transition: all 0.4s ease;
        }

        .event-card.hovered .image-frame-events {
          transform: scale(1.05);
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.2);
        }

        .event-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: all 0.4s ease;
          filter: brightness(1.1) contrast(1.05);
        }

        .event-card.hovered .event-image {
          filter: brightness(1.2) contrast(1.1) saturate(1.1);
        }

        .image-placeholder {
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, #f8f9fa, #e9ecef);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #6c757d;
        }

        .placeholder-icon {
          opacity: 0.7;
        }

        .image-border-stripes {
          position: absolute;
          inset: 0;
          border-radius: 16px;
          overflow: hidden;
          opacity: 0;
          transition: all 0.4s ease;
        }

        .event-card.hovered .image-border-stripes {
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
          top: 20%;
          animation-delay: 0s;
        }

        .border-stripe.stripe-2 {
          top: 50%;
          animation-delay: -0.7s;
        }

        .border-stripe.stripe-3 {
          bottom: 20%;
          animation-delay: -1.3s;
        }

        @keyframes borderStripeSlide {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }

        .image-glow {
          position: absolute;
          inset: -8px;
          background: linear-gradient(135deg, var(--event-color), transparent, var(--event-color));
          border-radius: 24px;
          opacity: 0;
          transition: all 0.4s ease;
          filter: blur(16px);
          z-index: -1;
        }

        .event-card.hovered .image-glow {
          opacity: 0.4;
          animation: imageGlowPulse 2s ease-in-out infinite;
        }

        @keyframes imageGlowPulse {
          0%, 100% { transform: scale(1); opacity: 0.4; }
          50% { transform: scale(1.1); opacity: 0.6; }
        }

        .event-content {
          position: relative;
          z-index: 5;
          flex: 1;
          display: flex;
          flex-direction: column;
          opacity: 0;
          transform: translateY(20px);
          transition: all 0.7s ease;
          transition-delay: 0.5s;
        }

        .event-card.visible .event-content {
          opacity: 1;
          transform: translateY(0);
        }

        .title-section {
          position: relative;
          margin-bottom: 1rem;
        }

        .event-title {
          font-family: 'DM Serif Text', 'Inter', 'SF Pro Display', -apple-system, sans-serif;
          font-weight: 700;
          font-size: 1.4rem;
          color: #2d2d2d;
          margin: 0;
          letter-spacing: -0.5px;
          transition: all 0.3s ease;
          line-height: 1.3;
        }

        .event-card.hovered .event-title {
          color: var(--event-color);
          transform: translateY(-2px);
        }

        .title-underline {
          width: 0;
          height: 2px;
          background: linear-gradient(90deg, var(--event-color), #e6b800);
          margin: 0.5rem 0;
          border-radius: 1px;
          transition: all 0.4s ease;
        }

        .event-card.hovered .title-underline {
          width: 60px;
        }

        .meta-section {
          margin-bottom: 1rem;
        }

        .meta-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 0.5rem;
          color: #666;
          font-size: 0.9rem;
          transition: all 0.3s ease;
        }

        .meta-item svg {
          stroke: var(--event-color);
          transition: all 0.3s ease;
        }

        .event-card.hovered .meta-item {
          color: #555;
        }

        .event-card.hovered .meta-item svg {
          stroke: var(--event-color);
        }

        .meta-date, .meta-location {
          font-family: 'Inter', 'SF Pro Display', -apple-system, sans-serif;
          font-weight: 500;
        }

        .description-section {
          margin-bottom: 1rem;
          flex: 1;
        }

        .event-description {
          font-family: 'Segoe UI', 'Inter', -apple-system, sans-serif;
          font-size: 0.9rem;
          line-height: 1.6;
          color: #555;
          margin: 0;
          transition: all 0.3s ease;
        }

        .event-card.hovered .event-description {
          color: #333;
        }

        .impact-section {
          margin-top: auto;
          padding: 1rem;
          background: linear-gradient(135deg, rgba(0, 0, 0, 0.03), rgba(0, 0, 0, 0.01));
          border-radius: 12px;
          border-left: 3px solid var(--event-color);
        }

        .impact-label {
          font-family: 'Inter', 'SF Pro Display', -apple-system, sans-serif;
          font-weight: 700;
          font-size: 0.8rem;
          color: var(--event-color);
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 0.5rem;
        }

        .impact-text {
          font-family: 'Segoe UI', 'Inter', -apple-system, sans-serif;
          font-size: 0.9rem;
          color: #444;
          font-weight: 600;
        }

        .interactive-stripes {
          position: absolute;
          inset: 0;
          overflow: hidden;
          border-radius: 24px;
          opacity: 0;
          transition: all 0.4s ease;
        }

        .event-card.hovered .interactive-stripes {
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

        .event-card.hovered .hover-overlay {
          opacity: 1;
        }

        /* Mobile Responsiveness */
        @media (max-width: 768px) {
          .event-card {
            max-width: 350px;
            min-height: 400px;
            padding: 1.5rem;
          }

          .image-frame-events {
            height: 160px;
          }

          .event-title {
            font-size: 1.3rem;
          }

          .event-description {
            font-size: 0.85rem;
          }
        }

        @media (max-width: 480px) {
          .event-card {
            max-width: 300px;
            min-height: 380px;
            padding: 1.2rem;
          }

          .image-frame-events {
            height: 140px;
          }

          .event-title {
            font-size: 1.2rem;
          }
        }
      `}</style>
    </div>
  );
};

const ImageCarousel = ({ images, currentIndex, onIndexChange }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [translateX, setTranslateX] = useState(0);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.clientX);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const diff = e.clientX - startX;
    setTranslateX(diff);
  };

  const handleMouseUp = () => {
    if (!isDragging) return;
    
    const threshold = 100;
    if (translateX > threshold && currentIndex > 0) {
      onIndexChange(currentIndex - 1);
    } else if (translateX < -threshold && currentIndex < images.length - 1) {
      onIndexChange(currentIndex + 1);
    }
    
    setIsDragging(false);
    setTranslateX(0);
  };

  return (
    <div className="carousel-container">
      <div className="carousel-wrapper">
        <div
          className="carousel-track"
          style={{
            transform: `translateX(calc(-${currentIndex * 100}% + ${isDragging ? translateX : 0}px))`
          }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          {images.map((image, index) => (
            <div key={index} className="carousel-slide">
              <img src={image} alt={`Event ${index + 1}`} className="carousel-image" />
            </div>
          ))}
        </div>
      </div>

      {/* Navigation dots */}
      <div className="carousel-dots">
        {images.map((_, index) => (
          <button
            key={index}
            className={`dot ${index === currentIndex ? 'active' : ''}`}
            onClick={() => onIndexChange(index)}
          />
        ))}
      </div>

      {/* Navigation arrows */}
      <button
        className="carousel-nav prev"
        onClick={() => onIndexChange(Math.max(0, currentIndex - 1))}
        disabled={currentIndex === 0}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      <button
        className="carousel-nav next"
        onClick={() => onIndexChange(Math.min(images.length - 1, currentIndex + 1))}
        disabled={currentIndex === images.length - 1}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      <style jsx>{`
        .carousel-container {
          position: relative;
          width: 100%;
          max-width: 600px;
          margin: 0 auto 3rem auto;
        }

        .carousel-wrapper {
          position: relative;
          width: 100%;
          height: 300px;
          overflow: hidden;
          border-radius: 20px;
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
        }

        .carousel-track {
          display: flex;
          width: 100%;
          height: 100%;
          transition: transform 0.5s cubic-bezier(0.4, 0.0, 0.2, 1);
          cursor: grab;
        }

        .carousel-track:active {
          cursor: grabbing;
        }

        .carousel-slide {
          flex: 0 0 100%;
          height: 100%;
        }

        .carousel-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          user-select: none;
          pointer-events: none;
        }

        .carousel-dots {
          display: flex;
          justify-content: center;
          gap: 0.5rem;
          margin-top: 1rem;
        }

        .dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          border: none;
          background: rgba(0, 0, 0, 0.3);
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .dot:hover {
          background: rgba(0, 0, 0, 0.5);
          transform: scale(1.2);
        }

        .dot.active {
          background: #c65d07;
          transform: scale(1.3);
        }

        .carousel-nav {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 48px;
          height: 48px;
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(12px);
          border: none;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
          z-index: 10;
        }

        .carousel-nav:hover:not(:disabled) {
          background: rgba(255, 255, 255, 0.95);
          transform: translateY(-50%) scale(1.1);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
        }

        .carousel-nav:disabled {
          opacity: 0.3;
          cursor: not-allowed;
        }

        .carousel-nav svg {
          color: #333;
        }

        .prev {
          left: 1rem;
        }

        .next {
          right: 1rem;
        }

        @media (max-width: 768px) {
          .carousel-wrapper {
            height: 250px;
          }

          .carousel-nav {
            width: 40px;
            height: 40px;
          }

          .prev {
            left: 0.5rem;
          }

          .next {
            right: 0.5rem;
          }
        }
      `}</style>
    </div>
  );
};

const PastEvents = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [headerVisible, setHeaderVisible] = useState(false);
  const [currentCarouselIndex, setCurrentCarouselIndex] = useState(0);
  const headerRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
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

  const pastEvents = [
    {
      image: "/imgs/event1.png",
      title: "Community Children Eye Screening Drive in Guntur, India",
      date: "July, 2025",
      location: "Zilla Parishad High School, Guntur, India",
      description: "We successfully screened 385 students at Zilla Parishad High School, Guntur, and identified 109 who needed further care. Huge thanks to Vidhisha Paleti, our CEO for leading the effort, Sankara Eye Hospitals for conducting the screenings, the Rotary Club of Guntur for organizing, and the students for their cooperation. Grateful to everyone who made this possible! ",
      impact: "385 children screened, 40 glasses distributed",
      color: "#2d7d7d",
      stripeAngle: "45deg"
    },
    {
      image: "/imgs/event2.png",
      title: "Community Senior Citizens Eye Screening Drive in Guntur, India",
      date: "July, 2025",
      location: "Sankara Eye Hospital, Pedakkani, Guntur, India",
      description: "We screened 210 senior citizens, and assessed all needing cataract surgery helping hundreds get the care they need. Huge thanks to Vidhisha Paleti for leading on the ground, Sankara Eye Hospitals for providing full support, and the Rotary Club of Guntur for organizing. Grateful to all who made this possible!",
      impact: "210 senior citizens screened, 120 cataract surgeries scheduled",
      color: "#c65d07",
      stripeAngle: "-45deg"
    },
  ];

  // Example carousel images
  const carouselImages = [
    "/imgs/events/pic1.png",
    "/imgs/events/pic2.png",
    "/imgs/events/pic3.png",
    "/imgs/events/pic4.png",
    "/imgs/events/pic5.png",
    "/imgs/events/pic6.png",
    "/imgs/events/pic7.png",
    "/imgs/events/pic8.png",
    "/imgs/events/pic9.png",
    "/imgs/events/pic10.png",
    "/imgs/events/pic11.png",
    "/imgs/events/pic12.png",
    "/imgs/events/pic13.png",
    "/imgs/events/pic14.png",
    "/imgs/events/pic15.png",
    "/imgs/events/pic16.png",
    "/imgs/events/pic17.png",
    "/imgs/events/pic18.png",
    
  ];

  return (
    <div className={`past-events-container ${isVisible ? 'visible' : ''}`}>
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
        className={`events-header ${headerVisible ? 'header-visible' : ''}`}
      >
        <h2 className="section-title" style={{fontSize: 'clamp(3rem, 8vw, 6rem)'}}>Past Events</h2>
        <p className="section-subtitle">
          Celebrating our journey and the communities we've served together
        </p>
        <div className="header-underline"></div>
      </div>

      {/* Image Carousel */}
      <ImageCarousel 
        images={carouselImages}
        currentIndex={currentCarouselIndex}
        onIndexChange={setCurrentCarouselIndex}
      />

      {/* Events Grid */}
      <div className="events-grid">
        {pastEvents.map((event, index) => (
          <EventCard
            key={index}
            image={event.image}
            title={event.title}
            date={event.date}
            location={event.location}
            description={event.description}
            impact={event.impact}
            color={event.color}
            stripeAngle={event.stripeAngle}
            index={index}
          />
        ))}
      </div>

      <style jsx>{`
        .past-events-container {
          position: relative;
          padding: 4rem 2rem;
          max-width: 1400px;
          margin: 0 auto;
          overflow: hidden;
          opacity: 0;
          transform: translateY(50px);
          transition: all 0.8s cubic-bezier(0.4, 0.0, 0.2, 1);
        }

        .past-events-container.visible {
          opacity: 1;
          transform: translateY(0);
        }

        .bg-decoration {
          position: absolute;
          inset: 0;
          overflow: hidden;
          z-index: 1;
          opacity: 0.08;
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
            opacity: 0.12; 
          }
        }

        .events-header {
          position: relative;
          z-index: 10;
          text-align: center;
          margin-bottom: 3rem;
          opacity: 0;
          transform: translateY(-30px);
          filter: blur(6px);
          transition: all 1s cubic-bezier(0.25, 0.25, 0.25, 1);
        }

        .events-header.header-visible {
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

        .events-header.header-visible .section-subtitle {
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

        .events-header.header-visible .header-underline {
          width: 120px;
        }

        .events-grid {
          position: relative;
          z-index: 10;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(380px, 1fr));
          gap: 3rem;
          justify-items: center;
          max-width: 1400px;
          margin: 0 auto;
        }

        /* Breakpoint adjustments */
        @media (min-width: 1024px) {
          .events-grid {
            grid-template-columns: repeat(auto-fit, minmax(420px, 1fr));
            gap: 4rem;
          }
        }

        @media (max-width: 1023px) {
          .events-grid {
            grid-template-columns: 1fr;
            gap: 3rem;
            max-width: 420px;
          }
        }

        @media (max-width: 768px) {
          .past-events-container {
            padding: 3rem 1rem;
          }

          .events-header {
            margin-bottom: 2rem;
          }

          .events-grid {
            max-width: 380px;
            gap: 2rem;
          }
        }

        @media (max-width: 480px) {
          .past-events-container {
            padding: 2rem 0.5rem;
          }

          .events-grid {
            max-width: 320px;
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

export default PastEvents;