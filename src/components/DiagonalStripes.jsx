import React from 'react';

const DiagonalStripes = () => {
  return (
    <div className="diagonal-container">
      <div className="stripe stripe-1"></div>
      <div className="stripe stripe-2"></div>
      <div className="stripe stripe-3"></div>
      <div className="stripe stripe-4"></div>
      <div className="stripe stripe-5"></div>
      
      <div className="rounded-box">
        <h2>RECYCLE SPECS</h2>
        <p>A youth-led nonprofit spreading optical awareness and wellness around the world, especially targeting underprivileged youth who don't have access to optical resources.</p>
      </div>
      
      <style jsx>{`
        .diagonal-container {
          position: relative;
          width: 100%;
          height: 100vh;
          background-color: #e5e5e5;
          overflow: hidden;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .rounded-box {
          width: 60vw;
          height: 50vh;
          background: #ffffff;
          border-radius: 2rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
          transition: all 0.3s ease;
          cursor: pointer;
          z-index: 10;
          position: relative;
          text-align: center
        }

        .rounded-box:hover {
          transform: scale(1.05) translateY(-10px);
          box-shadow: 0 12px 35px rgba(0, 0, 0, 0.3);
          background: #ffffff;
        }

        .rounded-box h2 {
          color: black;
          font-size: 3rem;
          margin: 0 0 1rem 0;
          font-family: Archivo
        }

        .rounded-box p {
          color: black;
          font-size: 1.2rem;
          margin: 3vw;
          font-family: Poppins
        }

        .stripe {
          position: absolute;
          width: 300vw;
          height: 15vh;
          transform: rotate(15deg);
          transform-origin: center;
          left: -100vw;
        }

        .stripe-1 {
          background-color: #4a4a4a;
          top: 10%;
        }

        .stripe-2 {
          background-color: #c65d07;
          top: 25%;
        }

        .stripe-3 {
          background-color: #f4c2a1;
          top: 40%;
        }

        .stripe-4 {
          background-color: #e6b800;
          top: 55%;
        }

        .stripe-5 {
          background-color: #2d7d7d;
          top: 70%;
        }
      `}</style>
    </div>
  );
};

export default DiagonalStripes;