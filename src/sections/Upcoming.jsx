import { motion } from 'framer-motion'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { doc, getDoc, collection, getDocs, query, orderBy, setDoc, deleteDoc } from 'firebase/firestore'
import { db } from '../firebase'
import { uploadToCloudinary } from '../utils/cloudinary'

function slugifyEventPath(value) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

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

function Upcoming() {
  const { currentUser, logout } = useAuth()
  const navigate = useNavigate()
  const [loggingOut, setLoggingOut] = useState(false)
  const [userData, setUserData] = useState(null)
  const [showAdminPanel, setShowAdminPanel] = useState(false)
  const [events, setEvents] = useState([])
  const [loadingEvents, setLoadingEvents] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [uploadMessage, setUploadMessage] = useState('')

  const [eventName, setEventName] = useState('')
  const [eventDate, setEventDate] = useState('')
  const [eventStartTime, setEventStartTime] = useState('')
  const [eventEndTime, setEventEndTime] = useState('')
  const [eventPath, setEventPath] = useState('')
  const [eventPrice, setEventPrice] = useState('free')
  const [eventPriceAmount, setEventPriceAmount] = useState('')
  const [eventLocation, setEventLocation] = useState('')
  const [eventDescription, setEventDescription] = useState('')
  const [eventImage, setEventImage] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)

  useEffect(() => {
    async function fetchUserData() {
      if (!currentUser) return

      try {
        const userDoc = await getDoc(doc(db, 'users', currentUser.uid))
        if (userDoc.exists()) {
          const data = userDoc.data()
          setUserData(data)
          if (data.isAdmin) {
            setShowAdminPanel(true)
          }
        }
      } catch (error) {
        console.error('Error fetching user data:', error)
      }
    }

    fetchUserData()
  }, [currentUser])

  useEffect(() => {
    async function fetchEvents() {
      try {
        const eventsQuery = query(collection(db, 'upcomingEvents'), orderBy('date', 'asc'))
        const eventsSnapshot = await getDocs(eventsQuery)
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        
        const eventsList = eventsSnapshot.docs
          .map((eventDoc) => ({
            id: eventDoc.id,
            ...eventDoc.data()
          }))
          .filter((event) => {
            const eventDate = new Date(event.date)
            eventDate.setHours(0, 0, 0, 0)
            return eventDate >= today
          })
        
        setEvents(eventsList)
      } catch (error) {
        console.error('Error fetching upcoming events:', error)
      } finally {
        setLoadingEvents(false)
      }
    }

    fetchEvents()
  }, [])

  async function handleLogout() {
    try {
      setLoggingOut(true)
      await logout()
      navigate('/')
    } catch (error) {
      console.error('Failed to log out', error)
      setLoggingOut(false)
    }
  }

  async function handleDeleteEvent(eventPath, e) {
    e.stopPropagation()
    if (!window.confirm('Are you sure you want to delete this event?')) {
      return
    }

    try {
      await deleteDoc(doc(db, 'upcomingEvents', eventPath))
      setEvents((prevEvents) => prevEvents.filter((event) => event.path !== eventPath))
    } catch (error) {
      console.error('Error deleting event:', error)
    }
  }

  function handleImageChange(e) {
    const file = e.target.files[0]
    if (!file) return

    setEventImage(file)
    const reader = new FileReader()
    reader.onloadend = () => {
      setImagePreview(reader.result)
    }
    reader.readAsDataURL(file)
  }

  async function handleEventSubmit(e) {
    e.preventDefault()
    setUploading(true)
    setUploadMessage('')

    try {
      if (!eventName.trim() || !eventDate || !eventStartTime || !eventEndTime || !eventPath.trim() || !eventImage || !eventLocation.trim() || !eventDescription.trim()) {
        setUploadMessage('Please fill in all fields and upload an image.')
        setUploading(false)
        return
      }

      if (eventPrice === 'paid' && !eventPriceAmount.trim()) {
        setUploadMessage('Please enter a price for the paid event.')
        setUploading(false)
        return
      }

      const normalizedPath = slugifyEventPath(eventPath)
      if (!normalizedPath) {
        setUploadMessage('Please enter a valid path.')
        setUploading(false)
        return
      }

      const eventRef = doc(db, 'upcomingEvents', normalizedPath)
      const existingEvent = await getDoc(eventRef)
      if (existingEvent.exists()) {
        setUploadMessage('That path already exists. Please choose a different one.')
        setUploading(false)
        return
      }

      setUploadMessage('Uploading image...')
      const uploadResult = await uploadToCloudinary(eventImage)

      setUploadMessage('Saving event...')
      const priceValue = eventPrice === 'free' ? 'free' : `$${eventPriceAmount}`
      await setDoc(eventRef, {
        name: eventName.trim(),
        date: eventDate,
        startTime: eventStartTime,
        endTime: eventEndTime,
        path: normalizedPath,
        price: priceValue,
        location: eventLocation.trim(),
        description: eventDescription.trim(),
        imageUrl: uploadResult.url,
        imagePublicId: uploadResult.publicId,
        createdAt: new Date().toISOString(),
        createdBy: currentUser.uid
      })

      setEvents((prevEvents) => [
        {
          id: normalizedPath,
          name: eventName.trim(),
          date: eventDate,
          startTime: eventStartTime,
          endTime: eventEndTime,
          path: normalizedPath,
          price: priceValue,
          location: eventLocation.trim(),
          description: eventDescription.trim(),
          imageUrl: uploadResult.url,
          imagePublicId: uploadResult.publicId,
          createdAt: new Date().toISOString(),
          createdBy: currentUser.uid
        },
        ...prevEvents
      ])

      setUploadMessage('Upcoming event created successfully!')
      setEventName('')
      setEventDate('')
      setEventStartTime('')
      setEventEndTime('')
      setEventPath('')
      setEventPrice('free')
      setEventPriceAmount('')
      setEventLocation('')
      setEventDescription('')
      setEventImage(null)
      setImagePreview(null)

      setTimeout(() => {
        setUploadMessage('')
      }, 3000)
    } catch (error) {
      console.error('Error creating upcoming event:', error)
      setUploadMessage('Error creating event. Please try again.')
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
          maxWidth: '1200px',
          margin: '0 auto',
          textAlign: 'center'
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
            gap: '1rem',
            marginBottom: '2rem',
            flexWrap: 'wrap'
          }}
        >
          {currentUser ? (
            <>
              <span style={{
                fontFamily: "'Segoe UI', sans-serif",
                fontSize: '0.95rem',
                color: '#666'
              }}>
                Welcome, {userData?.firstName || currentUser?.email}
              </span>
              <button
                type="button"
                onClick={handleLogout}
                disabled={loggingOut}
                style={{
                  padding: '0.5rem 1.5rem',
                  background: loggingOut ? '#ccc' : '#f5f5f5',
                  color: '#333',
                  border: '1px solid #ddd',
                  borderRadius: '0.5rem',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  fontFamily: "'Segoe UI', sans-serif",
                  cursor: loggingOut ? 'not-allowed' : 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  if (!loggingOut) {
                    e.target.style.background = '#e0e0e0'
                  }
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = loggingOut ? '#ccc' : '#f5f5f5'
                }}
              >
                {loggingOut ? 'Logging out...' : 'Logout'}
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => navigate('/event-login')}
              style={{
                padding: '0.5rem 1.5rem',
                background: '#f5f5f5',
                color: '#333',
                border: '1px solid #ddd',
                borderRadius: '0.5rem',
                fontSize: '0.9rem',
                fontWeight: 600,
                fontFamily: "'Segoe UI', sans-serif",
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              Admin Login
            </button>
          )}
        </motion.div>

        <h1 style={{
          fontFamily: "'DM Serif Text', serif",
          fontSize: 'clamp(2.5rem, 5vw, 4rem)',
          marginBottom: '1rem',
          color: '#2d2d2d',
          fontWeight: 700
        }}>
          Upcoming
        </h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          style={{
            fontFamily: "'Segoe UI', sans-serif",
            fontSize: '1.15rem',
            lineHeight: '1.8',
            color: '#555',
            marginBottom: '3rem',
            maxWidth: '800px',
            margin: '0 auto 3rem'
          }}
        >
          See what RecycleSpecs has coming next and open any event page for more details.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          style={{ marginTop: '4rem' }}
        >
          <h2 style={{
            fontFamily: "'DM Serif Text', serif",
            fontSize: '2.5rem',
            marginBottom: '2rem',
            color: '#2d2d2d'
          }}>
            Upcoming Events
          </h2>

          {loadingEvents ? (
            <p style={{
              fontFamily: "'Segoe UI', sans-serif",
              fontSize: '1.1rem',
              color: '#666'
            }}>
              Loading events...
            </p>
          ) : events.length === 0 ? (
            <p style={{
              fontFamily: "'Segoe UI', sans-serif",
              fontSize: '1.1rem',
              color: '#666'
            }}>
              No upcoming events available at the moment. Check back soon!
            </p>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: '2rem',
              marginBottom: '4rem'
            }}>
              {events.map((event) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  onClick={() => navigate(`/upcoming/${event.path}`)}
                  style={{
                    background: 'white',
                    borderRadius: '1rem',
                    overflow: 'hidden',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                    cursor: 'pointer'
                  }}
                  whileHover={{ transform: 'translateY(-5px)', boxShadow: '0 8px 30px rgba(0, 0, 0, 0.15)' }}
                >
                  {event.imageUrl && (
                    <div style={{
                      width: '100%',
                      height: '220px',
                      overflow: 'hidden'
                    }}>
                      <img
                        src={event.imageUrl}
                        alt={event.name}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover'
                        }}
                      />
                    </div>
                  )}

                  <div style={{ padding: '1.5rem', textAlign: 'left' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                      <h3 style={{
                        fontFamily: "'DM Serif Text', serif",
                        fontSize: '1.5rem',
                        margin: 0,
                        color: '#c65d07',
                        flex: 1
                      }}>
                        {event.name}
                      </h3>
                      {showAdminPanel && userData?.isAdmin && (
                        <button
                          type="button"
                          onClick={(e) => handleDeleteEvent(event.path, e)}
                          style={{
                            padding: '0.4rem 0.8rem',
                            background: '#ffebee',
                            color: '#c62828',
                            border: '1px solid #ef5350',
                            borderRadius: '0.4rem',
                            fontSize: '0.8rem',
                            fontWeight: 600,
                            fontFamily: "'Segoe UI', sans-serif",
                            cursor: 'pointer',
                            whiteSpace: 'nowrap',
                            marginLeft: '0.5rem',
                            transition: 'all 0.2s ease'
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.background = '#ffcdd2'
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.background = '#ffebee'
                          }}
                        >
                          Delete
                        </button>
                      )}
                    </div>

                    <p style={{
                      fontFamily: "'Segoe UI', sans-serif",
                      fontSize: '0.95rem',
                      color: '#666',
                      marginBottom: '0.75rem'
                    }}>
                      <strong>📅 Date:</strong> {formatEventDate(event.date)}
                    </p>

                    <button
                      type="button"
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        background: 'linear-gradient(135deg, #c65d07, #e6b800)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '0.5rem',
                        fontSize: '1rem',
                        fontWeight: 600,
                        fontFamily: "'Segoe UI', sans-serif",
                        cursor: 'pointer'
                      }}
                    >
                      Open Event
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {showAdminPanel && userData?.isAdmin && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            style={{
              marginTop: '4rem',
              background: 'white',
              padding: '2.5rem',
              borderRadius: '1.5rem',
              boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
              textAlign: 'left'
            }}
          >
            <h2 style={{
              fontFamily: "'DM Serif Text', serif",
              fontSize: '2rem',
              marginBottom: '0.5rem',
              color: '#c65d07'
            }}>
              Admin Panel
            </h2>
            <p style={{
              fontFamily: "'Segoe UI', sans-serif",
              fontSize: '0.95rem',
              color: '#666',
              marginBottom: '2rem'
            }}>
              Create a new upcoming event page
            </p>

            {uploadMessage && (
              <div style={{
                padding: '1rem',
                borderRadius: '0.5rem',
                marginBottom: '1.5rem',
                background: uploadMessage.includes('Error') ? '#fee' : '#e8f5e9',
                color: uploadMessage.includes('Error') ? '#c00' : '#2e7d32',
                fontFamily: "'Segoe UI', sans-serif",
                fontSize: '0.9rem'
              }}>
                {uploadMessage}
              </div>
            )}

            <form onSubmit={handleEventSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                <div>
                  <label style={{
                    display: 'block',
                    fontFamily: "'Segoe UI', sans-serif",
                    fontSize: '0.9rem',
                    fontWeight: 600,
                    color: '#333',
                    marginBottom: '0.5rem'
                  }}>
                    Event Name *
                  </label>
                  <input
                    type="text"
                    value={eventName}
                    onChange={(e) => setEventName(e.target.value)}
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
                    Event Date *
                  </label>
                  <input
                    type="date"
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
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
                    Start Time *
                  </label>
                  <input
                    type="time"
                    value={eventStartTime}
                    onChange={(e) => setEventStartTime(e.target.value)}
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
                    End Time *
                  </label>
                  <input
                    type="time"
                    value={eventEndTime}
                    onChange={(e) => setEventEndTime(e.target.value)}
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

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                <div>
                  <label style={{
                    display: 'block',
                    fontFamily: "'Segoe UI', sans-serif",
                    fontSize: '0.9rem',
                    fontWeight: 600,
                    color: '#333',
                    marginBottom: '0.5rem'
                  }}>
                    Event Path *
                  </label>
                  <input
                    type="text"
                    value={eventPath}
                    onChange={(e) => setEventPath(e.target.value)}
                    placeholder="easter-2026"
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
                  <p style={{
                    marginTop: '0.5rem',
                    marginBottom: 0,
                    fontFamily: "'Segoe UI', sans-serif",
                    fontSize: '0.85rem',
                    color: '#777'
                  }}>
                    This becomes the URL path after /upcoming/.
                  </p>
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
                    Picture *
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
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
                      background: 'white'
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                <div>
                  <label style={{
                    display: 'block',
                    fontFamily: "'Segoe UI', sans-serif",
                    fontSize: '0.9rem',
                    fontWeight: 600,
                    color: '#333',
                    marginBottom: '0.75rem'
                  }}>
                    Price *
                  </label>
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <label style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      cursor: 'pointer',
                      fontFamily: "'Segoe UI', sans-serif",
                      fontSize: '0.95rem',
                      color: '#333'
                    }}>
                      <input
                        type="radio"
                        name="eventPrice"
                        value="free"
                        checked={eventPrice === 'free'}
                        onChange={(e) => {
                          setEventPrice(e.target.value)
                          setEventPriceAmount('')
                        }}
                        style={{ cursor: 'pointer' }}
                      />
                      Free
                    </label>
                    <label style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      cursor: 'pointer',
                      fontFamily: "'Segoe UI', sans-serif",
                      fontSize: '0.95rem',
                      color: '#333'
                    }}>
                      <input
                        type="radio"
                        name="eventPrice"
                        value="paid"
                        checked={eventPrice === 'paid'}
                        onChange={(e) => setEventPrice(e.target.value)}
                        style={{ cursor: 'pointer' }}
                      />
                      Paid
                    </label>
                  </div>
                </div>

                {eventPrice === 'paid' && (
                  <div>
                    <label style={{
                      display: 'block',
                      fontFamily: "'Segoe UI', sans-serif",
                      fontSize: '0.9rem',
                      fontWeight: 600,
                      color: '#333',
                      marginBottom: '0.5rem'
                    }}>
                      Price Amount *
                    </label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{
                        fontSize: '1.1rem',
                        fontWeight: 600,
                        color: '#333',
                        fontFamily: "'Segoe UI', sans-serif"
                      }}>$</span>
                      <input
                        type="number"
                        value={eventPriceAmount}
                        onChange={(e) => setEventPriceAmount(e.target.value)}
                        placeholder="25.00"
                        min="0"
                        step="0.01"
                        required={eventPrice === 'paid'}
                        style={{
                          flex: 1,
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
                )}

                <div style={{ gridColumn: eventPrice === 'paid' ? '1 / -1' : 'auto' }}>
                  <label style={{
                    display: 'block',
                    fontFamily: "'Segoe UI', sans-serif",
                    fontSize: '0.9rem',
                    fontWeight: 600,
                    color: '#333',
                    marginBottom: '0.5rem'
                  }}>
                    Location *
                  </label>
                  <input
                    type="text"
                    value={eventLocation}
                    onChange={(e) => setEventLocation(e.target.value)}
                    placeholder="e.g., Downtown Community Center"
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
                  Description *
                </label>
                <textarea
                  value={eventDescription}
                  onChange={(e) => setEventDescription(e.target.value)}
                  placeholder="Brief description of the event"
                  required
                  rows="4"
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: '0.5rem',
                    border: '2px solid #e0e0e0',
                    fontSize: '1rem',
                    fontFamily: "'Segoe UI', sans-serif",
                    transition: 'border-color 0.3s ease',
                    boxSizing: 'border-box',
                    resize: 'vertical'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#c65d07'}
                  onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
                />
              </div>

              {imagePreview && (
                <div style={{
                  marginBottom: '1.5rem',
                  borderRadius: '1rem',
                  overflow: 'hidden',
                  maxHeight: '260px',
                  background: '#f5f5f5'
                }}>
                  <img
                    src={imagePreview}
                    alt="Event preview"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      display: 'block'
                    }}
                  />
                </div>
              )}

              <button
                type="submit"
                disabled={uploading}
                style={{
                  width: '100%',
                  padding: '0.9rem 1.25rem',
                  background: uploading ? '#ccc' : 'linear-gradient(135deg, #c65d07, #e6b800)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.75rem',
                  fontSize: '1rem',
                  fontWeight: 700,
                  fontFamily: "'Segoe UI', sans-serif",
                  cursor: uploading ? 'not-allowed' : 'pointer',
                  transition: 'all 0.3s ease'
                }}
              >
                {uploading ? 'Saving...' : 'Create Upcoming Event'}
              </button>
            </form>
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}

export default Upcoming
