import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { collection, query, where, getDocs, setDoc, doc } from 'firebase/firestore';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { db, auth } from '../firebase';

const VolunteerSignup = () => {
  const navigate = useNavigate();
  const [chapters, setChapters] = useState([]);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    school: '',
    grade: '',
    chapterId: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchChapters = async () => {
      try {
        const q = query(collection(db, 'chapters'), where('approved', '==', true));
        const snapshot = await getDocs(q);
        const chapterList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        // Sort alphabetically by chapterName
        chapterList.sort((a, b) => a.chapterName.localeCompare(b.chapterName));
        setChapters(chapterList);
      } catch (err) {
        console.error("Error fetching chapters:", err);
      }
    };
    fetchChapters();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // 1. Create auth user
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;

      // 2. Update profile
      await updateProfile(user, { displayName: `${formData.firstName} ${formData.lastName}` });

      // 3. Save to volunteers collection
      await setDoc(doc(db, 'volunteers', user.uid), {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        school: formData.school,
        grade: formData.grade,
        chapterId: formData.chapterId,
        volunteerHours: 0,
        createdAt: new Date().toISOString()
      });

      // Redirect to volunteer dashboard
      navigate('/volunteers');
    } catch (err) {
      setError(err.message || 'Failed to create account.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="rs-v-signup">
      <div className="rs-v-signup__inner">
        <motion.div 
          className="rs-v-signup__box"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="rs-v-signup__header">
            <h1 className="rs-v-signup__title">Volunteer Sign Up</h1>
            <p className="rs-v-signup__subtitle">Join a chapter to start making an impact.</p>
          </div>

          {error && <div className="rs-v-signup__error">{error}</div>}

          <form onSubmit={handleSubmit} className="rs-v-signup__form">
            <div className="rs-v-signup__row">
              <div className="rs-v-signup__field">
                <label>First Name</label>
                <input type="text" name="firstName" required value={formData.firstName} onChange={handleChange} />
              </div>
              <div className="rs-v-signup__field">
                <label>Last Name</label>
                <input type="text" name="lastName" required value={formData.lastName} onChange={handleChange} />
              </div>
            </div>

            <div className="rs-v-signup__field">
              <label>Email Address</label>
              <input type="email" name="email" required value={formData.email} onChange={handleChange} />
            </div>

            <div className="rs-v-signup__field">
              <label>Password</label>
              <input type="password" name="password" required minLength="6" value={formData.password} onChange={handleChange} />
            </div>

            <div className="rs-v-signup__row">
              <div className="rs-v-signup__field">
                <label>School</label>
                <input type="text" name="school" required value={formData.school} onChange={handleChange} />
              </div>
              <div className="rs-v-signup__field">
                <label>Grade</label>
                <select name="grade" required value={formData.grade} onChange={handleChange}>
                  <option value="" disabled>Select Grade</option>
                  <option value="9">9th Grade</option>
                  <option value="10">10th Grade</option>
                  <option value="11">11th Grade</option>
                  <option value="12">12th Grade</option>
                  <option value="College">College</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div className="rs-v-signup__field">
              <label>Select Chapter</label>
              <select name="chapterId" required value={formData.chapterId} onChange={handleChange}>
                <option value="" disabled>Select your local chapter</option>
                {chapters.map(chapter => (
                  <option key={chapter.id} value={chapter.id}>
                    {chapter.chapterName}
                  </option>
                ))}
              </select>
              <div className="rs-v-signup__help">
                <span>Don't see your school listed?</span>
                <a href="https://forms.google.com/your-form-link" target="_blank" rel="noreferrer" className="rs-v-signup__start-link">Start a Chapter</a>
              </div>
            </div>

            <button type="submit" className="rs-v-signup__btn" disabled={loading}>
              {loading ? 'Creating Account...' : 'Sign Up'}
            </button>
          </form>

          <div className="rs-v-signup__footer">
            Already have an account? <button onClick={() => navigate('/volunteer-login')} className="rs-v-signup__login-link">Log In</button>
          </div>
        </motion.div>
      </div>

      <style>{`
        .rs-v-signup {
          min-height: 100vh;
          background: var(--bg-dark);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: calc(80px + 2rem) 1rem 2rem;
        }

        .rs-v-signup__inner {
          width: 100%;
          max-width: 500px;
        }

        .rs-v-signup__box {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 20px;
          padding: 2.5rem;
          backdrop-filter: blur(10px);
        }

        .rs-v-signup__header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .rs-v-signup__title {
          font-family: 'Fraunces', serif;
          font-size: 2rem;
          color: white;
          margin-bottom: 0.5rem;
        }

        .rs-v-signup__subtitle {
          font-family: 'Inter', sans-serif;
          color: rgba(255,255,255,0.6);
          font-size: 0.95rem;
        }

        .rs-v-signup__error {
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

        .rs-v-signup__form {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .rs-v-signup__row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        .rs-v-signup__field {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .rs-v-signup__field label {
          font-family: 'Inter', sans-serif;
          font-size: 0.85rem;
          font-weight: 500;
          color: rgba(255,255,255,0.8);
        }

        .rs-v-signup__field input,
        .rs-v-signup__field select {
          background: rgba(0,0,0,0.2);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 8px;
          padding: 12px 14px;
          color: white;
          font-family: 'Inter', sans-serif;
          font-size: 0.95rem;
          transition: border-color 0.2s;
        }

        .rs-v-signup__field input:focus,
        .rs-v-signup__field select:focus {
          outline: none;
          border-color: var(--rs-teal);
        }

        .rs-v-signup__field select option {
          background: var(--bg-dark);
          color: white;
        }

        .rs-v-signup__help {
          display: flex;
          justify-content: space-between;
          margin-top: 8px;
          font-family: 'Inter', sans-serif;
          font-size: 0.8rem;
          color: rgba(255,255,255,0.5);
        }

        .rs-v-signup__start-link {
          color: var(--rs-orange);
          text-decoration: none;
          font-weight: 500;
        }

        .rs-v-signup__start-link:hover {
          text-decoration: underline;
        }

        .rs-v-signup__btn {
          background: var(--rs-teal);
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

        .rs-v-signup__btn:hover:not(:disabled) {
          background: #236565;
        }

        .rs-v-signup__btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .rs-v-signup__footer {
          margin-top: 2rem;
          text-align: center;
          font-family: 'Inter', sans-serif;
          font-size: 0.9rem;
          color: rgba(255,255,255,0.6);
        }

        .rs-v-signup__login-link {
          background: none;
          border: none;
          color: var(--rs-teal);
          font-weight: 600;
          cursor: pointer;
          padding: 0;
          margin-left: 4px;
        }
        .rs-v-signup__login-link:hover {
          text-decoration: underline;
        }

        @media (max-width: 480px) {
          .rs-v-signup__box { padding: 1.5rem; }
          .rs-v-signup__row { grid-template-columns: 1fr; }
        }
      `}</style>
    </section>
  );
};

export default VolunteerSignup;
