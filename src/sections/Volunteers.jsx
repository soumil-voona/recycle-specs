import { motion } from 'framer-motion'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { doc, getDoc, collection, addDoc, getDocs, query, orderBy, setDoc, deleteDoc, where } from 'firebase/firestore'
import { db } from '../firebase'
import { uploadToCloudinary } from '../utils/cloudinary'

function Volunteers() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [loggingOut, setLoggingOut] = useState(false);
  const [userData, setUserData] = useState(null);
  
  // Admin panel states
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [eventName, setEventName] = useState('');
  const [eventLocation, setEventLocation] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [eventCapacity, setEventCapacity] = useState('');
  const [isUnlimited, setIsUnlimited] = useState(false);
  const [eventDescription, setEventDescription] = useState('');
  const [eventImage, setEventImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState('');
  
  // Volunteer signups states
  const [volunteerSignups, setVolunteerSignups] = useState({});
  const [loadingSignups, setLoadingSignups] = useState(true);
  
  // Events display states
  const [events, setEvents] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [signingUp, setSigningUp] = useState({});

  function formatEventDate(dateValue) {
    if (!dateValue) return '';

    function getOrdinalSuffix(day) {
      if (day >= 11 && day <= 13) return 'th';
      const lastDigit = day % 10;
      if (lastDigit === 1) return 'st';
      if (lastDigit === 2) return 'nd';
      if (lastDigit === 3) return 'rd';
      return 'th';
    }

    function formatMonthDayWithOrdinal(date) {
      const month = date.toLocaleString([], { month: 'long' });
      const day = date.getDate();
      return `${month} ${day}${getOrdinalSuffix(day)}`;
    }

    if (typeof dateValue === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(dateValue)) {
      const [year, month, day] = dateValue.split('-').map(Number);
      return formatMonthDayWithOrdinal(new Date(year, month - 1, day));
    }

    const parsedDate = new Date(dateValue);
    return Number.isNaN(parsedDate.getTime()) ? dateValue : formatMonthDayWithOrdinal(parsedDate);
  }

  function formatEventTime(timeValue) {
    if (!timeValue || typeof timeValue !== 'string') return '';

    const [hourString, minuteString] = timeValue.split(':');
    const hours = Number(hourString);
    const minutes = Number(minuteString);

    if (Number.isNaN(hours) || Number.isNaN(minutes)) return timeValue;

    const date = new Date(2000, 0, 1, hours, minutes);
    return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true });
  }

  useEffect(() => {
    async function fetchUserData() {
      if (currentUser) {
        try {
          const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
          if (userDoc.exists()) {
            const data = userDoc.data();
            setUserData(data);
            // Check if user is admin
            if (data.isAdmin) {
              setShowAdminPanel(true);
            }
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      }
    }
    fetchUserData();
  }, [currentUser]);

  useEffect(() => {
    async function fetchEvents() {
      try {
        const eventsQuery = query(
          collection(db, 'events'), 
          where('eventType', '==', 'volunteer'),
          where('approvalStatus', '==', 'approved'),
          orderBy('date', 'asc')
        );
        const eventsSnapshot = await getDocs(eventsQuery);
        const eventsList = eventsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setEvents(eventsList);
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setLoadingEvents(false);
      }
    }
    fetchEvents();
  }, []);

  useEffect(() => {
    async function fetchVolunteerSignups() {
      try {
        const signupsSnapshot = await getDocs(collection(db, 'volunteers'));
        const signupsMap = {};
        
        signupsSnapshot.docs.forEach(doc => {
          const data = doc.data();
          const eventId = data.eventId;
          
          if (!signupsMap[eventId]) {
            signupsMap[eventId] = [];
          }
          signupsMap[eventId].push(data);
        });
        
        setVolunteerSignups(signupsMap);
      } catch (error) {
        console.error('Error fetching volunteer signups:', error);
      } finally {
        setLoadingSignups(false);
      }
    }
    fetchVolunteerSignups();
  }, []);

  async function handleLogout() {
    try {
      setLoggingOut(true);
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Failed to log out', error);
      setLoggingOut(false);
    }
  }

  function handleImageChange(e) {
    const file = e.target.files[0];
    if (file) {
      setEventImage(file);
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  }

  async function handleSignup(eventId) {
    if (!currentUser || !userData) return;
    
    setSigningUp(prev => ({ ...prev, [eventId]: true }));
    
    try {
      const signupId = `${currentUser.uid}-${eventId}`;
      await setDoc(doc(db, 'volunteers', signupId), {
        uid: currentUser.uid,
        eventId: eventId,
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: currentUser.email,
        signedUpAt: new Date().toISOString()
      });
      
      // Update local state
      setVolunteerSignups(prevSignups => ({
        ...prevSignups,
        [eventId]: [...(prevSignups[eventId] || []), {
          uid: currentUser.uid,
          eventId: eventId,
          firstName: userData.firstName,
          lastName: userData.lastName,
          email: currentUser.email,
          signedUpAt: new Date().toISOString()
        }]
      }));
    } catch (error) {
      console.error('Error signing up:', error);
      alert('Failed to sign up. Please try again.');
    } finally {
      setSigningUp(prev => ({ ...prev, [eventId]: false }));
    }
  }

  async function handleUnsignup(eventId) {
    if (!currentUser) return;

    setSigningUp(prev => ({ ...prev, [eventId]: true }));

    try {
      const signupId = `${currentUser.uid}-${eventId}`;
      await deleteDoc(doc(db, 'volunteers', signupId));

      setVolunteerSignups(prevSignups => ({
        ...prevSignups,
        [eventId]: (prevSignups[eventId] || []).filter(signup => signup.uid !== currentUser.uid)
      }));
    } catch (error) {
      console.error('Error canceling signup:', error);
      alert('Failed to cancel signup. Please try again.');
    } finally {
      setSigningUp(prev => ({ ...prev, [eventId]: false }));
    }
  }

  async function handleEventSubmit(e) {
    e.preventDefault();
    setUploading(true);
    setUploadMessage('');

    // Validate times
    if (startTime && endTime) {
      if (new Date(`2000-01-01T${endTime}`) <= new Date(`2000-01-01T${startTime}`)) {
        setUploadMessage('End time must be after start time');
        setUploading(false);
        return;
      }
    }

    try {
      // Upload image to Cloudinary
      let imageUrl = '';
      let imagePublicId = '';
      
      if (eventImage) {
        setUploadMessage('Uploading image...');
        const uploadResult = await uploadToCloudinary(eventImage);
        imageUrl = uploadResult.url;
        imagePublicId = uploadResult.publicId;
      }

      // Save event to Firestore
      setUploadMessage('Saving event...');
      await addDoc(collection(db, 'events'), {
        name: eventName,
        location: eventLocation,
        date: eventDate,
        startTime: startTime,
        endTime: endTime,
        capacity: isUnlimited ? 'unlimited' : parseInt(eventCapacity),
        description: eventDescription,
        imageUrl: imageUrl,
        imagePublicId: imagePublicId,
        createdAt: new Date().toISOString(),
        createdBy: currentUser.uid
      });

      setUploadMessage('Event created successfully!');
      
      // Reset form
      setEventName('');
      setEventLocation('');
      setEventDate('');
      setStartTime('');
      setEndTime('');
      setEventCapacity('');
      setIsUnlimited(false);
      setEventDescription('');
      setEventImage(null);
      setImagePreview(null);

      setTimeout(() => {
        setUploadMessage('');
      }, 3000);

    } catch (error) {
      console.error('Error creating event:', error);
      setUploadMessage('Error creating event. Please try again.');
    } finally {
      setUploading(false);
    }
  }

  async function handleDeleteEvent(eventId) {
    if (!currentUser || !userData?.isAdmin) {
      return;
    }

    if (!window.confirm('Are you sure you want to delete this volunteer event? This will also remove all related volunteer signups.')) {
      return;
    }

    try {
      const signupsForEventQuery = query(
        collection(db, 'volunteers'),
        where('eventId', '==', eventId)
      );
      const signupsSnapshot = await getDocs(signupsForEventQuery);

      await Promise.all(signupsSnapshot.docs.map((signupDoc) => deleteDoc(signupDoc.ref)));
      await deleteDoc(doc(db, 'events', eventId));

      setEvents((prevEvents) => prevEvents.filter((event) => event.id !== eventId));
      setVolunteerSignups((prevSignups) => {
        const nextSignups = { ...prevSignups };
        delete nextSignups[eventId];
        return nextSignups;
      });
    } catch (error) {
      console.error('Error deleting event:', error);
      alert('Failed to delete event. Please try again.');
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      padding: '2rem',
      paddingTop: '80px',
      background: 'rgba(45, 125, 125, 0.05)'
    }}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        style={{
          maxWidth: '1200px',
          margin: '0 auto'
        }}
      >
        {/* User info and logout button */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '2rem',
            background: 'white',
            padding: '1.5rem',
            borderRadius: '1rem',
            boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
            flexWrap: 'wrap',
            gap: '1rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {userData?.profilePictureUrl ? (
              <img 
                src={userData.profilePictureUrl} 
                alt="Profile" 
                style={{ width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--rs-orange)' }} 
              />
            ) : (
              <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </div>
            )}
            <div>
              <h2 style={{ fontFamily: "'DM Serif Text', serif", fontSize: '1.5rem', margin: 0, color: '#2d2d2d' }}>
                Welcome, {userData?.firstName || currentUser?.email}
              </h2>
              <p style={{ fontFamily: "'Segoe UI', sans-serif", fontSize: '0.9rem', color: '#666', margin: 0 }}>
                Volunteer Dashboard
              </p>
            </div>
          </div>
          
          <button
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
                e.target.style.background = '#e0e0e0';
              }
            }}
            onMouseLeave={(e) => {
              e.target.style.background = loggingOut ? '#ccc' : '#f5f5f5';
            }}
          >
            {loggingOut ? 'Logging out...' : 'Logout'}
          </button>
        </motion.div>

        {/* Volunteer Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.6 }}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '1.5rem',
            marginBottom: '2rem'
          }}
        >
          {(() => {
            const myEvents = events.filter(event => 
              (volunteerSignups[event.id] || []).some(s => s.uid === currentUser?.uid)
            );
            
            const totalHours = myEvents.reduce((acc, event) => {
              if (event.startTime && event.endTime) {
                const start = new Date(`2000-01-01T${event.startTime}`);
                const end = new Date(`2000-01-01T${event.endTime}`);
                const diff = (end - start) / (1000 * 60 * 60);
                return acc + (diff > 0 ? diff : 0);
              }
              return acc;
            }, 0);

            return (
              <>
                <div style={{
                  background: 'white',
                  padding: '2rem',
                  borderRadius: '1.5rem',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1.5rem'
                }}>
                  <div style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '1rem',
                    background: 'rgba(45, 125, 125, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--rs-teal)'
                  }}>
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                      <polyline points="22 4 12 14.01 9 11.01"></polyline>
                    </svg>
                  </div>
                  <div>
                    <div style={{ fontSize: '2.5rem', fontWeight: 800, fontFamily: "'Fraunces', serif", color: 'var(--rs-teal)', lineHeight: 1 }}>
                      {myEvents.length}
                    </div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#666', marginTop: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Events Joined
                    </div>
                  </div>
                </div>

                <div style={{
                  background: 'white',
                  padding: '2rem',
                  borderRadius: '1.5rem',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1.5rem'
                }}>
                  <div style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '1rem',
                    background: 'rgba(198, 93, 7, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--rs-orange)'
                  }}>
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"></circle>
                      <polyline points="12 6 12 12 16 14"></polyline>
                    </svg>
                  </div>
                  <div>
                    <div style={{ fontSize: '2.5rem', fontWeight: 800, fontFamily: "'Fraunces', serif", color: 'var(--rs-orange)', lineHeight: 1 }}>
                      {totalHours.toFixed(1)}
                    </div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#666', marginTop: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Total Hours
                    </div>
                  </div>
                </div>

                <div style={{
                  background: 'white',
                  padding: '1.5rem 2rem',
                  borderRadius: '1.5rem',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  gap: '0.75rem'
                }}>
                  <p style={{ margin: 0, fontSize: '0.9rem', color: '#555', lineHeight: 1.4 }}>
                    Need verification of your volunteer hours for school or work?
                  </p>
                  <a
                    href={`mailto:recycle.specs@gmail.com?subject=Volunteer%20Hours%20Verification%20-%20${userData?.firstName}%20${userData?.lastName}&body=Hello%20RecycleSpecs%20Team,%0D%0A%0D%0AI%20am%20writing%20to%20request%20verification%20for%20my%20${totalHours.toFixed(1)}%20volunteering%20hours.%0D%0A%0D%0AThank%20you!`}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem',
                      background: 'var(--text-primary)',
                      color: 'white',
                      padding: '0.75rem 1.25rem',
                      borderRadius: '0.75rem',
                      textDecoration: 'none',
                      fontSize: '0.9rem',
                      fontWeight: 600,
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-1px)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                  >
                    Request Proof of Hours
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                      <polyline points="22,6 12,13 2,6"></polyline>
                    </svg>
                  </a>
                </div>
              </>
            );
          })()}
        </motion.div>

        {/* Start a Chapter Banner */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          style={{
            background: 'var(--rs-teal)',
            borderRadius: '1.5rem',
            padding: '2.5rem',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '2rem',
            marginBottom: '3rem',
            boxShadow: '0 10px 30px rgba(45, 125, 125, 0.3)',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          {/* Decorative background shapes */}
          <div style={{ position: 'absolute', top: '-50px', right: '-50px', width: '200px', height: '200px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', bottom: '-80px', left: '20%', width: '150px', height: '150px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', pointerEvents: 'none' }} />
          
          <div style={{ maxWidth: '600px', position: 'relative', zIndex: 1 }}>
            <div style={{ display: 'inline-block', background: 'rgba(255,255,255,0.2)', padding: '0.25rem 0.75rem', borderRadius: '1rem', fontSize: '0.85rem', fontWeight: 600, fontFamily: "'Inter', sans-serif", letterSpacing: '0.05em', marginBottom: '1rem' }}>
              GROW THE MOVEMENT
            </div>
            <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: '2.5rem', margin: '0 0 1rem 0', lineHeight: 1.1 }}>
              Start a RecycleSpecs Chapter
            </h2>
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '1.05rem', lineHeight: 1.6, opacity: 0.9, margin: '0 0 1.5rem 0' }}>
              Want to make a bigger impact? You can start a RecycleSpecs chapter in your school or local community. Help us spread awareness and collect donations right where you live!
            </p>
            <a 
              href="https://forms.gle/AX5TJRwgJe1U5cQE9" 
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                background: 'var(--rs-gold)',
                color: '#2d2d2d',
                padding: '0.75rem 1.5rem',
                borderRadius: '0.75rem',
                fontFamily: "'Inter', sans-serif",
                fontWeight: 700,
                textDecoration: 'none',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 15px rgba(0,0,0,0.15)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 10px rgba(0,0,0,0.1)'; }}
            >
              Apply Now
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </a>
          </div>
          
          <div style={{ position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'center', flex: 1 }}>
            <img src="/imgs/event2.jpg" alt="Start a chapter" style={{ maxWidth: '100%', height: 'auto', maxHeight: '200px', borderRadius: '1rem', boxShadow: '0 8px 25px rgba(0,0,0,0.2)', border: '4px solid rgba(255,255,255,0.2)' }} />
          </div>
        </motion.div>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          style={{
            fontFamily: "'Segoe UI', sans-serif",
            fontSize: '1.2rem',
            lineHeight: '1.8',
            color: '#555',
            marginBottom: '3rem',
            maxWidth: '800px',
            margin: '0 auto 3rem',
            textAlign: 'center'
          }}
        >
          RecycleSpecs is a 501(c)(3) nonprofit organization dedicated to spreading optical awareness internationally. We've helped over 500+ people in India to get access to things such as surgeries, eye checkups, glasses, etc but to truly go international we need YOU to help!
        </motion.p>

        {/* Events List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          <h2 style={{
            fontFamily: "'DM Serif Text', serif",
            fontSize: '2.5rem',
            marginBottom: '2rem',
            color: '#2d2d2d',
            textAlign: 'center'
          }}>
            Upcoming Events
          </h2>

          {loadingEvents ? (
            <p style={{
              fontFamily: "'Segoe UI', sans-serif",
              fontSize: '1.1rem',
              color: '#666',
              textAlign: 'center'
            }}>
              Loading events...
            </p>
          ) : events.length === 0 ? (
            <p style={{
              fontFamily: "'Segoe UI', sans-serif",
              fontSize: '1.1rem',
              color: '#666',
              textAlign: 'center'
            }}>
              No events available at the moment. Check back soon!
            </p>
          ) : (
            <div className="rs-volunteers__events-grid" style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
              gap: '2rem',
              marginBottom: '4rem'
            }}>
              {events.map((event) => {
                const eventSignups = volunteerSignups[event.id] || [];
                const isSignedUp = eventSignups.some(signup => signup.uid === currentUser?.uid);
                const signupCount = eventSignups.length;
                const isFull = event.capacity !== 'unlimited' && signupCount >= event.capacity;
                
                return (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
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
                        height: '200px',
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
                    
                    <div style={{ padding: '1.5rem' }}>
                      <h3 style={{
                        fontFamily: "'DM Serif Text', serif",
                        fontSize: '1.5rem',
                        marginBottom: '0.5rem',
                        color: '#c65d07'
                      }}>
                        {event.name}
                      </h3>
                      
                      <div style={{
                        fontFamily: "'Segoe UI', sans-serif",
                        fontSize: '0.95rem',
                        color: '#666',
                        marginBottom: '1rem'
                      }}>
                        <p style={{ marginBottom: '0.5rem' }}>
                          <strong>Location:</strong> {event.location}
                        </p>
                        <p style={{ marginBottom: '0.5rem' }}>
                          <strong>Date:</strong> {formatEventDate(event.date)}
                        </p>
                        {event.startTime && event.endTime && (
                          <p style={{ marginBottom: '0.5rem' }}>
                            <strong>Time:</strong> {formatEventTime(event.startTime)} - {formatEventTime(event.endTime)}
                          </p>
                        )}
                        <p style={{ marginBottom: '0.5rem' }}>
                          <strong>Capacity:</strong> {event.capacity === 'unlimited' 
                            ? 'Unlimited' 
                            : `${signupCount}/${event.capacity}`}
                        </p>
                      </div>
                      
                      <p style={{
                        fontFamily: "'Segoe UI', sans-serif",
                        fontSize: '0.9rem',
                        color: '#555',
                        lineHeight: '1.6',
                        marginBottom: '1.5rem'
                      }}>
                        {event.description}
                      </p>
                      
                      <button
                        onClick={() => isSignedUp ? handleUnsignup(event.id) : handleSignup(event.id)}
                        disabled={(!isSignedUp && isFull) || signingUp[event.id]}
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          background: isSignedUp 
                            ? '#d32f2f' 
                            : isFull 
                              ? '#ccc' 
                              : 'var(--rs-orange)',
                          color: 'white',
                          border: 'none',
                          borderRadius: '0.5rem',
                          fontSize: '1rem',
                          fontWeight: 600,
                          fontFamily: "'Segoe UI', sans-serif",
                          cursor: ((!isSignedUp && isFull) || signingUp[event.id]) ? 'not-allowed' : 'pointer',
                          transition: 'all 0.3s ease',
                          opacity: (!isSignedUp && isFull) ? 0.85 : 1
                        }}
                      >
                        {signingUp[event.id] 
                          ? 'Processing...'
                          : isSignedUp 
                            ? 'Cancel Signup' 
                            : isFull 
                              ? 'Event Full' 
                              : 'Sign Up'}
                      </button>

                      {showAdminPanel && userData?.isAdmin && (
                        <button
                          onClick={() => handleDeleteEvent(event.id)}
                          style={{
                            width: '100%',
                            padding: '0.75rem',
                            marginTop: '0.75rem',
                            background: '#b91c1c',
                            color: 'white',
                            border: 'none',
                            borderRadius: '0.5rem',
                            fontSize: '0.95rem',
                            fontWeight: 600,
                            fontFamily: "'Segoe UI', sans-serif",
                            cursor: 'pointer',
                            transition: 'all 0.3s ease'
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.background = '#991b1b';
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.background = '#b91c1c';
                          }}
                        >
                          Delete Event
                        </button>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </motion.div>

        {/* Admin Panel */}
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
              Create a new volunteer event
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
                    Location *
                  </label>
                  <input
                    type="text"
                    value={eventLocation}
                    onChange={(e) => setEventLocation(e.target.value)}
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
                    Volunteer Capacity
                  </label>
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <input
                      type="number"
                      value={eventCapacity}
                      onChange={(e) => setEventCapacity(e.target.value)}
                      required={!isUnlimited}
                      disabled={isUnlimited}
                      min="1"
                      style={{
                        flex: 1,
                        padding: '0.75rem',
                        borderRadius: '0.5rem',
                        border: '2px solid #e0e0e0',
                        fontSize: '1rem',
                        fontFamily: "'Segoe UI', sans-serif",
                        transition: 'border-color 0.3s ease',
                        boxSizing: 'border-box',
                        background: isUnlimited ? '#f5f5f5' : 'white'
                      }}
                      onFocus={(e) => !isUnlimited && (e.target.style.borderColor = '#c65d07')}
                      onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
                    />
                    <label style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      fontFamily: "'Segoe UI', sans-serif",
                      fontSize: '0.9rem',
                      color: '#666',
                      cursor: 'pointer',
                      whiteSpace: 'nowrap'
                    }}>
                      <input
                        type="checkbox"
                        checked={isUnlimited}
                        onChange={(e) => {
                          setIsUnlimited(e.target.checked);
                          if (e.target.checked) setEventCapacity('');
                        }}
                        style={{ cursor: 'pointer' }}
                      />
                      Unlimited
                    </label>
                  </div>
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
                    Start Time
                  </label>
                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
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
                    End Time
                  </label>
                  <input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
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
                  Event Description *
                </label>
                <textarea
                  value={eventDescription}
                  onChange={(e) => setEventDescription(e.target.value)}
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

              <div style={{ marginBottom: '2rem' }}>
                <label style={{
                  display: 'block',
                  fontFamily: "'Segoe UI', sans-serif",
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  color: '#333',
                  marginBottom: '0.5rem'
                }}>
                  Event Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: '0.5rem',
                    border: '2px solid #e0e0e0',
                    fontSize: '1rem',
                    fontFamily: "'Segoe UI', sans-serif",
                    boxSizing: 'border-box',
                    cursor: 'pointer'
                  }}
                />
                {imagePreview && (
                  <div style={{ marginTop: '1rem' }}>
                    <img
                      src={imagePreview}
                      alt="Preview"
                      style={{
                        maxWidth: '100%',
                        maxHeight: '300px',
                        borderRadius: '0.5rem',
                        objectFit: 'cover'
                      }}
                    />
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={uploading}
                style={{
                  width: '100%',
                  padding: '1rem',
                  background: uploading ? '#ccc' : 'var(--rs-orange)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.75rem',
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  fontFamily: "'Segoe UI', sans-serif",
                  cursor: uploading ? 'not-allowed' : 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: uploading ? 'none' : '0 4px 15px rgba(198, 93, 7, 0.3)'
                }}
                onMouseEnter={(e) => {
                  if (!uploading) {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 6px 20px rgba(198, 93, 7, 0.4)';
                  }
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = uploading ? 'none' : '0 4px 15px rgba(198, 93, 7, 0.3)';
                }}
              >
                {uploading ? 'Creating Event...' : 'Create Event'}
              </button>
            </form>
          </motion.div>
        )}
      </motion.div>
      <style>{`
        @media (max-width: 768px) {
          .rs-volunteers__events-grid {
            display: flex !important;
            overflow-x: auto;
            scroll-snap-type: x mandatory;
            padding-bottom: 2rem;
            margin-left: -2rem;
            margin-right: -2rem;
            padding-left: 2rem;
            padding-right: 2rem;
            gap: 1.5rem !important;
            scrollbar-width: none;
          }
          .rs-volunteers__events-grid::-webkit-scrollbar { display: none; }
          .rs-volunteers__events-grid > div {
            flex: 0 0 85%;
            scroll-snap-align: center;
          }
        }
      `}</style>
    </div>
  )
}

export default Volunteers
