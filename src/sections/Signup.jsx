import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';

function Signup() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup, signInWithGoogle } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();

    if (!firstName.trim() || !lastName.trim()) {
      return setError('Please enter your first and last name');
    }

    if (password !== confirmPassword) {
      return setError('Passwords do not match');
    }

    if (password.length < 6) {
      return setError('Password must be at least 6 characters');
    }

    try {
      setError('');
      setLoading(true);
      const userCredential = await signup(email, password);
      
      // Save user data to Firestore
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email,
        createdAt: new Date().toISOString()
      });
      
      navigate('/volunteers');
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        setError('Email already in use');
      } else if (error.code === 'auth/invalid-email') {
        setError('Invalid email address');
      } else if (error.code === 'auth/weak-password') {
        setError('Password is too weak');
      } else {
        setError('Failed to create an account');
      }
      console.error(error);
    }

    setLoading(false);
  }

  async function handleGoogleSignIn() {
    try {
      setError('');
      setLoading(true);
      const userCredential = await signInWithGoogle();
      
      // Save user data to Firestore (using display name from Google)
      const user = userCredential.user;
      const displayName = user.displayName || '';
      const nameParts = displayName.split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';
      
      await setDoc(doc(db, 'users', user.uid), {
        firstName: firstName,
        lastName: lastName,
        email: user.email,
        createdAt: new Date().toISOString()
      }, { merge: true }); // merge: true to not overwrite if user already exists
      
      navigate('/volunteers');
    } catch (error) {
      setError('Failed to sign in with Google.');
      console.error(error);
      setLoading(false);
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      paddingTop: '100px',
      background: 'linear-gradient(135deg, rgba(45, 125, 125, 0.05), rgba(196, 93, 7, 0.05))'
    }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{
          background: 'white',
          padding: '3rem',
          borderRadius: '1.5rem',
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
          maxWidth: '450px',
          width: '100%'
        }}
      >
        <h1 style={{
          fontFamily: "'DM Serif Text', serif",
          fontSize: '2.5rem',
          marginBottom: '0.5rem',
          color: '#2d2d2d',
          textAlign: 'center'
        }}>
          Join Us
        </h1>
        
        <p style={{
          fontFamily: "'Segoe UI', sans-serif",
          fontSize: '1rem',
          color: '#666',
          textAlign: 'center',
          marginBottom: '2rem'
        }}>
          Create an account to become a volunteer
        </p>

        {error && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            style={{
              background: '#fee',
              color: '#c00',
              padding: '0.75rem',
              borderRadius: '0.5rem',
              marginBottom: '1.5rem',
              fontSize: '0.9rem',
              fontFamily: "'Segoe UI', sans-serif"
            }}
          >
            {error}
          </motion.div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
            <div>
              <label style={{
                display: 'block',
                fontFamily: "'Segoe UI', sans-serif",
                fontSize: '0.9rem',
                fontWeight: 600,
                color: '#333',
                marginBottom: '0.5rem'
              }}>
                First Name
              </label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: '0.5rem',
                  border: '2px solid #e0e0e0',
                  fontSize: '1rem',
                  fontFamily: "'Segoe UI', sans-serif",
                  transition: 'border-color 0.3s ease',
                  boxSizing: 'border-box'
                }}
                onFocus={(e) => e.target.style.borderColor = '#c65d07'}
                onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
              />
            </div>
            <div>
              <label style={{
                display: 'block',
                fontFamily: "'Segoe UI', sans-serif",
                fontSize: '0.9rem',
                fontWeight: 600,
                color: '#333',
                marginBottom: '0.5rem'
              }}>
                Last Name
              </label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: '0.5rem',
                  border: '2px solid #e0e0e0',
                  fontSize: '1rem',
                  fontFamily: "'Segoe UI', sans-serif",
                  transition: 'border-color 0.3s ease',
                  boxSizing: 'border-box'
                }}
                onFocus={(e) => e.target.style.borderColor = '#c65d07'}
                onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
              />
            </div>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'block',
              fontFamily: "'Segoe UI', sans-serif",
              fontSize: '0.9rem',
              fontWeight: 600,
              color: '#333',
              marginBottom: '0.5rem'
            }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: '0.5rem',
                border: '2px solid #e0e0e0',
                fontSize: '1rem',
                fontFamily: "'Segoe UI', sans-serif",
                transition: 'border-color 0.3s ease',
                boxSizing: 'border-box',
                color: '#333'
              }}
              onFocus={(e) => e.target.style.borderColor = '#c65d07'}
              onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
            />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'block',
              fontFamily: "'Segoe UI', sans-serif",
              fontSize: '0.9rem',
              fontWeight: 600,
              color: '#333',
              marginBottom: '0.5rem'
            }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: '0.5rem',
                border: '2px solid #e0e0e0',
                fontSize: '1rem',
                fontFamily: "'Segoe UI', sans-serif",
                transition: 'border-color 0.3s ease',
                boxSizing: 'border-box'
              }}
              onFocus={(e) => e.target.style.borderColor = '#c65d07'}
              onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
            />
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <label style={{
              display: 'block',
              fontFamily: "'Segoe UI', sans-serif",
              fontSize: '0.9rem',
              fontWeight: 600,
              color: '#333',
              marginBottom: '0.5rem'
            }}>
              Confirm Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: '0.5rem',
                border: '2px solid #e0e0e0',
                fontSize: '1rem',
                fontFamily: "'Segoe UI', sans-serif",
                transition: 'border-color 0.3s ease',
                boxSizing: 'border-box'
              }}
              onFocus={(e) => e.target.style.borderColor = '#c65d07'}
              onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '1rem',
              background: loading ? '#ccc' : 'linear-gradient(135deg, #c65d07, #e6b800)',
              color: 'white',
              border: 'none',
              borderRadius: '0.75rem',
              fontSize: '1.1rem',
              fontWeight: 600,
              fontFamily: "'Segoe UI', sans-serif",
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: loading ? 'none' : '0 4px 15px rgba(198, 93, 7, 0.3)'
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 6px 20px rgba(198, 93, 7, 0.4)';
              }
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 4px 15px rgba(198, 93, 7, 0.3)';
            }}
          >
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          margin: '1.5rem 0',
          color: '#999'
        }}>
          <div style={{ flex: 1, height: '1px', background: '#e0e0e0' }} />
          <span style={{ fontFamily: "'Segoe UI', sans-serif", fontSize: '0.9rem' }}>OR</span>
          <div style={{ flex: 1, height: '1px', background: '#e0e0e0' }} />
        </div>

        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={loading}
          style={{
            width: '100%',
            padding: '1rem',
            background: 'white',
            color: '#333',
            border: '2px solid #e0e0e0',
            borderRadius: '0.75rem',
            fontSize: '1rem',
            fontWeight: 600,
            fontFamily: "'Segoe UI', sans-serif",
            cursor: loading ? 'not-allowed' : 'pointer',
            transition: 'all 0.3s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.75rem'
          }}
          onMouseEnter={(e) => {
            if (!loading) {
              e.target.style.borderColor = '#c65d07';
              e.target.style.background = '#fafafa';
            }
          }}
          onMouseLeave={(e) => {
            e.target.style.borderColor = '#e0e0e0';
            e.target.style.background = 'white';
          }}
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M17.64 9.20443C17.64 8.56625 17.5827 7.95262 17.4764 7.36353H9V10.8449H13.8436C13.635 11.9699 13.0009 12.9231 12.0477 13.5613V15.8194H14.9564C16.6582 14.2526 17.64 11.9453 17.64 9.20443Z" fill="#4285F4"/>
            <path d="M9 18C11.43 18 13.4673 17.1941 14.9564 15.8195L12.0477 13.5613C11.2418 14.1013 10.2109 14.4204 9 14.4204C6.65591 14.4204 4.67182 12.8372 3.96409 10.71H0.957275V13.0418C2.43818 15.9831 5.48182 18 9 18Z" fill="#34A853"/>
            <path d="M3.96409 10.7098C3.78409 10.1698 3.68182 9.59301 3.68182 8.99983C3.68182 8.40665 3.78409 7.82983 3.96409 7.28983V4.95801H0.957273C0.347727 6.17301 0 7.54756 0 8.99983C0 10.4521 0.347727 11.8266 0.957273 13.0416L3.96409 10.7098Z" fill="#FBBC05"/>
            <path d="M9 3.57955C10.3214 3.57955 11.5077 4.03364 12.4405 4.92545L15.0218 2.34409C13.4632 0.891818 11.4259 0 9 0C5.48182 0 2.43818 2.01682 0.957275 4.95818L3.96409 7.29C4.67182 5.16273 6.65591 3.57955 9 3.57955Z" fill="#EA4335"/>
          </svg>
          {loading ? 'Signing in...' : 'Continue with Google'}
        </button>

        <p style={{
          marginTop: '1.5rem',
          textAlign: 'center',
          fontFamily: "'Segoe UI', sans-serif",
          fontSize: '0.95rem',
          color: '#666'
        }}>
          Already have an account?{' '}
          <Link
            to="/volunteer-login"
            style={{
              color: '#c65d07',
              textDecoration: 'none',
              fontWeight: 600
            }}
            onMouseEnter={(e) => e.target.style.textDecoration = 'underline'}
            onMouseLeave={(e) => e.target.style.textDecoration = 'none'}
          >
            Log in
          </Link>
        </p>
      </motion.div>
    </div>
  );
}

export default Signup;
