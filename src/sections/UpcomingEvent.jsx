import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { collection, addDoc, doc, getDoc } from 'firebase/firestore'
import { db } from '../firebase'
import { uploadToCloudinary } from '../utils/cloudinary'

function formatEventDate(dateValue) {
  if (!dateValue) return ''

  function getOrdinalSuffix(day) {
    if (day >= 11 && day <= 13) return 'th'
    const lastDigit = day % 10
    if (lastDigit === 1) return 'st'
    if (lastDigit === 2) return 'nd'
    if (lastDigit === 3) return 'rd'
    return 'th'
  }

  function formatMonthDayWithOrdinal(date) {
    const month = date.toLocaleString([], { month: 'long' })
    const day = date.getDate()
    return `${month} ${day}${getOrdinalSuffix(day)}`
  }

  if (typeof dateValue === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(dateValue)) {
    const [year, month, day] = dateValue.split('-').map(Number)
    return formatMonthDayWithOrdinal(new Date(year, month - 1, day))
  }

  const parsedDate = new Date(dateValue)
  return Number.isNaN(parsedDate.getTime()) ? dateValue : formatMonthDayWithOrdinal(parsedDate)
}

function UpcomingEvent() {
  const { eventPath } = useParams()
  const navigate = useNavigate()
  const [event, setEvent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [screenshotFile, setScreenshotFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [uploadMessage, setUploadMessage] = useState('')
  const [messageType, setMessageType] = useState('')
  const [submitted, setSubmitted] = useState(false)

  function formatPhoneNumber(value) {
    const digits = value.replace(/\D/g, '')

    if (digits.length <= 3) {
      return digits
    }
    if (digits.length <= 6) {
      return `(${digits.slice(0, 3)}) ${digits.slice(3)}`
    }
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`
  }

  function handlePhoneChange(e) {
    const formatted = formatPhoneNumber(e.target.value)
    setPhoneNumber(formatted)
  }

  function handleImageChange(e) {
    const file = e.target.files[0]
    if (file) {
      setScreenshotFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  useEffect(() => {
    async function fetchEvent() {
      if (!eventPath) {
        setError('Missing event path.')
        setLoading(false)
        return
      }

      try {
        const eventDoc = await getDoc(doc(db, 'upcomingEvents', eventPath))
        if (!eventDoc.exists()) {
          setError('Event not found.')
          return
        }

        setEvent({ id: eventDoc.id, ...eventDoc.data() })
      } catch (fetchError) {
        console.error('Error fetching upcoming event:', fetchError)
        setError('Unable to load this event right now.')
      } finally {
        setLoading(false)
      }
    }

    fetchEvent()
  }, [eventPath])

  async function handleSubmit(e) {
    e.preventDefault()
    setUploading(true)
    setUploadMessage('')
    setMessageType('')

    try {
      if (!fullName || !email || !phoneNumber) {
        setUploadMessage('Please fill in your name, email, and phone number.')
        setMessageType('error')
        setUploading(false)
        return
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(email)) {
        setUploadMessage('Please enter a valid email address.')
        setMessageType('error')
        setUploading(false)
        return
      }

      const phoneDigits = phoneNumber.replace(/\D/g, '')
      if (phoneDigits.length < 10) {
        setUploadMessage('Please enter a valid phone number (at least 10 digits).')
        setMessageType('error')
        setUploading(false)
        return
      }

      if (event?.price !== 'free' && !screenshotFile) {
        setUploadMessage('Please upload payment proof to complete your registration.')
        setMessageType('error')
        setUploading(false)
        return
      }

      let screenshotUrl = ''
      let screenshotPublicId = ''

      if (screenshotFile) {
        setUploadMessage('Uploading attachment...')
        const uploadResult = await uploadToCloudinary(screenshotFile)
        screenshotUrl = uploadResult.url
        screenshotPublicId = uploadResult.publicId
      }

      setUploadMessage('Submitting your registration...')
      await addDoc(collection(db, 'upcomingEventSignups'), {
        eventPath,
        eventName: event?.name || '',
        fullName,
        email,
        phoneNumber,
        screenshotUrl,
        screenshotPublicId,
        signedUpAt: new Date().toISOString()
      })

      setUploadMessage('Thank you for registering! We will contact you soon.')
      setMessageType('success')
      setSubmitted(true)

      setFullName('')
      setEmail('')
      setPhoneNumber('')
      setScreenshotFile(null)
      setImagePreview(null)

      setTimeout(() => {
        navigate('/upcoming')
      }, 1500)
    } catch (submitError) {
      console.error('Error submitting registration:', submitError)
      setUploadMessage('Error processing registration. Please try again.')
      setMessageType('error')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      padding: '2rem',
      paddingTop: '100px',
      background: 'linear-gradient(135deg, rgba(45, 125, 125, 0.05), rgba(196, 93, 7, 0.05))'
    }}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        style={{
          maxWidth: '600px',
          margin: '0 auto'
        }}
      >
        {loading ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{
              background: 'white',
              borderRadius: '1rem',
              padding: '2rem',
              textAlign: 'center',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
            }}
          >
            <p style={{
              fontFamily: "'Segoe UI', sans-serif",
              color: '#666',
              fontSize: '1rem'
            }}>
              Loading event...
            </p>
          </motion.div>
        ) : error ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{
              background: 'white',
              borderRadius: '1rem',
              padding: '2rem',
              textAlign: 'center',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
            }}
          >
            <h1 style={{
              fontFamily: "'DM Serif Text', serif",
              fontSize: '2rem',
              color: '#2d2d2d',
              margin: 0
            }}>
              Event Not Found
            </h1>
            <p style={{
              fontFamily: "'Segoe UI', sans-serif",
              color: '#c62828',
              marginTop: '1rem'
            }}>
              {error}
            </p>
            <button
              type="button"
              onClick={() => navigate('/upcoming')}
              style={{
                marginTop: '1rem',
                padding: '0.65rem 1.1rem',
                borderRadius: '0.5rem',
                border: '1px solid #ddd',
                background: '#f7f7f7',
                fontFamily: "'Segoe UI', sans-serif",
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Back to Upcoming
            </button>
          </motion.div>
        ) : (
          <>
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              style={{
                textAlign: 'center',
                marginBottom: '3rem'
              }}
            >
              <h1 style={{
                fontFamily: "'DM Serif Text', serif",
                fontSize: 'clamp(2rem, 5vw, 3.5rem)',
                color: '#2d2d2d',
                marginBottom: '0.5rem',
                fontWeight: 700
              }}>
                {event.name}
              </h1>
              <p style={{
                fontFamily: "'Segoe UI', sans-serif",
                fontSize: '1.1rem',
                color: '#666',
                marginBottom: '1.5rem'
              }}>
                Register for this upcoming event. Contact <a href="mailto:recycle.specs@gmail.com">recycle.specs@gmail.com</a> for more information.
              </p>
            </motion.div>

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
              {event.imageUrl && (
                <div style={{
                  width: '100%',
                  marginBottom: '1.25rem',
                  borderRadius: '0.75rem',
                  overflow: 'hidden',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}>
                  <img
                    src={event.imageUrl}
                    alt={event.name}
                    style={{
                      width: '100%',
                      height: 'auto',
                      objectFit: 'contain',
                      display: 'block'
                    }}
                  />
                </div>
              )}

              <h3 style={{
                fontFamily: "'DM Serif Text', serif",
                fontSize: '1.3rem',
                color: '#2d2d2d',
                marginTop: 0,
                marginBottom: '1rem'
              }}>
                Event Details
              </h3>
              <div style={{
                display: 'grid',
                gap: '1rem',
                fontSize: '0.95rem',
                color: '#555',
                fontFamily: "'Segoe UI', sans-serif"
              }}>
                <div>
                  <strong style={{ color: '#c65d07' }}>When:</strong> {formatEventDate(event.date)}{event.startTime && event.endTime ? ` @ ${event.startTime} - ${event.endTime}` : ''}
                </div>
                {event.location && (
                  <div>
                    <strong style={{ color: '#c65d07' }}>Where:</strong> {event.location}
                  </div>
                )}
                {event.price && event.price !== 'free' && (
                  <div>
                    <strong style={{ color: '#c65d07' }}>Price:</strong> {event.price}
                  </div>
                )}
                {event.price === 'free' && (
                  <div>
                    <strong style={{ color: '#c65d07' }}>Price:</strong> Free
                  </div>
                )}
                {event.description && (
                  <div style={{ marginTop: '0.5rem' }}>
                    <strong style={{ color: '#c65d07' }}>About:</strong>
                    <p style={{ margin: '0.5rem 0 0 0', lineHeight: '1.6' }}>
                      {event.description}
                    </p>
                  </div>
                )}
                <div style={{ marginTop: '0.75rem', color: '#666', fontSize: '0.9rem' }}>
                  Fill out the form below to register your interest for this event.
                </div>
              </div>
            </motion.div>

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
              <h3 style={{
                fontFamily: "'DM Serif Text', serif",
                fontSize: '1.3rem',
                color: '#2d2d2d',
                marginTop: 0,
                marginBottom: '1.5rem'
              }}>
                Register Now
              </h3>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{
                  display: 'block',
                  fontFamily: "'Segoe UI', sans-serif",
                  fontSize: '0.95rem',
                  color: '#2d2d2d',
                  marginBottom: '0.5rem',
                  fontWeight: 600
                }}>
                  Full Name *
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Your full name"
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

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{
                  display: 'block',
                  fontFamily: "'Segoe UI', sans-serif",
                  fontSize: '0.95rem',
                  color: '#2d2d2d',
                  marginBottom: '0.5rem',
                  fontWeight: 600
                }}>
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

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{
                  display: 'block',
                  fontFamily: "'Segoe UI', sans-serif",
                  fontSize: '0.95rem',
                  color: '#2d2d2d',
                  marginBottom: '0.5rem',
                  fontWeight: 600
                }}>
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

              {event.price !== 'free' && (
                <>
                  <div style={{
                    background: '#fef5ed',
                    padding: '1.5rem',
                    borderRadius: '0.75rem',
                    marginBottom: '1.5rem',
                    borderLeft: '4px solid #c65d07'
                  }}>
                    <h4 style={{
                      fontFamily: "'DM Serif Text', serif",
                      fontSize: '1.1rem',
                      color: '#c65d07',
                      marginTop: 0,
                      marginBottom: '0.75rem'
                    }}>
                      Event Registration Required
                    </h4>
                    <p style={{
                      fontFamily: "'Segoe UI', sans-serif",
                      fontSize: '0.95rem',
                      color: '#555',
                      margin: '0 0 0.75rem 0'
                    }}>
                      Please upload proof of payment to complete your registration. Take a screenshot of your payment confirmation and upload it below.
                    </p>
                  </div>

                  <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{
                      display: 'block',
                      fontFamily: "'Segoe UI', sans-serif",
                      fontSize: '0.95rem',
                      color: '#2d2d2d',
                      marginBottom: '0.5rem',
                      fontWeight: 600
                    }}>
                      Upload Payment Proof *
                    </label>
                    <div style={{
                      position: 'relative',
                      cursor: 'pointer'
                    }}>
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
                      <div style={{
                        padding: '1rem',
                        border: '2px dashed #c65d07',
                        borderRadius: '0.5rem',
                        textAlign: 'center',
                        background: '#fff9f5',
                        fontFamily: "'Segoe UI', sans-serif",
                        color: '#c65d07',
                        fontWeight: 600,
                        transition: 'all 0.3s ease'
                      }}>
                        {screenshotFile ? screenshotFile.name : 'Click to upload payment proof'}
                      </div>
                    </div>

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
                </>
              )}

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
                  background: uploading ? '#ccc' : 'linear-gradient(135deg, #c65d07, #e6b800)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '0.5rem',
                  cursor: uploading ? 'not-allowed' : 'pointer',
                  fontFamily: "'Segoe UI', sans-serif",
                  transition: 'all 0.3s ease'
                }}
              >
                {uploading ? 'Processing...' : 'Register for Event'}
              </motion.button>

              <p style={{
                fontSize: '0.85rem',
                color: '#999',
                textAlign: 'center',
                marginTop: '1rem',
                fontFamily: "'Segoe UI', sans-serif"
              }}>
                * Required fields
              </p>
            </motion.form>

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
                <h3 style={{
                  fontFamily: "'DM Serif Text', serif",
                  fontSize: '1.3rem',
                  color: '#2e7d32',
                  margin: 0
                }}>
                  Registration Confirmed
                </h3>
                <p style={{
                  fontFamily: "'Segoe UI', sans-serif",
                  color: '#555',
                  fontSize: '0.95rem'
                }}>
                  Thank you! Your registration was submitted successfully.
                </p>
              </motion.div>
            )}
          </>
        )}
      </motion.div>
    </div>
  )
}

export default UpcomingEvent
