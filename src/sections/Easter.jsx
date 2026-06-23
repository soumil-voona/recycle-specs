import { motion } from 'framer-motion'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { collection, addDoc } from 'firebase/firestore'
import { db } from '../firebase'
import { uploadToCloudinary } from '../utils/cloudinary'

function Easter() {
  const navigate = useNavigate()
  const [childName, setChildName] = useState('')
  const [email, setEmail] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [screenshotFile, setScreenshotFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [uploadMessage, setUploadMessage] = useState('')
  const [messageType, setMessageType] = useState('') // 'success' or 'error'
  const [submitted, setSubmitted] = useState(false)

  const PAYPAL_EMAIL = '_' // You'll fill this in later

  function formatPhoneNumber(value) {
    // Remove all non-digits
    const digits = value.replace(/\D/g, '')
    
    // Format as (XXX) XXX-XXXX
    if (digits.length <= 3) {
      return digits
    } else if (digits.length <= 6) {
      return `(${digits.slice(0, 3)}) ${digits.slice(3)}`
    } else {
      return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`
    }
  }

  function handlePhoneChange(e) {
    const formatted = formatPhoneNumber(e.target.value)
    setPhoneNumber(formatted)
  }

  function handleImageChange(e) {
    const file = e.target.files[0]
    if (file) {
      setScreenshotFile(file)
      // Create preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setUploading(true)
    setUploadMessage('')
    setMessageType('')

    try {
      // Validate inputs
      if (!childName || !email || !phoneNumber || !screenshotFile) {
        setUploadMessage('Please fill in all fields and upload a screenshot.')
        setMessageType('error')
        setUploading(false)
        return
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(email)) {
        setUploadMessage('Please enter a valid email address.')
        setMessageType('error')
        setUploading(false)
        return
      }

      // Validate phone format (basic validation)
      const phoneDigits = phoneNumber.replace(/\D/g, '')
      if (phoneDigits.length < 10) {
        setUploadMessage('Please enter a valid phone number (at least 10 digits).')
        setMessageType('error')
        setUploading(false)
        return
      }

      // Upload screenshot to Cloudinary
      setUploadMessage('Uploading screenshot...')
      const uploadResult = await uploadToCloudinary(screenshotFile)
      const screenshotUrl = uploadResult.url
      const screenshotPublicId = uploadResult.publicId

      // Save signup to Firestore
      setUploadMessage('Processing your signup...')
      await addDoc(collection(db, 'easterSignups'), {
        childName: childName,
        email: email,
        phoneNumber: phoneNumber,
        screenshotUrl: screenshotUrl,
        screenshotPublicId: screenshotPublicId,
        signedUpAt: new Date().toISOString()
      })

      setUploadMessage('Thank you for signing up! We\'ll see you at the Easter event!')
      setMessageType('success')
      setSubmitted(true)

      // Reset form
      setChildName('')
      setEmail('')
      setPhoneNumber('')
      setScreenshotFile(null)
      setImagePreview(null)

      setTimeout(() => {
        navigate('/')
      }, 1500)
    } catch (error) {
      console.error('Error signing up:', error)
      setUploadMessage('Error processing signup. Please try again.')
      setMessageType('error')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        padding: '2rem',
        paddingTop: '80px',
        background: 'rgba(45, 125, 125, 0.05)'
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        style={{
          maxWidth: '600px',
          margin: '0 auto'
        }}
      >
        {/* Event Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          style={{
            textAlign: 'center',
            marginBottom: '3rem'
          }}
        >
          <h1
            style={{
              fontFamily: "'DM Serif Text', serif",
              fontSize: 'clamp(2rem, 5vw, 3.5rem)',
              color: '#2d2d2d',
              marginBottom: '0.5rem',
              fontWeight: 700
            }}
          >
            Easter Event
          </h1>
          <p
            style={{
              fontFamily: "'Segoe UI', sans-serif",
              fontSize: '1.1rem',
              color: '#666',
              marginBottom: '1.5rem'
            }}
          >
            Join us for a fun-filled Easter celebration! Sign up to participate. Contact <a href="mailto:recycle.specs@gmail.com">recycle.specs@gmail.com</a> for more information.
          </p>
        </motion.div>

        {/* Event Information */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          style={{
            background: 'white',
            padding: '1.5rem',
            borderRadius: '1rem',
            marginBottom: '2rem',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            border: '2px solid rgba(198, 93, 7, 0.1)'
          }}
        >
          <h3
            style={{
              fontFamily: "'DM Serif Text', serif",
              fontSize: '1.3rem',
              color: '#2d2d2d',
              marginTop: 0,
              marginBottom: '1rem'
            }}
          >
            Event Details
          </h3>
          <div
            style={{
              display: 'grid',
              gap: '1rem',
              fontSize: '0.95rem',
              color: '#555',
              fontFamily: "'Segoe UI', sans-serif"
            }}
          >
            <div>
              <strong style={{ color: '#c65d07' }}>When:</strong> Good Friday (04/03/2026) @ 5:00 pm - 7:00 pm
            </div>
            <div>
              <strong style={{ color: '#c65d07' }}>Where:</strong> Small pool The Palmer @ Las Colinas<br />(2940 W Royal Ln, Irving, TX 75063)
            </div>
            <div>
              <strong style={{ color: '#c65d07' }}>Entry:</strong> $5 early signup (through paypal to 945-249-2128) or $8 at the door
            </div>
            <div>
            <a
              href={"https://www.paypal.com/ncp/payment/KGV4KZGYBGN7Q"}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-block',
                width: 'fit-content',
                padding: '0.65rem 1.2rem',
                background: 'var(--rs-orange)',
                color: '#fff',
                borderRadius: '0.5rem',
                textDecoration: 'none',
                fontWeight: 600,
                fontFamily: "'Segoe UI', sans-serif",
                fontSize: '0.95rem'
              }}
            >
              Pay with PayPal
            </a>
            </div>
            <div style={{ marginTop: '0.5rem', color: '#666', fontSize: '0.9rem' }}>
              Please take a screenshot of your PayPal payment as proof of registration.
            </div>
            <p style={{ marginTop: '0.5rem', lineHeight: 1.6 }}>
              Join us for a fun-filled In-Water Easter Egg Hunt Fundraiser hosted by RecycleSpecs at Palmer's Pool in Las Colinas! On Friday, April 3rd from 5 p.m. to 7 p.m., kids and families can enjoy diving for eggs in the pool, collecting treats, and celebrating Easter in a unique way. There will be exciting extras like face painting and a Kona Ice truck, plus concessions available on-site. All proceeds go toward supporting RecycleSpecs' mission of providing eyecare access to underserved communities. Come out, have fun, and make an impact!
            </p>
          </div>
        </motion.div>

        {/* Signup Form */}
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          style={{
            background: 'white',
            padding: '2rem',
            borderRadius: '1rem',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            border: '2px solid rgba(198, 93, 7, 0.1)'
          }}
        >
          <h3
            style={{
              fontFamily: "'DM Serif Text', serif",
              fontSize: '1.3rem',
              color: '#2d2d2d',
              marginTop: 0,
              marginBottom: '1.5rem'
            }}
          >
            Sign Up Now
          </h3>

          {/* Child Name Field */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label
              style={{
                display: 'block',
                fontFamily: "'Segoe UI', sans-serif",
                fontSize: '0.95rem',
                color: '#2d2d2d',
                marginBottom: '0.5rem',
                fontWeight: 600
              }}
            >
              Child Name *
            </label>
            <input
              type="text"
              value={childName}
              onChange={(e) => setChildName(e.target.value)}
              placeholder="Child's full name"
              required
              style={{
                width: '100%',
                padding: '0.75rem',
                fontSize: '0.95rem',
                border: '2px solid #e0e0e0',
                borderRadius: '0.5rem',
                fontFamily: "'Segoe UI', sans-serif",
                boxSizing: 'border-box',
                transition: 'border-color 0.3s ease'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#c65d07'
                e.target.style.outline = 'none'
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#e0e0e0'
              }}
            />
          </div>

          {/* Email Field */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label
              style={{
                display: 'block',
                fontFamily: "'Segoe UI', sans-serif",
                fontSize: '0.95rem',
                color: '#2d2d2d',
                marginBottom: '0.5rem',
                fontWeight: 600
              }}
            >
              Email Address *
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              style={{
                width: '100%',
                padding: '0.75rem',
                fontSize: '0.95rem',
                border: '2px solid #e0e0e0',
                borderRadius: '0.5rem',
                fontFamily: "'Segoe UI', sans-serif",
                boxSizing: 'border-box',
                transition: 'border-color 0.3s ease'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#c65d07'
                e.target.style.outline = 'none'
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#e0e0e0'
              }}
            />
          </div>

          {/* Phone Number Field */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label
              style={{
                display: 'block',
                fontFamily: "'Segoe UI', sans-serif",
                fontSize: '0.95rem',
                color: '#2d2d2d',
                marginBottom: '0.5rem',
                fontWeight: 600
              }}
            >
              Phone Number *
            </label>
            <input
              type="tel"
              value={phoneNumber}
              onChange={handlePhoneChange}
              placeholder="(123) 456-7890"
              inputMode="numeric"
              maxLength="14"
              required
              style={{
                width: '100%',
                padding: '0.75rem',
                fontSize: '0.95rem',
                border: '2px solid #e0e0e0',
                borderRadius: '0.5rem',
                fontFamily: "'Segoe UI', sans-serif",
                boxSizing: 'border-box',
                transition: 'border-color 0.3s ease'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#c65d07'
                e.target.style.outline = 'none'
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#e0e0e0'
              }}
            />
          </div>

          {/* File Upload Field */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label
              style={{
                display: 'block',
                fontFamily: "'Segoe UI', sans-serif",
                fontSize: '0.95rem',
                color: '#2d2d2d',
                marginBottom: '0.5rem',
                fontWeight: 600
              }}
            >
              Upload Screenshot of PayPal Payment Proof *
            </label>
            <div
              style={{
                position: 'relative',
                cursor: 'pointer'
              }}
            >
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                required
                style={{
                  position: 'absolute',
                  opacity: 0,
                  width: '100%',
                  height: '100%',
                  cursor: 'pointer'
                }}
              />
              <div
                style={{
                  padding: '1rem',
                  border: '2px dashed #c65d07',
                  borderRadius: '0.5rem',
                  textAlign: 'center',
                  background: '#fff9f5',
                  fontFamily: "'Segoe UI', sans-serif",
                  color: '#c65d07',
                  fontWeight: 600,
                  transition: 'all 0.3s ease'
                }}
              >
                {screenshotFile ? screenshotFile.name : 'Click to upload screenshot'}
              </div>
            </div>

            {/* Image Preview */}
            {imagePreview && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                  marginTop: '1rem',
                  textAlign: 'center'
                }}
              >
                <img
                  src={imagePreview}
                  alt="Preview"
                  style={{
                    maxWidth: '100%',
                    maxHeight: '200px',
                    borderRadius: '0.5rem',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)'
                  }}
                />
              </motion.div>
            )}
          </div>

          {/* Status Message */}
          {uploadMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                padding: '1rem',
                borderRadius: '0.5rem',
                marginBottom: '1.5rem',
                fontFamily: "'Segoe UI', sans-serif",
                fontSize: '0.95rem',
                background:
                  messageType === 'success'
                    ? '#e8f5e9'
                    : messageType === 'error'
                      ? '#ffebee'
                      : '#f5f5f5',
                color:
                  messageType === 'success' ? '#2e7d32' : messageType === 'error' ? '#c62828' : '#555',
                border: `2px solid ${messageType === 'success' ? '#4caf50' : messageType === 'error' ? '#f44336' : '#e0e0e0'}`
              }}
            >
              {uploadMessage}
            </motion.div>
          )}

          {/* Submit Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={uploading}
            style={{
              width: '100%',
              padding: '0.75rem 1.5rem',
              fontSize: '1rem',
              fontWeight: 600,
              background: uploading ? '#ccc' : 'var(--rs-orange)',
              color: '#fff',
              border: 'none',
              borderRadius: '0.5rem',
              cursor: uploading ? 'not-allowed' : 'pointer',
              fontFamily: "'Segoe UI', sans-serif",
              transition: 'all 0.3s ease'
            }}
          >
            {uploading ? 'Processing...' : 'Sign Up for Easter Event'}
          </motion.button>

          <p
            style={{
              fontSize: '0.85rem',
              color: '#999',
              textAlign: 'center',
              marginTop: '1rem',
              fontFamily: "'Segoe UI', sans-serif"
            }}
          >
            * Required fields
          </p>
        </motion.form>

        {/* Post-Submission Message */}
        {submitted && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            style={{
              background: '#e8f5e9',
              border: '2px solid #4caf50',
              borderRadius: '1rem',
              padding: '2rem',
              textAlign: 'center',
              marginTop: '2rem'
            }}
          >
            <h3
              style={{
                fontFamily: "'DM Serif Text', serif",
                fontSize: '1.3rem',
                color: '#2e7d32',
                margin: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem'
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              Signup Confirmed!
            </h3>
            <p
              style={{
                fontFamily: "'Segoe UI', sans-serif",
                color: '#555',
                fontSize: '0.95rem'
              }}
            >
              Thank you for signing up! We're excited to see you at the Easter event.
            </p>
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}

export default Easter
