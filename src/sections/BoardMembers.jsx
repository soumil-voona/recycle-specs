import React, { useState } from 'react';

const ProfileCard = ({ 
  profileImage, 
  name, 
  title, 
  description,
  color = '#c65d07',
  stripeAngle = '45deg',
  index = 0 
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);

  return (
    <div 
      className={`profile-card ${isHovered ? 'hovered' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        '--profile-color': color,
        '--stripe-angle': stripeAngle,
        '--animation-delay': `${index * 0.1}s`
      }}
    >
      {/* Background diagonal stripes */}
      <div className="profile-bg-stripes">
        <div className="profile-bg-stripe stripe-bg-1"></div>
        <div className="profile-bg-stripe stripe-bg-2"></div>
        <div className="profile-bg-stripe stripe-bg-3"></div>
      </div>

      {/* Profile Image Container */}
      <div className="profile-image-container">
        <div className="image-frame">
          {!imageError ? (
            <img 
              src={profileImage} 
              alt={`${name} profile`}
              className="profile-image"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="profile-placeholder">
              <div className="placeholder-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2"/>
                  <path d="M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" stroke="currentColor" strokeWidth="2"/>
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
      </div>

      {/* Profile Content */}
      <div className="profile-content">
        <div className="name-section">
          <h3 className="profile-name">{name}</h3>
          <div className="name-underline"></div>
        </div>
        
        <div className="title-section">
          <span className="profile-title">{title}</span>
        </div>
        
        <div className="description-section">
          <p className="profile-description">{description}</p>
        </div>

        {/* Content decorative stripes */}
        <div className="content-stripes">
          <div className="content-stripe"></div>
          <div className="content-stripe"></div>
        </div>
      </div>

      <style jsx>{`
        .profile-card {
          position: relative;
          width: 100%;
          max-width: 350px;
          height: auto;
          min-height: 400px;
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(12px);
          border-radius: 24px;
          padding: 2rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          overflow: hidden;
          border: 1px solid rgba(255, 255, 255, 0.3);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
          transition: all 0.5s cubic-bezier(0.4, 0.0, 0.2, 1);
          cursor: pointer;
          transform-style: preserve-3d;
          animation: fadeInUp 0.8s ease forwards;
          animation-delay: var(--animation-delay);
          opacity: 0;
          transform: translateY(50px);
        }

        @keyframes fadeInUp {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .profile-card.hovered {
          transform: translateY(-12px) scale(1.03);
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
          background: rgba(255, 255, 255, 0.95);
          border: 1px solid rgba(0, 0, 0, 0.1);
        }

        .profile-bg-stripes {
          position: absolute;
          inset: 0;
          overflow: hidden;
          z-index: 1;
          opacity: 0.06;
        }

        .profile-bg-stripe {
          position: absolute;
          width: 200%;
          height: 4px;
          left: -50%;
          animation: profileBgFloat 10s ease-in-out infinite;
        }

        .stripe-bg-1 {
          background: linear-gradient(90deg, transparent, var(--profile-color), transparent);
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

        @keyframes profileBgFloat {
          0%, 100% { transform: translateX(-20px) rotate(var(--stripe-angle)); }
          50% { transform: translateX(20px) rotate(var(--stripe-angle)); }
        }

        .profile-image-container {
          position: relative;
          margin-bottom: 1.5rem;
          z-index: 5;
        }

        .image-frame {
          position: relative;
          width: 120px;
          height: 120px;
          border-radius: 50%;
          overflow: hidden;
          background: linear-gradient(135deg, var(--profile-color), #e6b800);
          padding: 4px;
          transition: all 0.4s ease;
        }

        .profile-card.hovered .image-frame {
          transform: scale(1.1) rotate(5deg);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        }

        .profile-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 50%;
          background: white;
          transition: all 0.4s ease;
        }

        .profile-placeholder {
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, #f8f9fa, #e9ecef);
          border-radius: 50%;
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
          border-radius: 50%;
          overflow: hidden;
          opacity: 0;
          transition: all 0.4s ease;
        }

        .profile-card.hovered .image-border-stripes {
          opacity: .25;
        }

        .border-stripe {
          position: absolute;
          width: 200%;
          height: 2px;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.8), transparent);
          left: -50%;
          animation: borderStripeRotate 2s linear infinite;
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

        @keyframes borderStripeRotate {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .profile-glow {
          position: absolute;
          inset: -8px;
          background: linear-gradient(135deg, var(--profile-color), transparent, var(--profile-color));
          border-radius: 50%;
          opacity: 0;
          transition: all 0.4s ease;
          filter: blur(12px);
          z-index: -1;
        }

        .profile-card.hovered .profile-glow {
          opacity: 0.3;
          animation: glowPulse 2s ease-in-out infinite;
        }

        @keyframes glowPulse {
          0%, 100% { transform: scale(1); opacity: 0.3; }
          50% { transform: scale(1.2); opacity: 0.5; }
        }

        .profile-content {
          position: relative;
          z-index: 5;
          width: 100%;
        }

        .name-section {
          position: relative;
          margin-bottom: 0.5rem;
        }

        .profile-name {
          font-family: 'DM Serif Text', 'Inter', 'SF Pro Display', -apple-system, sans-serif;
          font-weight: 700;
          font-size: 1.5rem;
          color: #2d2d2d;
          margin: 0;
          letter-spacing: -0.5px;
          transition: all 0.3s ease;
        }

        .profile-card.hovered .profile-name {
          color: var(--profile-color);
          transform: translateY(-2px);
        }

        .name-underline {
          width: 0;
          height: 2px;
          background: linear-gradient(90deg, var(--profile-color), #e6b800);
          margin: 0.5rem auto;
          border-radius: 1px;
          transition: all 0.4s ease;
        }

        .profile-card.hovered .name-underline {
          width: 80%;
        }

        .title-section {
          margin-bottom: 1rem;
        }

        .profile-title {
          font-family: 'Inter', 'SF Pro Display', -apple-system, sans-serif;
          font-weight: 600;
          font-size: 0.95rem;
          color: #666;
          text-transform: uppercase;
          letter-spacing: 1px;
          position: relative;
          transition: all 0.3s ease;
        }

        .profile-card.hovered .profile-title {
          color: var(--profile-color);
        }

        .description-section {
          position: relative;
        }

        .profile-description {
          font-family: 'Segoe UI', 'Inter', -apple-system, sans-serif;
          font-size: 0.9rem;
          line-height: 1.6;
          color: #555;
          margin: 0;
          transition: all 0.3s ease;
          opacity: 0.9;
        }

        .profile-card.hovered .profile-description {
          color: #333;
          opacity: 1;
        }

        .content-stripes {
          position: absolute;
          inset: 0;
          overflow: hidden;
          opacity: 0;
          transition: all 0.4s ease;
        }

        .profile-card.hovered .content-stripes {
          opacity: 0.1;
        }

        .content-stripe {
          position: absolute;
          width: 150%;
          height: 2px;
          background: linear-gradient(90deg, transparent, var(--profile-color), transparent);
          left: -25%;
          animation: contentStripeSlide 3s ease-in-out infinite;
        }

        .content-stripe:nth-child(1) {
          top: 30%;
          transform: rotate(var(--stripe-angle));
          animation-delay: 0s;
        }

        .content-stripe:nth-child(2) {
          bottom: 30%;
          transform: rotate(calc(var(--stripe-angle) * -1));
          animation-delay: -1.5s;
        }

        @keyframes contentStripeSlide {
          0%, 100% { transform: translateX(-30px) rotate(var(--stripe-angle)); }
          50% { transform: translateX(30px) rotate(var(--stripe-angle)); }
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

        .profile-card.hovered .hover-overlay {
          opacity: 1;
        }

        /* Mobile Responsiveness */
        @media (max-width: 768px) {
          .profile-card {
            max-width: 280px;
            min-height: 350px;
            padding: 1.5rem;
          }

          .image-frame {
            width: 100px;
            height: 100px;
          }

          .profile-name {
            font-size: 1.3rem;
          }

          .profile-title {
            font-size: 0.85rem;
          }

          .profile-description {
            font-size: 0.85rem;
          }
        }

        @media (max-width: 480px) {
          .profile-card {
            max-width: 260px;
            min-height: 320px;
            padding: 1.2rem;
          }

          .image-frame {
            width: 80px;
            height: 80px;
          }

          .profile-name {
            font-size: 1.2rem;
          }
        }
      `}</style>
    </div>
  );
};


const BoardMembers = () => {
  const teamMembers = [
    {
      profileImage: "/imgs/pfp-vidhisha.png",
      name: "Vidhisha Paleti",
      title: "Chief Executive Officer",
      description: "Vidhisha Paleti is a rising sophomore at CHS and is excited to launch RecycleSpecs. Growing up with a power of -5 and eventually -8 was a struggle for her in Texas, which begged the question, how much harder is it for people in disadvantage communities to access quality eye care? In addition to RecycleSpecs, Vidhisha was also NJHS and HOSA President where in her ninth grade year, she helped distribute ~504 menstrual products to girls at CHS9. Vidhisha hopes to continue to advocate for quality healthcare in policies.", 
      color: "#2d7d7d",
      stripeAngle: "45deg"
    },
    {
      profileImage: "/imgs/pfp-soukhya.png",
      name: "Soukhya Voona", 
      title: "Chief Operating Officer",
      description: "Soukhya Voona is a rising sophomore at Coppell High School. At 15 years old and passionate about medicine, she hopes to help those in need through RecycleSpecs. She is willing to use her expertise and leadership experience from past clubs, to manage and help achieve RecycleSpecs' mission.",
      color: "#c65d07",
      stripeAngle: "135deg"
    },
    {
      profileImage: "/imgs/pfp-akshata.png",
      name: "Akshata Ghosh",
      title: "Chief Communications Officer", 
      description: "Akshata Ghosh is a rising sophomore at Coppell High School. She's passionate about law, policies, and international affairs. She manages all things communications and legal of the organization. She's excited to make meaningful impact through her work at RecycleSpecs.",
      color: "#e6b800",
      stripeAngle: "-45deg"
    },
    {
      profileImage: "/imgs/pfp-soumil.png",
      name: "Soumil Voona",
      title: "Chief Technical Officer",
      description: "Soumil Voona is a current sophomore at Coppell High School who loves computer science and finding ways to use technology to help others. At RecycleSpecs, he manages the website, helps with event planning, and supports the team wherever needed. He's excited to contribute his skills and make a meaningful impact on the world.",
      color: "#924014", 
      stripeAngle: "-135deg"
    },
    {
      profileImage: "https://via.placeholder.com/150/21544E/ffffff?text=DW",
      name: "Sidhartha De",
      title: "Chief Financial Officer",
      description: "Waiting...",
      color: "#21544E",
      stripeAngle: "60deg"
    },
    {
      profileImage: "https://via.placeholder.com/150/403A3A/ffffff?text=AL",
      name: "Aditi Ahuja",
      title: "Chief Marketing Officer",
      description: "Waiting...",
      color: "#403A3A",
      stripeAngle: "-60deg"
    }
  ];

  return (
    <div className="profile-showcase">
      <div className="showcase-header">
        <h2 style={{fontSize: 'clamp(3rem, 8vw, 6rem)'}}>Meet Our Team</h2>
        <p>Dedicated individuals working together to bring fair optical care services worldwide</p>
      </div>
      
      <div className="profiles-grid">
        {teamMembers.map((member, index) => (
          <ProfileCard
            key={index}
            profileImage={member.profileImage}
            name={member.name}
            title={member.title}
            description={member.description}
            color={member.color}
            stripeAngle={member.stripeAngle}
            index={index}
          />
        ))}
      </div>

      <style jsx>{`
        .profile-showcase {
          padding: -10rem 2rem;
          max-width: 1400px;
          margin: 0 auto;
        }

        .showcase-header {
          text-align: center;
          margin-bottom: 4rem;
        }

        .showcase-header h2 {
          font-family: 'DM Serif Text', Times, serif;
          font-size: 2.5rem;
          color: #2d2d2d;
          margin-bottom: 1rem;
          font-weight: 700;
          margin: 40px
        }

        .showcase-header p {
          font-family: 'Segoe UI', sans-serif;
          font-size: 1.1rem;
          color: #666;
          max-width: 800px;
          margin: 0 auto;
        }

        .profiles-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 2rem;
          justify-items: center;
          margin: 0 auto;
          max-width: 1400px;
        }

        /* Breakpoint adjustments to prevent overlap */
        @media (min-width: 1024px) {
          .profiles-grid {
            grid-template-columns: repeat(auto-fit, minmax(380px, 1fr));
            gap: 3rem;
          }
        }

        @media (max-width: 1023px) {
          .profiles-grid {
            grid-template-columns: 1fr;
            gap: 2rem;
            max-width: 380px;
          }
        }

        @media (max-width: 768px) {
          .profile-showcase {
            padding: 2rem 1rem;
          }

          .showcase-header h2 {
            font-size: 2rem;
          }

          .profiles-grid {
            max-width: 350px;
            gap: 1.5rem;
          }
        }

        @media (max-width: 480px) {
          .profiles-grid {
            max-width: 280px;
          }
        }
      `}</style>
    </div>
  );
};

export default BoardMembers;