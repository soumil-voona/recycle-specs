import React, { useState, useEffect } from 'react';

const Navbar = () => {
  const [hoveredTab, setHoveredTab] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'Home', color: '#2d7d7d', angle: '45deg' },
    { name: 'About', color: '#c65d07', angle: '135deg' },
    { name: 'Board', color: '#e6b800', angle: '-135deg' },
    { name: 'Partnerships', color: '#4a4a4a', angle: '-45deg' }
  ];

  const handleNavigation = (itemName) => {
    const targetId = itemName.toLowerCase();
    const element = document.getElementById(targetId);
    if (element) {
      // Dynamic navbar height detection
      const navbar = document.querySelector('.navbar-wrapper');
      // Use smaller offset on mobile
      const isMobile = window.innerWidth <= 900;
      const navbarHeight = navbar ? navbar.offsetHeight : (isMobile ? 60 : 75);
      // Less extra padding on mobile for better alignment
      const extraPadding = isMobile ? 6 : 20;
      const elementPosition = element.offsetTop;
      const offsetPosition = elementPosition - navbarHeight - extraPadding;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    } else {
      // Fallback to hash navigation if element doesn't exist
      window.location.hash = `#${targetId}`;
    }
  };

  const handleMobileNavigation = (itemName) => {
    setMobileMenuOpen(false);
    setTimeout(() => {
      handleNavigation(itemName);
    }, 300); // Small delay to allow menu to close
  };

  return (
    <div className={`navbar-wrapper ${scrolled ? 'scrolled' : ''}`}>
      <div className="nav-container">
        {/* Logo */}
        <div className="logo-section" onClick={() => handleNavigation('Home')}>
          <img src = '/imgs/logo.png' style={{height: '60px'}} />
          <span className="logo-text">RECYCLE SPECS</span>
        </div>

        {/* Navigation Items */}
        <div className="nav-menu">
          {navItems.map((item, index) => (
            <div
              key={item.name}
              className={`nav-tab ${hoveredTab === index ? 'hovered' : ''}`}
              onMouseEnter={() => setHoveredTab(index)}
              onMouseLeave={() => setHoveredTab(null)}
              onClick={() => handleNavigation(item.name)}
              style={{
                '--tab-color': item.color,
                '--stripe-angle': item.angle,
                '--delay': `${index * 0.1}s`
              }}
            >
              <div className="tab-content">
                <span className="tab-text">{item.name}</span>
              </div>
              
              {/* Diagonal stripe effects */}
              <div className="diagonal-bg"></div>
              <div className="diagonal-stripe stripe-1"></div>
              <div className="diagonal-stripe stripe-2"></div>
              <div className="diagonal-stripe stripe-3"></div>
              <div className="hover-glow"></div>
            </div>
          ))}
        </div>

        {/* Mobile Menu Button */}
        <div className="mobile-menu-btn" onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setMobileMenuOpen(!mobileMenuOpen);
        }}>
          <div className={`hamburger ${mobileMenuOpen ? 'open' : ''}`}>
            <span className="line line-1"></span>
            <span className="line line-2"></span>
            <span className="line line-3"></span>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        <div className={`mobile-menu-overlay ${mobileMenuOpen ? 'open' : ''}`}>
          <div className="mobile-menu-content">
            {navItems.map((item, index) => (
              <div
                key={item.name}
                className="mobile-nav-item"
                style={{
                  '--item-color': item.color,
                  '--item-delay': `${index * 0.1}s`
                }}
                onClick={() => handleMobileNavigation(item.name)}
              >
                <span>{item.name}</span>
                <div className="mobile-item-stripe"></div>
              </div>
            ))}
            <div className="mobile-cta" onClick={() => setMobileMenuOpen(false)}>
              <button className="mobile-donate-btn" onClick={() => handleNavigation("contact")}>
                <span>Donate Now</span>
              </button>
            </div>
          </div>
          <div className="mobile-bg-stripes">
            <div className="mobile-bg-stripe"></div>
            <div className="mobile-bg-stripe"></div>
            <div className="mobile-bg-stripe"></div>
          </div>
        </div>

        {/* CTA Button */}
        <div className="cta-section">
          <button className="donate-btn" onClick={() => handleNavigation("contact")}>
            <span>Donate Now</span>
            <div className="btn-stripes">
              <div className="btn-stripe"></div>
              <div className="btn-stripe"></div>
              <div className="btn-stripe"></div>
            </div>
          </button>
        </div>

        {/* Background diagonal elements */}
        <div className="bg-decoration">
          <div className="bg-stripe bg-stripe-1"></div>
          <div className="bg-stripe bg-stripe-2"></div>
          <div className="bg-stripe bg-stripe-3"></div>
        </div>
      </div>

      <style jsx>{`
        * {
          box-sizing: border-box;
        }
        
        html, body {
          overflow-x: hidden;
          max-width: 100vw;
        }
        
        .navbar-wrapper {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 1000;
          background: rgba(255, 255, 255, 0.95);
          border-bottom: 1px solid rgba(0, 0, 0, 0.1);
          transition: all 0.4s cubic-bezier(0.4, 0.0, 0.2, 1);
        }

        .navbar-wrapper.scrolled {
          background: rgba(255, 255, 255, 0.98);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
        }

        .nav-container {
          position: relative;
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 2rem;
          height: 75px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          overflow: hidden;
        }

        .logo-section {
          display: flex;
          align-items: center;
          gap: 12px;
          z-index: 10;
          cursor: pointer;
          transition: transform 0.3s ease;
        }

        .logo-section:hover {
          transform: scale(1.05);
        }

        .logo-icon {
          position: relative;
          width: 28px;
          height: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .logo-text {
          font-family: 'Inter', 'SF Pro Display', -apple-system, sans-serif;
          font-weight: 900;
          font-size: 1.1rem;
          background: black;
          background-clip: text;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          letter-spacing: -0.5px;
        }

        .nav-menu {
          display: flex;
          gap: 4px;
          z-index: 10;
        }

        .nav-tab {
          position: relative;
          padding: 14px 22px;
          cursor: pointer;
          border-radius: 14px;
          overflow: hidden;
          transition: all 0.4s cubic-bezier(0.4, 0.0, 0.2, 1);
          background: rgba(255, 255, 255, 0.6);
        }

        .nav-tab:hover {
          transform: translateY(-3px) scale(1.02);
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
          border: 1px solid rgba(0, 0, 0, 0.15);
        }

        .tab-content {
          position: relative;
          z-index: 5;
        }

        .tab-text {
          font-family: 'Inter', 'SF Pro Display', -apple-system, sans-serif;
          font-weight: 600;
          font-size: 0.9rem;
          color: #333;
          transition: all 0.3s ease;
          position: relative;
        }

        .nav-tab.hovered .tab-text {
          color: white;
          text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
        }

        .diagonal-bg {
          position: absolute;
          inset: 0;
          background: var(--tab-color);
          transform: translateY(100%) rotate(var(--stripe-angle));
          transform-origin: center;
          transition: all 0.5s cubic-bezier(0.4, 0.0, 0.2, 1);
          opacity: 0;
        }

        .nav-tab.hovered .diagonal-bg {
          transform: translateY(0%) rotate(var(--stripe-angle));
          opacity: 0.9;
        }

        .diagonal-stripe {
          position: absolute;
          width: 200%;
          height: 3px;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.6), transparent);
          transform: rotate(var(--stripe-angle));
          transform-origin: center;
          left: -50%;
          opacity: 0;
          transition: all 0.4s ease;
        }

        .stripe-1 {
          top: 20%;
          animation-delay: var(--delay);
        }

        .stripe-2 {
          top: 50%;
          animation-delay: calc(var(--delay) + 0.1s);
        }

        .stripe-3 {
          bottom: 20%;
          animation-delay: calc(var(--delay) + 0.2s);
        }

        .nav-tab.hovered .diagonal-stripe {
          opacity: 1;
          animation: slideStripe 2s ease-in-out infinite;
        }

        @keyframes slideStripe {
          0%, 100% { transform: translateX(-20px) rotate(var(--stripe-angle)); }
          50% { transform: translateX(20px) rotate(var(--stripe-angle)); }
        }

        .hover-glow {
          position: absolute;
          inset: -2px;
          background: linear-gradient(45deg, var(--tab-color), transparent, var(--tab-color));
          border-radius: 16px;
          opacity: 0;
          transition: all 0.3s ease;
          filter: blur(8px);
          z-index: -1;
        }

        .nav-tab.hovered .hover-glow {
          opacity: 0.4;
          animation: pulse 2s ease-in-out infinite;
        }

        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 0.4; }
          50% { transform: scale(1.05); opacity: 0.6; }
        }

        .cta-section {
          z-index: 10;
        }

        .donate-btn {
          position: relative;
          padding: 12px 24px;
          background: linear-gradient(135deg, #c65d07, #e6b800);
          border: none;
          border-radius: 12px;
          color: white;
          font-family: 'Inter', 'SF Pro Display', -apple-system, sans-serif;
          font-weight: 700;
          font-size: 0.9rem;
          cursor: pointer;
          overflow: hidden;
          transition: all 0.3s cubic-bezier(0.4, 0.0, 0.2, 1);
        }

        .donate-btn:hover {
          transform: translateY(-2px) scale(1.05);
          box-shadow: 0 8px 25px rgba(196, 93, 7, 0.4);
          background: linear-gradient(135deg, #e67309, #ffcc00);
        }

        .btn-stripes {
          position: absolute;
          inset: 0;
          overflow: hidden;
        }

        .btn-stripe {
          position: absolute;
          width: 100%;
          height: 2px;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.5), transparent);
          transform: translateX(-100%) rotate(45deg);
          transform-origin: center;
        }

        .btn-stripe:nth-child(1) { top: 20%; }
        .btn-stripe:nth-child(2) { top: 50%; }
        .btn-stripe:nth-child(3) { bottom: 20%; }

        .donate-btn:hover .btn-stripe {
          animation: btnStripeSlide 1.5s ease-in-out infinite;
        }

        .donate-btn:hover .btn-stripe:nth-child(1) { animation-delay: 0s; }
        .donate-btn:hover .btn-stripe:nth-child(2) { animation-delay: 0.2s; }
        .donate-btn:hover .btn-stripe:nth-child(3) { animation-delay: 0.4s; }

        @keyframes btnStripeSlide {
          0% { transform: translateX(-100%) rotate(45deg); }
          50% { transform: translateX(0%) rotate(45deg); }
          100% { transform: translateX(100%) rotate(45deg); }
        }

        /* Mobile Menu Button */
        .mobile-menu-btn {
          display: none;
          cursor: pointer;
          z-index: 15;
          padding: 8px;
          border-radius: 8px;
          transition: all 0.3s ease;
        }

        .mobile-menu-btn:hover {
          background: rgba(0, 0, 0, 0.05);
        }

        .hamburger {
          width: 24px;
          height: 18px;
          position: relative;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          transform: translateZ(0);
        }

        .line {
          width: 100%;
          height: 2px;
          background: linear-gradient(90deg, #c65d07, #e6b800);
          border-radius: 2px;
          transition: none;
          transform-origin: center;
          position: relative;
        }

        .line-1 {
          transition: transform 0.2s ease-in-out;
        }

        .line-2 {
          transition: opacity 0.2s ease-in-out, transform 0.2s ease-in-out;
        }

        .line-3 {
          transition: transform 0.2s ease-in-out;
        }

        .hamburger.open .line-1 {
          transform: translate3d(0, 8px, 0) rotate(45deg);
        }

        .hamburger.open .line-2 {
          opacity: 0;
          transform: translate3d(0, 0, 0) scaleX(0);
        }

        .hamburger.open .line-3 {
          transform: translate3d(0, -8px, 0) rotate(-45deg);
        }

        /* Mobile Menu Overlay */
        .mobile-menu-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: rgba(0, 0, 0, 0.95);
          backdrop-filter: blur(24px);
          z-index: 12;
          opacity: 0;
          visibility: hidden;
          transition: all 0.4s cubic-bezier(0.4, 0.0, 0.2, 1);
          overflow: hidden;
        }

        .mobile-menu-overlay.open {
          opacity: 1;
          visibility: visible;
        }

        .mobile-menu-content {
          position: relative;
          height: 100%;
          width: 100%;
          max-width: 100vw;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          gap: 2rem;
          z-index: 13;
          overflow: hidden;
          box-sizing: border-box;
          padding: 0 1rem;
        }

        .mobile-nav-item {
          position: relative;
          padding: 1rem 2rem;
          cursor: pointer;
          font-family: 'Inter', 'SF Pro Display', -apple-system, sans-serif;
          font-weight: 700;
          font-size: 1.5rem;
          color: white;
          text-align: center;
          border-radius: 16px;
          overflow: hidden;
          transition: all 0.6s cubic-bezier(0.4, 0.0, 0.2, 1);
          transition-delay: var(--item-delay);
          transform: translateY(50px);
          opacity: 0;
        }

        .mobile-menu-overlay.open .mobile-nav-item {
          transform: translateY(0);
          opacity: 1;
        }

        .mobile-nav-item:hover {
          transform: scale(1.05);
          color: var(--item-color);
          text-shadow: 0 0 20px var(--item-color);
        }

        .mobile-item-stripe {
          position: absolute;
          bottom: 0;
          left: 50%;
          width: 0;
          height: 3px;
          background: var(--item-color);
          border-radius: 3px;
          transition: all 0.3s ease;
          transform: translateX(-50%);
        }

        .mobile-nav-item:hover .mobile-item-stripe {
          width: 80%;
          box-shadow: 0 0 15px var(--item-color);
        }

        .mobile-cta {
          margin-top: 2rem;
          transition: all 0.6s cubic-bezier(0.4, 0.0, 0.2, 1);
          transition-delay: 0.4s;
          transform: translateY(50px);
          opacity: 0;
        }

        .mobile-menu-overlay.open .mobile-cta {
          transform: translateY(0);
          opacity: 1;
        }

        .mobile-donate-btn {
          padding: 1rem 2rem;
          background: linear-gradient(135deg, #c65d07, #e6b800);
          border: none;
          border-radius: 16px;
          color: white;
          font-family: 'Inter', 'SF Pro Display', -apple-system, sans-serif;
          font-weight: 700;
          font-size: 1.2rem;
          cursor: pointer;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .mobile-donate-btn:hover {
          transform: scale(1.1);
          box-shadow: 0 8px 32px rgba(196, 93, 7, 0.5);
        }

        .mobile-bg-stripes {
          position: absolute;
          inset: 0;
          overflow: hidden;
          z-index: 1;
          max-width: 100vw;
        }

        .mobile-bg-stripe {
          position: absolute;
          width: 200%;
          height: 4px;
          left: -50%;
          opacity: 0.2;
          max-width: 200vw;
          will-change: transform;
        }

        .mobile-bg-stripe:nth-child(1) {
          background: linear-gradient(90deg, transparent, #2d7d7d, transparent);
          top: 20%;
          transform: rotate(45deg);
          animation: mobileStripeFloat 6s ease-in-out infinite;
        }

        .mobile-bg-stripe:nth-child(2) {
          background: linear-gradient(90deg, transparent, #c65d07, transparent);
          top: 50%;
          transform: rotate(-45deg);
          animation: mobileStripeFloat 6s ease-in-out infinite;
          animation-delay: -2s;
        }

        .mobile-bg-stripe:nth-child(3) {
          background: linear-gradient(90deg, transparent, #e6b800, transparent);
          bottom: 20%;
          transform: rotate(45deg);
          animation: mobileStripeFloat 6s ease-in-out infinite;
          animation-delay: -4s;
        }

        @keyframes mobileStripeFloat {
          0%, 100% { transform: translateX(-20px) rotate(45deg); }
          50% { transform: translateX(20px) rotate(45deg); }
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
          height: 4px;
          left: -50%;
          animation: bgFloat 8s ease-in-out infinite;
        }

        .bg-stripe-1 {
          background: linear-gradient(90deg, transparent, #2d7d7d, transparent);
          top: 20%;
          transform: rotate(15deg);
          animation-delay: 0s;
        }

        .bg-stripe-2 {
          background: linear-gradient(90deg, transparent, #c65d07, transparent);
          top: 50%;
          transform: rotate(-15deg);
          animation-delay: -2s;
        }

        .bg-stripe-3 {
          background: linear-gradient(90deg, transparent, #e6b800, transparent);
          bottom: 20%;
          transform: rotate(15deg);
          animation-delay: -4s;
        }

        @keyframes bgFloat {
          0%, 100% { transform: translateX(-10px) rotate(15deg); opacity: 0.1; }
          50% { transform: translateX(10px) rotate(15deg); opacity: 0.2; }
        }

        /* Mobile Responsiveness */
        @media (max-width: 900px) {
          .nav-container {
            padding: 0 1rem;
            height: 70px;
          }

          .nav-menu {
            display: none;
          }

          .mobile-menu-btn {
            display: block;
          }

          .cta-section {
            display: none;
          }

          .logo-text {
            font-size: 0.95rem;
          }
        }

        @media (max-width: 480px) {
          .nav-container {
            padding: 0 0.5rem;
          }

          .logo-text {
            font-size: 0.85rem;
          }
        }
      `}</style>
    </div>
  );
};

export default Navbar;