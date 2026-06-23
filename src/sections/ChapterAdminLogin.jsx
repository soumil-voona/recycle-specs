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
    // Generate dummy email from chapter name (e.g. "Coppell High School" -> "coppellhighschool@chapters.recyclespecs.org")
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
      <div className="rs-c-login__inner">
        <motion.div 
          className="rs-c-login__box"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="rs-c-login__header">
            <h1 className="rs-c-login__title">Chapter Admin</h1>
            <p className="rs-c-login__subtitle">Log in to manage your chapter.</p>
          </div>

          {error && <div className="rs-c-login__error">{error}</div>}

          <form onSubmit={handleSubmit} className="rs-c-login__form">
            <div className="rs-c-login__field">
              <label>Chapter Name</label>
              <input 
                type="text" 
                name="chapterName" 
                required 
                value={formData.chapterName} 
                onChange={handleChange} 
                placeholder="e.g. coppell"
              />
            </div>

            <div className="rs-c-login__field">
              <label>Password</label>
              <input 
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
            <p>Interested in starting a chapter?</p>
            <a href="https://forms.google.com/your-form-link" target="_blank" rel="noreferrer" className="rs-c-login__start-btn">
              Start a Chapter
            </a>
          </div>
        </motion.div>
      </div>

      <style>{`
        .rs-c-login {
          min-height: 100vh;
          background: var(--bg-dark);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: calc(80px + 2rem) 1rem 2rem;
        }

        .rs-c-login__inner {
          width: 100%;
          max-width: 440px;
        }

        .rs-c-login__box {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 20px;
          padding: 2.5rem;
          backdrop-filter: blur(10px);
        }

        .rs-c-login__header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .rs-c-login__title {
          font-family: 'Fraunces', serif;
          font-size: 2rem;
          color: white;
          margin-bottom: 0.5rem;
        }

        .rs-c-login__subtitle {
          font-family: 'Inter', sans-serif;
          color: rgba(255,255,255,0.6);
          font-size: 0.95rem;
        }

        .rs-c-login__error {
          background: rgba(220, 53, 69, 0.1);
          border: 1px solid rgba(220, 53, 69, 0.3);
          color: #ff6b6b;
          padding: 12px;
          border-radius: 8px;
          margin-bottom: 1.5rem;
          font-family: 'Inter', sans-serif;
          font-size: 0.85rem;
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
          font-family: 'Inter', sans-serif;
          font-size: 0.85rem;
          font-weight: 500;
          color: rgba(255,255,255,0.8);
        }

        .rs-c-login__field input {
          background: rgba(0,0,0,0.2);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 8px;
          padding: 12px 14px;
          color: white;
          font-family: 'Inter', sans-serif;
          font-size: 0.95rem;
          transition: border-color 0.2s;
        }

        .rs-c-login__field input:focus {
          outline: none;
          border-color: var(--rs-orange);
        }

        .rs-c-login__btn {
          background: var(--rs-orange);
          color: white;
          border: none;
          border-radius: 8px;
          padding: 14px;
          font-family: 'Inter', sans-serif;
          font-weight: 600;
          font-size: 1rem;
          cursor: pointer;
          margin-top: 1rem;
          transition: background 0.2s;
        }

        .rs-c-login__btn:hover:not(:disabled) {
          background: var(--rs-orange-dark);
        }

        .rs-c-login__btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .rs-c-login__footer {
          margin-top: 2.5rem;
          text-align: center;
          font-family: 'Inter', sans-serif;
          font-size: 0.9rem;
          color: rgba(255,255,255,0.6);
          border-top: 1px solid rgba(255,255,255,0.1);
          padding-top: 1.5rem;
        }

        .rs-c-login__start-btn {
          display: inline-block;
          margin-top: 12px;
          padding: 10px 20px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          color: white;
          text-decoration: none;
          border-radius: 8px;
          font-weight: 500;
          transition: all 0.2s ease;
        }

        .rs-c-login__start-btn:hover {
          background: rgba(255,255,255,0.1);
          border-color: rgba(255,255,255,0.2);
        }

        @media (max-width: 480px) {
          .rs-c-login__box { padding: 1.5rem; }
        }
      `}</style>
    </section>
  );
};

export default ChapterAdminLogin;
