import React from 'react';
import BlurText from '../components/BlurText'
const Home = () => {
  const handleAnimationComplete = () => {
    console.log("animation complete")
  };
  return (
    <div className="diagonal-container">
      <div className="stripe stripe-1"></div>
      <div className="stripe stripe-2"></div>
      <div className="stripe stripe-3"></div>
      <div className="stripe stripe-4"></div>
      <div className="stripe stripe-5"></div>
      
      <div className="rounded-box">
        <BlurText
          text="RECYCLE SPECS"
          delay={75}
          animateBy="characters"
          direction="bottom"
          onAnimationComplete={handleAnimationComplete}
          className="text-2xl mb-8"
        />
        <p>Welcome to RecycleSpecs! We are a youth-led nonprofit designed to spread optical awareness and wellness around the world, especially targeting underprivileged youth who don’t have access to optical resources. </p>
      </div>
      
      <style jsx>{`
        .diagonal-container {
          position: relative;
          width: 100%;
          height: 100vh;
          overflow: hidden;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        
        .owl-background {
          position: absolute;
          width: 80vw;
          height: 80vh;
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 2;
          pointer-events: none;
        }
        
        .owl-background img {
          width: 100%;
          height: 100%;
          max-width: 400px;
          max-height: 500px;
          opacity: 0.6;
          object-fit: contain;
          filter: brightness(1.1) contrast(1.1);
        }
        
        .rounded-box {
          width: 60vw;
          height: 50vh;
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(8px);
          border-radius: 2rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
          border: 1px solid rgba(255, 255, 255, 0.3);
          transition: all 0.3s ease;
          cursor: pointer;
          z-index: 10;
          position: relative;
          text-align: center;
        }
        
        .rounded-box:hover {
          transform: scale(1.02) translateY(-5px);
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
          background: rgba(255, 255, 255, 0.98);
        }
        
        .rounded-box h1 {
          color: #2d2d2d;
          font-size: clamp(2rem, 5vw, 3.5rem); /* always noticeably larger */
          margin: 0 0 1rem 0;
          font-family: 'DM Serif Text', Times New Roman, sans-serif;
          font-weight: 900;
          letter-spacing: 0px;
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
        }

        .rounded-box p {
          color: #444;
          font-size: clamp(1rem, 2vw, 1.3rem); /* smaller cap than h2 */
          margin: 1.5rem 2rem;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          line-height: 1.6;
          font-weight: 400;
        }


        
        .stripe {
          position: absolute;
          width: 300vw;
          height: 15vh;
          transform: rotate(-15deg);
          transform-origin: center;
          left: -100vw;
          opacity: 0.8;
        }
        
        .stripe-1 {
          background: #403A3A;
          top: 70%;
        }
        
        .stripe-2 {
          background: #924014;
          top: 55%;
        }
        
        .stripe-3 {
          background: #EAC19E;
          top: 40%;
        }
        
        .stripe-4 {
          background: #DA9F1A;
          top: 25%;
        }
        
        .stripe-5 {
          background: #21544E;
          top: 10%;
        }

        @media (max-width: 480px) {
          .rounded-box {
            width: clamp(90%, 60vw, 600px); /* shrinks nicely on small screens */
            height: auto;                    /* let content dictate height */
            padding: clamp(1rem, 3vw, 2rem); /* add responsive padding */
          }
        } 
      `}</style>
    </div>
  );
};

export default Home;