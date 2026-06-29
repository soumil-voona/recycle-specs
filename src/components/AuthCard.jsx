import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { motion, AnimatePresence } from 'motion/react';
import { doc, getDoc, setDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { uploadToCloudinary } from '../utils/cloudinary';

export default function AuthCard({ initialTab = 'login' }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, signup, signInWithGoogle, logout } = useAuth();

  // Mode states: 'login' | 'signup' | 'google-onboarding'
  const [mode, setMode] = useState(initialTab);
  
  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [chapterId, setChapterId] = useState('');
  const [profilePic, setProfilePic] = useState(null);
  const [profilePicPreview, setProfilePicPreview] = useState(null);

  // Google Onboarding specific states
  const [googleUser, setGoogleUser] = useState(null);
  const [googleName, setGoogleName] = useState('');

  // Common UI states
  const [chapters, setChapters] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const redirectMessage = location.state?.message;

  // Fetch approved chapters from Firestore
  useEffect(() => {
    const fetchChapters = async () => {
      try {
        const q = query(collection(db, 'chapters'), where('approved', '==', true));
        const snapshot = await getDocs(q);
        const chapterList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        chapterList.sort((a, b) => 
          (a.displayName || a.chapterName || a.id || '').localeCompare(
            b.displayName || b.chapterName || b.id || ''
          )
        );
        setChapters(chapterList);
      } catch (err) {
        console.error('Error fetching chapters:', err);
      }
    };
    fetchChapters();
  }, []);

  // Set mode if the prop changes
  useEffect(() => {
    setMode(initialTab);
    setError('');
  }, [initialTab]);

  // Handle Profile Pic Preview
  function handleProfilePicChange(e) {
    const file = e.target.files[0];
    if (file) {
      setProfilePic(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  }

  // Handle normal Email/Password Submit
  async function handleEmailAuthSubmit(e) {
    e.preventDefault();
    setError('');

    if (mode === 'login') {
      try {
        setLoading(true);
        const userCredential = await login(email, password);
        const userUid = userCredential.user.uid;
        const userEmail = userCredential.user.email;

        // Check/promote to lead/founding member
        let isChapterLead = false;
        let isFoundingMember = false;

        const userDoc = await getDoc(doc(db, 'users', userUid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          isChapterLead = userData.chapterLead || false;
          isFoundingMember = userData.foundingMember || false;

          const currentChapterId = userData.chapterId;
          if (currentChapterId) {
            const chapterDoc = await getDoc(doc(db, 'chapters', currentChapterId));
            if (chapterDoc.exists()) {
              const chapterData = chapterDoc.data();
              if (chapterData.leadEmailsPending) {
                const pendingEmails = chapterData.leadEmailsPending.split(',').map(e => e.trim().toLowerCase());
                if (pendingEmails.includes(userEmail.trim().toLowerCase())) {
                  isChapterLead = true;
                }
              }
              isFoundingMember = isChapterLead && (chapterData.foundingChapter || currentChapterId === 'coppell');
            }
          }
        }

        await setDoc(doc(db, 'users', userUid), {
          email: userEmail,
          chapterLead: isChapterLead,
          foundingMember: isFoundingMember,
          updatedAt: new Date().toISOString()
        }, { merge: true });

        navigate('/volunteers');
      } catch (err) {
        console.error(err);
        setError('Failed to log in. Please check your credentials.');
      } finally {
        setLoading(false);
      }
    } else {
      // Signup Mode
      if (!firstName.trim() || !lastName.trim()) {
        return setError('Please enter your first and last name.');
      }
      if (password !== confirmPassword) {
        return setError('Passwords do not match.');
      }
      if (password.length < 6) {
        return setError('Password must be at least 6 characters.');
      }
      if (!chapterId) {
        return setError('Please select a local chapter.');
      }

      try {
        setLoading(true);
        let profilePicUrl = '';
        if (profilePic) {
          const uploadResult = await uploadToCloudinary(profilePic);
          profilePicUrl = uploadResult.url;
        }

        const userCredential = await signup(email, password);
        const selectedChapter = chapters.find(c => c.id === chapterId);
        const chapterName = selectedChapter ? selectedChapter.displayName || selectedChapter.chapterName : '';

        // Check if user is a lead from the pending list
        let isChapterLead = false;
        if (selectedChapter && selectedChapter.leadEmailsPending) {
          const pendingEmails = selectedChapter.leadEmailsPending.split(',').map(e => e.trim().toLowerCase());
          if (pendingEmails.includes(email.trim().toLowerCase())) {
            isChapterLead = true;
          }
        }
        const isFoundingMember = isChapterLead && (selectedChapter ? selectedChapter.foundingChapter || selectedChapter.id === 'coppell' : false);

        // Save user record
        await setDoc(doc(db, 'users', userCredential.user.uid), {
          uid: userCredential.user.uid,
          name: `${firstName.trim()} ${lastName.trim()}`,
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          email: email,
          chapterId: chapterId,
          chapterName: chapterName,
          role: 'volunteer',
          chapterLead: isChapterLead,
          foundingMember: isFoundingMember,
          profilePictureUrl: profilePicUrl,
          createdAt: new Date().toISOString()
        });

        // Save volunteer record
        await setDoc(doc(db, 'volunteers', userCredential.user.uid), {
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          email: email,
          school: 'N/A',
          grade: 'N/A',
          chapterId: chapterId,
          volunteerHours: 0,
          profilePictureUrl: profilePicUrl,
          createdAt: new Date().toISOString()
        });

        navigate('/volunteers');
      } catch (err) {
        console.error(err);
        if (err.code === 'auth/email-already-in-use') {
          setError('Email already in use.');
        } else if (err.code === 'auth/invalid-email') {
          setError('Invalid email address.');
        } else if (err.code === 'auth/weak-password') {
          setError('Password is too weak.');
        } else {
          setError('Failed to create an account.');
        }
      } finally {
        setLoading(false);
      }
    }
  }

  // Handle Google Sign In / Registration Onboarding
  async function handleGoogleSignInFlow() {
    setError('');
    setLoading(true);

    try {
      const userCredential = await signInWithGoogle();
      const user = userCredential.user;
      
      const userDoc = await getDoc(doc(db, 'users', user.uid));

      if (userDoc.exists()) {
        // User already has a profile! Log them in directly.
        const userData = userDoc.data();
        let isChapterLead = userData.chapterLead || false;
        let isFoundingMember = userData.foundingMember || false;

        const currentChapterId = userData.chapterId;
        if (currentChapterId) {
          const chapterDoc = await getDoc(doc(db, 'chapters', currentChapterId));
          if (chapterDoc.exists()) {
            const chapterData = chapterDoc.data();
            if (chapterData.leadEmailsPending && user.email) {
              const pendingEmails = chapterData.leadEmailsPending.split(',').map(e => e.trim().toLowerCase());
              if (pendingEmails.includes(user.email.trim().toLowerCase())) {
                isChapterLead = true;
              }
            }
            isFoundingMember = isChapterLead && (chapterData.foundingChapter || currentChapterId === 'coppell');
          }
        }

        await setDoc(doc(db, 'users', user.uid), {
          email: user.email,
          chapterLead: isChapterLead,
          foundingMember: isFoundingMember,
          updatedAt: new Date().toISOString()
        }, { merge: true });

        setLoading(false);
        navigate('/volunteers');
      } else {
        // New User! Instead of logging them out, transition to Google Onboarding.
        setGoogleUser(user);
        setGoogleName(user.displayName || '');
        setMode('google-onboarding');
        setLoading(false);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to sign in with Google.');
      setLoading(false);
    }
  }

  // Handle the completion of Google profile registration
  async function handleGoogleOnboardingSubmit(e) {
    e.preventDefault();
    setError('');

    if (!googleName.trim()) {
      return setError('Please enter your name.');
    }
    if (!chapterId) {
      return setError('Please select a local chapter.');
    }

    try {
      setLoading(true);
      const user = googleUser;
      const displayName = googleName.trim();
      const nameParts = displayName.split(' ');
      const gFirstName = nameParts[0] || '';
      const gLastName = nameParts.slice(1).join(' ') || '';

      const selectedChapter = chapters.find(c => c.id === chapterId);
      const chapterName = selectedChapter ? selectedChapter.displayName || selectedChapter.chapterName : '';

      let isChapterLead = false;
      if (selectedChapter && selectedChapter.leadEmailsPending && user.email) {
        const pendingEmails = selectedChapter.leadEmailsPending.split(',').map(e => e.trim().toLowerCase());
        if (pendingEmails.includes(user.email.trim().toLowerCase())) {
          isChapterLead = true;
        }
      }
      const isFoundingMember = isChapterLead && (selectedChapter ? selectedChapter.foundingChapter || selectedChapter.id === 'coppell' : false);

      // Create users collection document
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        name: displayName,
        firstName: gFirstName,
        lastName: gLastName,
        email: user.email,
        chapterId: chapterId,
        chapterName: chapterName,
        role: 'volunteer',
        chapterLead: isChapterLead,
        foundingMember: isFoundingMember,
        profilePictureUrl: user.photoURL || '',
        createdAt: new Date().toISOString()
      });

      // Create volunteers collection document
      await setDoc(doc(db, 'volunteers', user.uid), {
        firstName: gFirstName,
        lastName: gLastName,
        email: user.email,
        school: 'N/A',
        grade: 'N/A',
        chapterId: chapterId,
        volunteerHours: 0,
        profilePictureUrl: user.photoURL || '',
        createdAt: new Date().toISOString()
      });

      navigate('/volunteers');
    } catch (err) {
      console.error(err);
      setError('Failed to complete onboarding. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  // Cancel/restart Auth from Google Onboarding
  async function handleOnboardingCancel() {
    setLoading(true);
    try {
      await logout();
    } catch (err) {
      console.error(err);
    }
    setGoogleUser(null);
    setMode('login');
    setLoading(false);
  }

  return (
    <div className="rs-auth-card">
      {/* Ambient background animations */}
      <div className="rs-auth-bg-orbs" aria-hidden="true">
        <div className="rs-auth-orb rs-auth-orb-a" />
        <div className="rs-auth-orb rs-auth-orb-b" />
      </div>

      {/* Left Visual Column */}
      <div className="rs-auth-visual">
        <div className="rs-auth-visual__header">
          <img src="/imgs/logo.png" alt="RecycleSpecs Logo" className="rs-auth-visual__logo" />
          <div>
            <div className="rs-auth-visual__brand-name">RecycleSpecs</div>
            <div className="rs-auth-visual__brand-tagline">Optical Access</div>
          </div>
        </div>

        <div className="rs-auth-visual__content">
          <h2 className="rs-auth-visual__title">
            Help Others<br />See Their <em>Future.</em>
          </h2>
          <p className="rs-auth-visual__desc">
            Join the youth-led movement restoring vision across communities worldwide. Sign in to log service hours, join events, and manage your local chapter.
          </p>
        </div>

        <div className="rs-auth-visual__footer">
          © {new Date().getFullYear()} RecycleSpecs. All rights reserved.
        </div>
      </div>

      {/* Right Form Column */}
      <div className="rs-auth-form-panel">
        <AnimatePresence mode="wait">
          {mode === 'google-onboarding' ? (
            <motion.div
              key="google-onboarding"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
              className="rs-auth-onboarding"
            >
              <div className="rs-auth-onboarding__title">Complete Profile</div>
              <p className="rs-auth-onboarding__desc">
                Welcome to RecycleSpecs! Tell us which local chapter you belong to to finish setting up your account.
              </p>

              {error && <div className="rs-auth-error">{error}</div>}

              {googleUser && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', width: '100%', background: 'rgba(0,0,0,0.02)', padding: '12px 16px', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.06)', marginBottom: '1.5rem' }}>
                  <img src={googleUser.photoURL || '/imgs/logo.png'} alt="Google Avatar" style={{ width: '46px', height: '46px', borderRadius: '50%', objectFit: 'cover', border: '2px solid white', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }} />
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.95rem' }}>{googleUser.email}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Signed in with Google</div>
                  </div>
                </div>
              )}

              <form onSubmit={handleGoogleOnboardingSubmit} className="rs-auth-form" style={{ width: '100%' }}>
                <div className="rs-auth-field">
                  <label htmlFor="google-name">Your Full Name</label>
                  <input
                    id="google-name"
                    type="text"
                    className="rs-auth-input"
                    value={googleName}
                    onChange={(e) => setGoogleName(e.target.value)}
                    required
                  />
                </div>

                <div className="rs-auth-field">
                  <label htmlFor="google-chapter">Select Chapter</label>
                  <select
                    id="google-chapter"
                    className="rs-auth-input rs-auth-select"
                    value={chapterId}
                    onChange={(e) => setChapterId(e.target.value)}
                    required
                  >
                    <option value="" disabled>Select your local chapter</option>
                    {chapters.map(chapter => (
                      <option key={chapter.id} value={chapter.id}>
                        {chapter.displayName || chapter.chapterName || chapter.id}
                      </option>
                    ))}
                  </select>
                </div>

                <button type="submit" className="rs-auth-btn-primary" disabled={loading}>
                  {loading ? 'Completing Setup...' : 'Finish Registration'}
                </button>

                <button type="button" className="rs-auth-toggle-link" onClick={handleOnboardingCancel} style={{ marginTop: '1rem' }}>
                  Cancel and Sign Out
                </button>
              </form>
            </motion.div>
          ) : (
            <motion.div
              key={mode}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
              style={{ width: '100%' }}
            >
              {/* Tab Navigation */}
              <div className="rs-auth-tabs">
                <button
                  className={`rs-auth-tab-btn ${mode === 'login' ? 'active' : ''}`}
                  onClick={() => {
                    setMode('login');
                    setError('');
                    navigate('/login');
                  }}
                >
                  Log In
                </button>
                <button
                  className={`rs-auth-tab-btn ${mode === 'signup' ? 'active' : ''}`}
                  onClick={() => {
                    setMode('signup');
                    setError('');
                    navigate('/signup');
                  }}
                >
                  Join Us
                </button>
              </div>

              {redirectMessage && <div className="rs-auth-message">{redirectMessage}</div>}
              {error && <div className="rs-auth-error">{error}</div>}

              {/* Email Form */}
              <form onSubmit={handleEmailAuthSubmit} className="rs-auth-form">
                {mode === 'signup' && (
                  <>
                    {/* Avatar Upload */}
                    <div className="rs-auth-avatar-uploader">
                      <div className="rs-auth-avatar-preview">
                        {profilePicPreview ? (
                          <img src={profilePicPreview} alt="Profile Preview" />
                        ) : (
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                            <polyline points="17 8 12 3 7 8"></polyline>
                            <line x1="12" y1="3" x2="12" y2="15"></line>
                          </svg>
                        )}
                      </div>
                      <label className="rs-auth-avatar-label">
                        <span>Upload photo</span>
                        File types: JPG, PNG (Optional)
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleProfilePicChange}
                          style={{ display: 'none' }}
                        />
                      </label>
                    </div>

                    {/* Name Fields */}
                    <div className="rs-auth-form-row">
                      <div className="rs-auth-field">
                        <label htmlFor="signup-firstname">First Name</label>
                        <input
                          id="signup-firstname"
                          type="text"
                          className="rs-auth-input"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          required
                        />
                      </div>
                      <div className="rs-auth-field">
                        <label htmlFor="signup-lastname">Last Name</label>
                        <input
                          id="signup-lastname"
                          type="text"
                          className="rs-auth-input"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                  </>
                )}

                {/* Email Field */}
                <div className="rs-auth-field">
                  <label htmlFor="auth-email">Email</label>
                  <input
                    id="auth-email"
                    type="email"
                    className="rs-auth-input"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                {/* Password Fields */}
                {mode === 'signup' ? (
                  <div className="rs-auth-form-row">
                    <div className="rs-auth-field">
                      <label htmlFor="auth-password">Password</label>
                      <input
                        id="auth-password"
                        type="password"
                        className="rs-auth-input"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>
                    <div className="rs-auth-field">
                      <label htmlFor="auth-confirmpassword">Confirm Password</label>
                      <input
                        id="auth-confirmpassword"
                        type="password"
                        className="rs-auth-input"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                ) : (
                  <div className="rs-auth-field">
                    <label htmlFor="auth-password">Password</label>
                    <input
                      id="auth-password"
                      type="password"
                      className="rs-auth-input"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                )}

                {/* Chapter Select dropdown */}
                {mode === 'signup' && (
                  <div className="rs-auth-field">
                    <label htmlFor="auth-chapter">Select Local Chapter</label>
                    <select
                      id="auth-chapter"
                      className="rs-auth-input rs-auth-select"
                      value={chapterId}
                      onChange={(e) => setChapterId(e.target.value)}
                      required
                    >
                      <option value="" disabled>Select your local chapter</option>
                      {chapters.map(chapter => (
                        <option key={chapter.id} value={chapter.id}>
                          {chapter.displayName || chapter.chapterName || chapter.id}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <button type="submit" className="rs-auth-btn-primary" disabled={loading}>
                  {loading 
                    ? (mode === 'login' ? 'Logging in...' : 'Registering...') 
                    : (mode === 'login' ? 'Log In' : 'Sign Up')
                  }
                </button>
              </form>

              <div className="rs-auth-divider">OR</div>

              {/* Google Auth Button */}
              <button
                type="button"
                className="rs-auth-btn-google"
                onClick={handleGoogleSignInFlow}
                disabled={loading}
              >
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <path d="M17.64 9.20443C17.64 8.56625 17.5827 7.95262 17.4764 7.36353H9V10.8449H13.8436C13.635 11.9699 13.0009 12.9231 12.0477 13.5613V15.8194H14.9564C16.6582 14.2526 17.64 11.9453 17.64 9.20443Z" fill="#4285F4"/>
                  <path d="M9 18C11.43 18 13.4673 17.1941 14.9564 15.8195L12.0477 13.5613C11.2418 14.1013 10.2109 14.4204 9 14.4204C6.65591 14.4204 4.67182 12.8372 3.96409 10.71H0.957275V13.0418C2.43818 15.9831 5.48182 18 9 18Z" fill="#34A853"/>
                  <path d="M3.96409 10.7098C3.78409 10.1698 3.68182 9.59301 3.68182 8.99983C3.68182 8.40665 3.78409 7.82983 3.96409 7.28983V4.95801H0.957273C0.347727 6.17301 0 7.54756 0 8.99983C0 10.4521 0.347727 11.8266 0.957273 13.0416L3.96409 10.7098Z" fill="#FBBC05"/>
                  <path d="M9 3.57955C10.3214 3.57955 11.5077 4.03364 12.4405 4.92545L15.0218 2.34409C13.4632 0.891818 11.4259 0 9 0C5.48182 0 2.43818 2.01682 0.957275 4.95818L3.96409 7.29C4.67182 5.16273 6.65591 3.57955 9 3.57955Z" fill="#EA4335"/>
                </svg>
                <span>Continue with Google</span>
              </button>

              <div className="rs-auth-toggle-prompt">
                {mode === 'login' ? (
                  <>
                    Don't have an account?{' '}
                    <button
                      type="button"
                      className="rs-auth-toggle-link"
                      onClick={() => {
                        setMode('signup');
                        setError('');
                        navigate('/signup');
                      }}
                    >
                      Sign up
                    </button>
                  </>
                ) : (
                  <>
                    Already have an account?{' '}
                    <button
                      type="button"
                      className="rs-auth-toggle-link"
                      onClick={() => {
                        setMode('login');
                        setError('');
                        navigate('/login');
                      }}
                    >
                      Log in
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
