import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { collection, setDoc, doc } from 'firebase/firestore';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { db, auth } from '../firebase';

const UnlistedChapterSignup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    chapterName: '',
    schoolName: '',
    presidentName: '',
    presidentEmail: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

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

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      // 1. Create auth user with dummy email
      const dummyEmail = getDummyEmail(formData.chapterName);
      const userCredential = await createUserWithEmailAndPassword(auth, dummyEmail, formData.password);
      const user = userCredential.user;

      // 2. Save to chapters collection using user.uid as chapter document ID
      await setDoc(doc(db, 'chapters', user.uid), {
        chapterName: formData.chapterName,
        schoolName: formData.schoolName,
        presidentName: formData.presidentName,
        presidentEmail: formData.presidentEmail,
        approved: true,
        createdAt: new Date().toISOString()
      });

      setSuccess(true);
      setTimeout(() => navigate('/chapters/admin-login'), 3000);
    } catch (err) {
      setError(err.message || 'Failed to register chapter.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="rs-uc-signup">
      <div className="rs-uc-signup__inner">
        <motion.div 
          className="rs-uc-signup__box"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="rs-uc-signup__header">
            <h1 className="rs-uc-signup__title">Internal Chapter Setup</h1>
            <p className="rs-uc-signup__subtitle">Register an approved chapter. This page is unlisted.</p>
          </div>

          {error && <div className="rs-uc-signup__error">{error}</div>}
          
          {success ? (
            <div className="rs-uc-signup__success">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--rs-teal)' }}>
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
              <h3>Chapter Registered!</h3>
              <p>Redirecting to login...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="rs-uc-signup__form">
              <div className="rs-uc-signup__field">
                <label>Chapter Name (e.g. coppell)</label>
                <input type="text" name="chapterName" required value={formData.chapterName} onChange={handleChange} />
              </div>

              <div className="rs-uc-signup__field">
                <label>School Name</label>
                <input type="text" name="schoolName" required value={formData.schoolName} onChange={handleChange} />
              </div>

              <div className="rs-uc-signup__row">
                <div className="rs-uc-signup__field">
                  <label>President Name</label>
                  <input type="text" name="presidentName" required value={formData.presidentName} onChange={handleChange} />
                </div>
                <div className="rs-uc-signup__field">
                  <label>President Email</label>
                  <input type="email" name="presidentEmail" required value={formData.presidentEmail} onChange={handleChange} />
                </div>
              </div>

              <div className="rs-uc-signup__row">
                <div className="rs-uc-signup__field">
                  <label>Password</label>
                  <input type="password" name="password" required minLength="6" value={formData.password} onChange={handleChange} />
                </div>
                <div className="rs-uc-signup__field">
                  <label>Confirm Password</label>
                  <input type="password" name="confirmPassword" required minLength="6" value={formData.confirmPassword} onChange={handleChange} />
                </div>
              </div>

              <button type="submit" className="rs-uc-signup__btn" disabled={loading}>
                {loading ? 'Registering...' : 'Register Chapter'}
              </button>
            </form>
          )}
        </motion.div>
      </div>

      <style>{`
        .rs-uc-signup {
          min-height: 100vh;
          background: var(--bg-dark);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: calc(80px + 2rem) 1rem 2rem;
        }

        .rs-uc-signup__inner {
          width: 100%;
          max-width: 600px;
        }

        .rs-uc-signup__box {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 20px;
          padding: 2.5rem;
          backdrop-filter: blur(10px);
        }

        .rs-uc-signup__header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .rs-uc-signup__title {
          font-family: 'Fraunces', serif;
          font-size: 2rem;
          color: white;
          margin-bottom: 0.5rem;
        }

        .rs-uc-signup__subtitle {
          font-family: 'Inter', sans-serif;
          color: rgba(255,255,255,0.6);
          font-size: 0.95rem;
        }

        .rs-uc-signup__error {
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

        .rs-uc-signup__success {
          text-align: center;
          padding: 2rem;
        }
        
        .rs-uc-signup__success h3 {
          font-family: 'Fraunces', serif;
          font-size: 1.5rem;
          margin: 1rem 0 0.5rem;
          color: white;
        }

        .rs-uc-signup__success p {
          color: rgba(255,255,255,0.6);
          font-family: 'Inter', sans-serif;
        }

        .rs-uc-signup__form {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .rs-uc-signup__row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        .rs-uc-signup__field {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .rs-uc-signup__field label {
          font-family: 'Inter', sans-serif;
          font-size: 0.85rem;
          font-weight: 500;
          color: rgba(255,255,255,0.8);
        }

        .rs-uc-signup__field input {
          background: rgba(0,0,0,0.2);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 8px;
          padding: 12px 14px;
          color: white;
          font-family: 'Inter', sans-serif;
          font-size: 0.95rem;
          transition: border-color 0.2s;
        }

        .rs-uc-signup__field input:focus {
          outline: none;
          border-color: var(--rs-gold);
        }

        .rs-uc-signup__btn {
          background: var(--rs-gold);
          color: var(--bg-dark);
          border: none;
          border-radius: 8px;
          padding: 14px;
          font-family: 'Inter', sans-serif;
          font-weight: 700;
          font-size: 1rem;
          cursor: pointer;
          margin-top: 1rem;
          transition: background 0.2s;
        }

        .rs-uc-signup__btn:hover:not(:disabled) {
          background: #d4a73e;
        }

        .rs-uc-signup__btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        @media (max-width: 480px) {
          .rs-uc-signup__box { padding: 1.5rem; }
          .rs-uc-signup__row { grid-template-columns: 1fr; }
        }
      `}</style>
    </section>
  );
};

export default UnlistedChapterSignup;
