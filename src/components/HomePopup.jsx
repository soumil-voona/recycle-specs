import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const IMAGES = [
  '/imgs/RecycleSpecs_ChapterOfficial/1.png',
  '/imgs/RecycleSpecs_ChapterOfficial/2.png',
  '/imgs/RecycleSpecs_ChapterOfficial/3.png',
  '/imgs/RecycleSpecs_ChapterOfficial/4.png',
  '/imgs/RecycleSpecs_ChapterOfficial/5.png',
  '/imgs/RecycleSpecs_ChapterOfficial/6.png'
];

export default function HomePopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentImgIndex, setCurrentImgIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    // Show popup once per session
    if (!sessionStorage.getItem('homePopupShown')) {
      setIsOpen(true);
      sessionStorage.setItem('homePopupShown', 'true');
    }
  }, []);

  useEffect(() => {
    if (!isOpen || isHovered) return;
    const interval = setInterval(() => {
      setCurrentImgIndex(prev => (prev + 1) % IMAGES.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [isOpen, isHovered]);

  const handlePrev = (e) => {
    e.stopPropagation();
    setCurrentImgIndex(prev => (prev - 1 + IMAGES.length) % IMAGES.length);
  };

  const handleNext = (e) => {
    e.stopPropagation();
    setCurrentImgIndex(prev => (prev + 1) % IMAGES.length);
  };

  if (!isOpen) return null;

  return (
    <div className="rs-modal-overlay">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="rs-modal-container"
      >
        {/* Close Button */}
        <button 
          className="rs-modal-close"
          onClick={() => setIsOpen(false)}
          aria-label="Close modal"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        {/* Left Column: Slideshow */}
        <div 
          className="rs-modal-slideshow"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Blurred Background Layer */}
          <div className="rs-slideshow-blur-bg">
            <AnimatePresence mode="popLayout">
              <motion.img
                key={currentImgIndex}
                src={IMAGES[currentImgIndex]}
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.4 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6 }}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                alt=""
              />
            </AnimatePresence>
          </div>

          {/* Crisp Foreground Layer (Contained) */}
          <div className="rs-slideshow-main">
            <AnimatePresence mode="popLayout">
              <motion.img
                key={currentImgIndex}
                src={IMAGES[currentImgIndex]}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.6 }}
                style={{ width: '100%', height: '100%', objectFit: 'contain', zIndex: 2 }}
                alt={`RecycleSpecs Chapter Flyer ${currentImgIndex + 1}`}
              />
            </AnimatePresence>
          </div>

          {/* Navigation Controls */}
          <button className="rs-slideshow-arrow prev" onClick={handlePrev} aria-label="Previous slide">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </button>
          
          <button className="rs-slideshow-arrow next" onClick={handleNext} aria-label="Next slide">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </button>

          {/* Progress Indicators */}
          <div className="rs-slideshow-dots">
            {IMAGES.map((_, index) => (
              <button
                key={index}
                className={`rs-slideshow-dot ${index === currentImgIndex ? 'active' : ''}`}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentImgIndex(index);
                }}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Right Column: Info & Action */}
        <div className="rs-modal-content">
          <div className="rs-content-header">
            <span className="rs-content-tag">Grow The Movement</span>
            <h2 className="rs-content-title">Start a RecycleSpecs Chapter</h2>
          </div>

          <p className="rs-content-desc">
            Make a lasting impact in your school or local community. Help us host donation drives, raise awareness, and bring optical care to those who need it most.
          </p>

          {/* Benefits Grid/List */}
          <div className="rs-benefits-list">
            <div className="rs-benefit-item">
              <div className="rs-benefit-icon-wrapper">
                🎓
              </div>
              <div className="rs-benefit-text">
                <strong>Leadership Experience</strong>
                <p>Add real-world community organizing and leadership to your student profile.</p>
              </div>
            </div>

            <div className="rs-benefit-item">
              <div className="rs-benefit-icon-wrapper">
                ⏰
              </div>
              <div className="rs-benefit-text">
                <strong>Volunteer Hours</strong>
                <p>Earn verified community service hours for your school or clubs.</p>
              </div>
            </div>

            <div className="rs-benefit-item">
              <div className="rs-benefit-icon-wrapper">
                📦
              </div>
              <div className="rs-benefit-text">
                <strong>Starter Toolkit Provided</strong>
                <p>Get a complete kit with instructions, flyers, and boxes to kickstart your chapter.</p>
              </div>
            </div>
          </div>

          {/* Action Footer */}
          <div className="rs-content-actions">
            <a 
              href="https://docs.google.com/forms/d/e/1FAIpQLSd9aEDApzvprFccS0C4DPUSffluMbAHRuKF1YGDuayXgre_hQ/viewform"
              target="_blank"
              rel="noopener noreferrer"
              className="rs-btn-apply"
            >
              <span>Apply Now</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </a>
            
            <button 
              className="rs-btn-dismiss"
              onClick={() => setIsOpen(false)}
            >
              Maybe Later
            </button>
          </div>
        </div>

        {/* Scoped CSS Styles */}
        <style>{`
          .rs-modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: rgba(28, 24, 21, 0.7);
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
            z-index: 99999;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 1.5rem;
          }

          .rs-modal-container {
            background: var(--bg-parchment, #f9f4ec);
            width: 100%;
            max-width: 950px;
            height: 580px;
            border-radius: 24px;
            overflow: hidden;
            position: relative;
            box-shadow: 0 30px 70px rgba(28, 24, 21, 0.35);
            display: flex;
            border: 1px solid rgba(255, 255, 255, 0.4);
          }

          .rs-modal-close {
            position: absolute;
            top: 1.25rem;
            right: 1.25rem;
            background: rgba(28, 24, 21, 0.05);
            border: none;
            width: 36px;
            height: 36px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            z-index: 10;
            color: var(--text-primary, #1e1a17);
            transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
          }

          .rs-modal-close:hover {
            background: var(--rs-orange, #c65d07);
            color: white;
            transform: rotate(90deg);
          }

          /* Left Slideshow Column */
          .rs-modal-slideshow {
            width: 44%;
            height: 100%;
            position: relative;
            overflow: hidden;
            background: #12100f;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .rs-slideshow-blur-bg {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            filter: blur(24px) brightness(0.55);
            transform: scale(1.15);
            pointer-events: none;
            z-index: 1;
          }

          .rs-slideshow-main {
            width: 100%;
            height: 100%;
            position: relative;
            z-index: 2;
            padding: 1.5rem;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .rs-slideshow-arrow {
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.15);
            backdrop-filter: blur(8px);
            -webkit-backdrop-filter: blur(8px);
            border: 1px solid rgba(255, 255, 255, 0.25);
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            z-index: 5;
            opacity: 0;
            transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          }

          .rs-modal-slideshow:hover .rs-slideshow-arrow {
            opacity: 1;
          }

          .rs-slideshow-arrow:hover {
            background: rgba(255, 255, 255, 0.3);
            scale: 1.08;
          }

          .rs-slideshow-arrow.prev {
            left: 1rem;
          }

          .rs-slideshow-arrow.next {
            right: 1rem;
          }

          .rs-slideshow-dots {
            position: absolute;
            bottom: 1.25rem;
            display: flex;
            gap: 0.5rem;
            z-index: 5;
          }

          .rs-slideshow-dot {
            width: 7px;
            height: 7px;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.4);
            border: none;
            padding: 0;
            cursor: pointer;
            transition: all 0.3s ease;
          }

          .rs-slideshow-dot.active {
            background: var(--rs-gold, #d4a017);
            width: 22px;
            border-radius: 4px;
          }

          /* Right Content Column */
          .rs-modal-content {
            width: 56%;
            height: 100%;
            padding: 3.5rem 3rem 3rem 3rem;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
          }

          .rs-content-header {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
          }

          .rs-content-tag {
            align-self: flex-start;
            font-family: var(--font-body), sans-serif;
            font-size: 0.72rem;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.12em;
            color: var(--rs-orange, #c65d07);
            background: rgba(198, 93, 7, 0.08);
            border: 1px solid rgba(198, 93, 7, 0.15);
            padding: 5px 12px;
            border-radius: 99px;
          }

          .rs-content-title {
            font-family: var(--font-display), serif;
            font-size: 2.1rem;
            font-weight: 700;
            color: var(--text-primary, #1e1a17);
            line-height: 1.15;
          }

          .rs-content-desc {
            font-family: var(--font-body), sans-serif;
            font-size: 0.95rem;
            color: var(--text-secondary, #5a4f47);
            line-height: 1.6;
            margin: 0.75rem 0 1.25rem 0;
          }

          /* Benefits List */
          .rs-benefits-list {
            display: flex;
            flex-direction: column;
            gap: 1.1rem;
            margin-bottom: 2rem;
          }

          .rs-benefit-item {
            display: flex;
            align-items: flex-start;
            gap: 0.85rem;
          }

          .rs-benefit-icon-wrapper {
            font-size: 1.25rem;
            display: flex;
            align-items: center;
            justify-content: center;
            width: 32px;
            height: 32px;
            background: rgba(45, 125, 125, 0.07);
            border: 1px solid rgba(45, 125, 125, 0.15);
            border-radius: 8px;
            flex-shrink: 0;
            margin-top: 1px;
          }

          .rs-benefit-text strong {
            font-family: var(--font-body), sans-serif;
            font-size: 0.92rem;
            font-weight: 600;
            color: var(--text-primary, #1e1a17);
            display: block;
            margin-bottom: 1px;
          }

          .rs-benefit-text p {
            font-family: var(--font-body), sans-serif;
            font-size: 0.82rem;
            color: var(--text-muted, #8b7d75);
            line-height: 1.4;
          }

          /* Actions Panel */
          .rs-content-actions {
            display: flex;
            align-items: center;
            gap: 1.25rem;
          }

          .rs-btn-apply {
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            background: var(--rs-teal, #2d7d7d);
            color: white;
            padding: 0.9rem 1.8rem;
            border-radius: 12px;
            font-family: var(--font-body), sans-serif;
            font-weight: 700;
            font-size: 0.95rem;
            text-decoration: none;
            box-shadow: 0 6px 20px rgba(45, 125, 125, 0.25);
            transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
            border: none;
            cursor: pointer;
          }

          .rs-btn-apply:hover {
            background: var(--rs-teal-dark, #1e5a5a);
            transform: translateY(-2px);
            box-shadow: 0 10px 25px rgba(45, 125, 125, 0.35);
            color: white;
          }

          .rs-btn-apply svg {
            transition: transform 0.25s ease;
          }

          .rs-btn-apply:hover svg {
            transform: translateX(4px);
          }

          .rs-btn-dismiss {
            font-family: var(--font-body), sans-serif;
            font-size: 0.9rem;
            font-weight: 600;
            color: var(--text-muted, #8b7d75);
            background: transparent;
            border: none;
            cursor: pointer;
            transition: color 0.2s ease;
            padding: 0.5rem 0;
            border-bottom: 1px solid transparent;
          }

          .rs-btn-dismiss:hover {
            color: var(--text-primary, #1e1a17);
            border-bottom-color: var(--text-primary, #1e1a17);
          }

          /* Responsive Breakpoint */
          @media (max-width: 768px) {
            .rs-modal-overlay {
              padding: 1rem;
            }

            .rs-modal-container {
              flex-direction: column;
              height: auto;
              max-height: 90vh;
              overflow-y: auto;
            }

            .rs-modal-slideshow {
              width: 100%;
              height: 280px;
              flex-shrink: 0;
            }

            .rs-slideshow-arrow {
              opacity: 1; /* Always show arrows on touch devices */
            }

            .rs-modal-content {
              width: 100%;
              height: auto;
              padding: 2.25rem 1.75rem 2rem 1.75rem;
            }

            .rs-content-title {
              font-size: 1.75rem;
            }

            .rs-benefits-list {
              gap: 0.95rem;
              margin: 1.25rem 0 1.75rem 0;
            }

            .rs-content-actions {
              flex-direction: column;
              align-items: stretch;
              gap: 0.85rem;
            }

            .rs-btn-apply {
              justify-content: center;
              padding: 0.85rem;
            }

            .rs-btn-dismiss {
              text-align: center;
              padding: 0.5rem 0;
            }
          }
        `}</style>
      </motion.div>
    </div>
  );
}
