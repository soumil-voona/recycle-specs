import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { db, auth } from '../firebase';

const ChapterAdminLogin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    chapterName: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    let { name, value } = e.target;
    if (name === 'chapterName') {
      value = value.replace(/\s+/g, '');
    }
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const getDummyEmail = (chapterName) => {
    const cleanName = chapterName.toLowerCase().replace(/[^a-z0-9]/g, '');
    return `${cleanName}@chapters.recyclespecs.org`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Find the chapter in Firestore to ensure it exists
      const q = query(collection(db, 'chapters'), where('chapterName', '==', formData.chapterName));
      const snapshot = await getDocs(q);
      
      if (snapshot.empty) {
        throw new Error('Chapter not found. Please check the spelling.');
      }

      // Log in with dummy email
      const dummyEmail = getDummyEmail(formData.chapterName);
      await signInWithEmailAndPassword(auth, dummyEmail, formData.password);

      // Redirect to chapter dashboard
      navigate('/chapters/dashboard');
    } catch (err) {
      if (err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') {
        setError('Invalid chapter name or password.');
      } else {
        setError(err.message || 'Failed to log in.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="rs-c-login">
      {/* Background orbs */}
      <div className="rs-c-login__bg-orbs" aria-hidden="true">
        <div className="rs-c-login__orb orb-a" />
        <div className="rs-c-login__orb orb-b" />
      </div>

      <div className="rs-c-login__inner">
        <motion.div 
          className="rs-c-login__box"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="rs-c-login__header">
            <h1 className="rs-c-login__title">Chapter Admin</h1>
            <p className="rs-c-login__subtitle">Log in to manage your chapter's impact dashboard.</p>
          </div>

          {error && <div className="rs-c-login__error">{error}</div>}

          <form onSubmit={handleSubmit} className="rs-c-login__form">
            <div className="rs-c-login__field">
              <label htmlFor="c-name">Chapter Name</label>
              <input 
                id="c-name"
                type="text" 
                name="chapterName" 
                required 
                value={formData.chapterName} 
                onChange={handleChange} 
                placeholder="e.g. coppell"
                autoComplete="off"
              />
            </div>

            <div className="rs-c-login__field">
              <label htmlFor="c-pass">Password</label>
              <input 
                id="c-pass"
                type="password" 
                name="password" 
                required 
                value={formData.password} 
                onChange={handleChange} 
              />
            </div>

            <button type="submit" className="rs-c-login__btn" disabled={loading}>
              {loading ? 'Logging in...' : 'Log In'}
            </button>
          </form>

          <div className="rs-c-login__footer">
            <p>Interested in starting a new chapter?</p>
            <a 
              href="https://docs.google.com/forms/d/e/1FAIpQLSd9aEDApzvprFccS0C4DPUSffluMbAHRuKF1YGDuayXgre_hQ/viewform" 
              target="_blank" 
              rel="noreferrer" 
              className="rs-c-login__start-btn"
            >
              Start a Chapter
            </a>
          </div>
        </motion.div>
      </div>

      <style>{`
        .rs-c-login {
          min-height: 100vh;
          background: linear-gradient(135deg, #12100f 0%, var(--bg-dark) 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: calc(80px + 2rem) 1rem 2rem;
          position: relative;
          overflow: hidden;
        }

        .rs-c-login__bg-orbs {
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 1;
        }

        .rs-c-login__orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(100px);
          opacity: 0.12;
        }

        .rs-c-login__orb.orb-a {
          width: 350px; height: 350px;
          background: var(--rs-teal);
          top: 15%; left: 10%;
        }

        .rs-c-login__orb.orb-b {
          width: 300px; height: 300px;
          background: var(--rs-orange);
          bottom: 15%; right: 10%;
        }

        .rs-c-login__inner {
          width: 100%;
          max-width: 450px;
          position: relative;
          z-index: 2;
        }

        .rs-c-login__box {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: var(--radius-lg);
          padding: 3rem 2.5rem;
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          box-shadow: 0 20px 50px rgba(0,0,0,0.3);
        }

        .rs-c-login__header {
          text-align: center;
          margin-bottom: 2.25rem;
        }

        .rs-c-login__title {
          font-family: var(--font-display), serif;
          font-size: 2.1rem;
          font-weight: 700;
          color: white;
          margin-bottom: 0.5rem;
          letter-spacing: -0.02em;
        }

        .rs-c-login__subtitle {
          font-family: var(--font-body), sans-serif;
          color: rgba(255, 255, 255, 0.55);
          font-size: 0.95rem;
          line-height: 1.5;
        }

        .rs-c-login__error {
          background: rgba(240, 82, 82, 0.12);
          border: 1px solid rgba(240, 82, 82, 0.25);
          color: #ff8a8a;
          padding: 12px 16px;
          border-radius: var(--radius-sm);
          margin-bottom: 1.75rem;
          font-family: var(--font-body), sans-serif;
          font-size: 0.88rem;
          text-align: center;
        }

        .rs-c-login__form {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .rs-c-login__field {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .rs-c-login__field label {
          font-family: var(--font-body), sans-serif;
          font-size: 0.85rem;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.85);
        }

        .rs-c-login__field input {
          background: rgba(0, 0, 0, 0.25);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: var(--radius-sm);
          padding: 12px 14px;
          color: white;
          font-family: var(--font-body), sans-serif;
          font-size: 0.95rem;
          transition: all 0.25s var(--ease-out-expo);
        }

        .rs-c-login__field input::placeholder {
          color: rgba(255, 255, 255, 0.3);
        }

        .rs-c-login__field input:focus {
          outline: none;
          border-color: var(--rs-orange);
          box-shadow: 0 0 0 3px rgba(198, 93, 7, 0.2);
          background: rgba(0, 0, 0, 0.35);
        }

        .rs-c-login__btn {
          background: var(--rs-orange);
          color: white;
          border: none;
          border-radius: var(--radius-md);
          padding: 14px;
          font-family: var(--font-body), sans-serif;
          font-weight: 700;
          font-size: 1rem;
          cursor: pointer;
          margin-top: 1rem;
          transition: all 0.3s var(--ease-out-expo);
          box-shadow: 0 4px 15px rgba(198, 93, 7, 0.3);
        }

        .rs-c-login__btn:hover:not(:disabled) {
          background: var(--rs-orange-dark);
          transform: translateY(-1.5px);
          box-shadow: 0 6px 20px rgba(198, 93, 7, 0.45);
        }

        .rs-c-login__btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          box-shadow: none;
        }

        .rs-c-login__footer {
          margin-top: 2.5rem;
          text-align: center;
          font-family: var(--font-body), sans-serif;
          font-size: 0.9rem;
          color: rgba(255, 255, 255, 0.5);
          border-top: 1px solid rgba(255, 255, 255, 0.08);
          padding-top: 1.5rem;
        }

        .rs-c-login__start-btn {
          display: inline-block;
          margin-top: 12px;
          padding: 10px 20px;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.08);
          color: white;
          text-decoration: none;
          border-radius: var(--radius-md);
          font-weight: 600;
          font-family: var(--font-body), sans-serif;
          font-size: 0.88rem;
          transition: all 0.25s var(--ease-out-expo);
        }

        .rs-c-login__start-btn:hover {
          background: rgba(255, 255, 255, 0.08);
          border-color: rgba(255, 255, 255, 0.15);
          transform: translateY(-1px);
        }

        @media (max-width: 480px) {
          .rs-c-login__box { padding: 2rem 1.5rem; }
        }
      `}</style>
    </section>
  );
};

export default ChapterAdminLogin;
