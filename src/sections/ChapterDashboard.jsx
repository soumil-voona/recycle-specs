import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { collection, query, where, getDocs, addDoc } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { uploadToCloudinary } from '../utils/cloudinary';

const ChapterDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [chapterData, setChapterData] = useState(null);
  const [members, setMembers] = useState([]);
  const [events, setEvents] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      const user = auth.currentUser;
      if (!user) {
        navigate('/chapters/admin-login');
        return;
      }

      try {
        // Fetch Chapter Profile (document ID is user.uid)
        const chapterRef = collection(db, 'chapters');
        const q = query(chapterRef, where('__name__', '==', user.uid));
        const chapterSnap = await getDocs(q);
        
        if (!chapterSnap.empty) {
          setChapterData({ id: chapterSnap.docs[0].id, ...chapterSnap.docs[0].data() });
        }

        // Fetch Members
        const membersQ = query(collection(db, 'volunteers'), where('chapterId', '==', user.uid));
        const membersSnap = await getDocs(membersQ);
        setMembers(membersSnap.docs.map(d => ({ id: d.id, ...d.data() })));

        // Fetch Events
        const eventsQ = query(collection(db, 'events'), where('chapterId', '==', user.uid));
        const eventsSnap = await getDocs(eventsQ);
        setEvents(eventsSnap.docs.map(d => ({ id: d.id, ...d.data() })));

        // Fetch Announcements
        const annQ = query(collection(db, 'announcements'));
        const annSnap = await getDocs(annQ);
        setAnnouncements(annSnap.docs.map(d => ({ id: d.id, ...d.data() })));

      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [navigate]);

  const handleLogout = async () => {
    await auth.signOut();
    navigate('/chapters');
  };

  const handleExportCSV = () => {
    if (members.length === 0) return;
    
    const headers = ['First Name', 'Last Name', 'Email', 'School', 'Grade', 'Volunteer Hours'];
    const csvContent = [
      headers.join(','),
      ...members.map(m => `"${m.firstName}","${m.lastName}","${m.email}","${m.school}","${m.grade}","${m.volunteerHours || 0}"`)
    ].join('\\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `chapter_members_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  if (loading) {
    return <div style={{ color: 'white', textAlign: 'center', marginTop: '100px' }}>Loading Dashboard...</div>;
  }

  const totalHours = members.reduce((sum, m) => sum + (Number(m.volunteerHours) || 0), 0);
  const peopleImpacted = events.reduce((sum, e) => sum + (Number(e.peopleReached) || 0), 0);

  return (
    <div className="rs-dashboard">
      {/* Sidebar */}
      <aside className="rs-dashboard__sidebar">
        <div className="rs-dashboard__brand">
          <img src="/imgs/logo.png" alt="RecycleSpecs" />
          <span>Chapter Admin</span>
        </div>
        <nav className="rs-dashboard__nav">
          <button className={activeTab === 'overview' ? 'active' : ''} onClick={() => setActiveTab('overview')}>Overview</button>
          <button className={activeTab === 'members' ? 'active' : ''} onClick={() => setActiveTab('members')}>Members</button>
          <button className={activeTab === 'events' ? 'active' : ''} onClick={() => setActiveTab('events')}>Events</button>
          <button className={activeTab === 'resources' ? 'active' : ''} onClick={() => setActiveTab('resources')}>Resources</button>
          <button className={activeTab === 'announcements' ? 'active' : ''} onClick={() => setActiveTab('announcements')}>Announcements</button>
        </nav>
        <div className="rs-dashboard__logout">
          <button onClick={handleLogout}>Log Out</button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="rs-dashboard__main">
        <header className="rs-dashboard__header">
          <h2>Welcome, {chapterData?.chapterName || 'Chapter'}</h2>
        </header>

        <div className="rs-dashboard__content">
          {activeTab === 'overview' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="rs-dashboard__metrics">
                <div className="rs-dashboard__card">
                  <h3>Total Members</h3>
                  <div className="rs-dashboard__card-value">{members.length}</div>
                </div>
                <div className="rs-dashboard__card">
                  <h3>Volunteer Hours</h3>
                  <div className="rs-dashboard__card-value">{totalHours}</div>
                </div>
                <div className="rs-dashboard__card">
                  <h3>Events Hosted</h3>
                  <div className="rs-dashboard__card-value">{events.length}</div>
                </div>
                <div className="rs-dashboard__card">
                  <h3>People Impacted</h3>
                  <div className="rs-dashboard__card-value">{peopleImpacted}</div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'members' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="rs-dashboard__section-header">
                <h3>Member Directory</h3>
                <button onClick={handleExportCSV} className="rs-btn-outline">Export CSV</button>
              </div>
              <div className="rs-dashboard__table-wrap">
                <table className="rs-dashboard__table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>School</th>
                      <th>Grade</th>
                      <th>Hours</th>
                    </tr>
                  </thead>
                  <tbody>
                    {members.map(m => (
                      <tr key={m.id}>
                        <td>{m.firstName} {m.lastName}</td>
                        <td>{m.email}</td>
                        <td>{m.school}</td>
                        <td>{m.grade}</td>
                        <td>{m.volunteerHours || 0}</td>
                      </tr>
                    ))}
                    {members.length === 0 && (
                      <tr><td colSpan="5" style={{textAlign:'center'}}>No members found.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {activeTab === 'events' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <EventReporting chapterId={chapterData?.id} onEventAdded={(e) => setEvents([e, ...events])} />
              
              <div className="rs-dashboard__section-header" style={{marginTop:'3rem'}}>
                <h3>Past Events</h3>
              </div>
              <div className="rs-dashboard__grid">
                {events.map(ev => (
                  <div key={ev.id} className="rs-dashboard__event-card">
                    <h4>{ev.eventName}</h4>
                    <p className="rs-dashboard__event-meta">{ev.date} | {ev.location}</p>
                    <p>{ev.description}</p>
                    <div className="rs-dashboard__event-stats">
                      <span>{ev.participants} Participants</span>
                      <span>{ev.peopleReached} Reached</span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'resources' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h3>Resource Center</h3>
              <div className="rs-dashboard__grid">
                {[
                  { title: "Chapter Handbook", type: "PDF" },
                  { title: "Branding Guidelines", type: "PDF" },
                  { title: "Event Planning Guide", type: "PDF" },
                  { title: "Outreach Templates", type: "DOC" }
                ].map((res, i) => (
                  <div key={i} className="rs-dashboard__resource-card">
                    <div className="icon">📄</div>
                    <div>
                      <h4>{res.title}</h4>
                      <span>{res.type}</span>
                    </div>
                    <button className="rs-btn-outline">Download</button>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'announcements' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h3>HQ Announcements</h3>
              <div className="rs-dashboard__list">
                {announcements.map(a => (
                  <div key={a.id} className="rs-dashboard__announcement">
                    <h4>{a.title}</h4>
                    <span>{new Date(a.createdAt).toLocaleDateString()}</span>
                    <p>{a.content}</p>
                  </div>
                ))}
                {announcements.length === 0 && <p>No announcements yet.</p>}
              </div>
            </motion.div>
          )}
        </div>
      </main>

      <style>{`
        .rs-dashboard {
          display: flex;
          min-height: 100vh;
          background: var(--bg-dark);
          color: white;
          font-family: 'Inter', sans-serif;
        }

        .rs-dashboard h1,
        .rs-dashboard h2,
        .rs-dashboard h3,
        .rs-dashboard h4,
        .rs-dashboard h5,
        .rs-dashboard h6 {
          color: white;
        }

        .rs-dashboard__sidebar {
          width: 260px;
          background: rgba(255,255,255,0.02);
          border-right: 1px solid rgba(255,255,255,0.05);
          display: flex;
          flex-direction: column;
        }

        .rs-dashboard__brand {
          padding: 1.5rem;
          display: flex;
          align-items: center;
          gap: 12px;
          font-family: 'Fraunces', serif;
          font-weight: 700;
          font-size: 1.1rem;
          border-bottom: 1px solid rgba(255,255,255,0.05);
        }
        
        .rs-dashboard__brand img {
          height: 32px;
        }

        .rs-dashboard__nav {
          flex: 1;
          padding: 1.5rem 1rem;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .rs-dashboard__nav button {
          background: none;
          border: none;
          color: rgba(255,255,255,0.6);
          text-align: left;
          padding: 12px 16px;
          border-radius: 8px;
          cursor: pointer;
          font-size: 0.95rem;
          transition: all 0.2s;
        }

        .rs-dashboard__nav button:hover {
          background: rgba(255,255,255,0.05);
          color: white;
        }

        .rs-dashboard__nav button.active {
          background: var(--rs-orange);
          color: white;
          font-weight: 600;
        }

        .rs-dashboard__logout {
          padding: 1.5rem;
          border-top: 1px solid rgba(255,255,255,0.05);
        }

        .rs-dashboard__logout button {
          width: 100%;
          padding: 10px;
          background: transparent;
          border: 1px solid rgba(255,255,255,0.2);
          color: white;
          border-radius: 8px;
          cursor: pointer;
        }
        .rs-dashboard__logout button:hover {
          background: rgba(255,255,255,0.05);
        }

        .rs-dashboard__main {
          flex: 1;
          display: flex;
          flex-direction: column;
          overflow-y: auto;
        }

        .rs-dashboard__header {
          padding: 2rem;
          border-bottom: 1px solid rgba(255,255,255,0.05);
        }

        .rs-dashboard__header h2 {
          font-family: 'Fraunces', serif;
          font-size: 1.8rem;
          margin: 0;
        }

        .rs-dashboard__content {
          padding: 2rem;
          flex: 1;
        }

        .rs-dashboard__metrics {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1.5rem;
        }

        .rs-dashboard__card {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 16px;
          padding: 1.5rem;
        }

        .rs-dashboard__card h3 {
          font-size: 0.9rem;
          color: rgba(255,255,255,0.85);
          margin-bottom: 0.5rem;
          font-weight: 500;
        }

        .rs-dashboard__card-value {
          font-family: 'Fraunces', serif;
          font-size: 2.5rem;
          font-weight: 700;
          color: var(--rs-orange);
        }

        .rs-dashboard__section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }

        .rs-dashboard__table-wrap {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 12px;
          overflow-x: auto;
        }

        .rs-dashboard__table {
          width: 100%;
          border-collapse: collapse;
        }

        .rs-dashboard__table th,
        .rs-dashboard__table td {
          padding: 1rem;
          text-align: left;
          border-bottom: 1px solid rgba(255,255,255,0.05);
        }

        .rs-dashboard__table th {
          font-weight: 600;
          color: rgba(255,255,255,0.85);
          font-size: 0.85rem;
          text-transform: uppercase;
        }

        .rs-btn-outline {
          background: transparent;
          border: 1px solid rgba(255,255,255,0.4);
          color: white;
          padding: 8px 16px;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.2s;
        }
        .rs-btn-outline:hover {
          background: rgba(255,255,255,0.1);
          border-color: white;
        }

        .rs-dashboard__grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 1.5rem;
        }

        .rs-dashboard__event-card {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 12px;
          padding: 1.5rem;
        }
        
        .rs-dashboard__event-card h4 { margin-bottom: 0.25rem; font-size: 1.1rem; }
        .rs-dashboard__event-meta { font-size: 0.85rem; color: rgba(255,255,255,0.75); margin-bottom: 1rem; }
        .rs-dashboard__event-stats {
          display: flex; gap: 1rem; margin-top: 1rem; font-size: 0.85rem; color: var(--rs-gold-light);
        }

        .rs-dashboard__resource-card {
          display: flex;
          align-items: center;
          gap: 1rem;
          background: rgba(255,255,255,0.03);
          padding: 1.25rem;
          border-radius: 12px;
          border: 1px solid rgba(255,255,255,0.08);
        }
        .rs-dashboard__resource-card .icon { font-size: 2rem; }
        .rs-dashboard__resource-card h4 { margin: 0; font-size: 0.95rem; }
        .rs-dashboard__resource-card span { font-size: 0.75rem; color: rgba(255,255,255,0.7); }
        .rs-dashboard__resource-card button { margin-left: auto; }

        .rs-dashboard__list { display: flex; flex-direction: column; gap: 1rem; }
        .rs-dashboard__announcement {
          background: rgba(255,255,255,0.03);
          padding: 1.5rem;
          border-radius: 12px;
          border-left: 4px solid var(--rs-gold);
        }
        .rs-dashboard__announcement h4 { margin: 0 0 4px 0; }
        .rs-dashboard__announcement span { font-size: 0.8rem; color: rgba(255,255,255,0.7); }
        .rs-dashboard__announcement p { margin-top: 1rem; color: rgba(255,255,255,0.9); }
      `}</style>
    </div>
  );
};

// Sub-component for Event Reporting
const EventReporting = ({ chapterId, onEventAdded }) => {
  const [formData, setFormData] = useState({
    eventName: '', date: '', location: '', description: '', participants: '', peopleReached: '', photoUrl: ''
  });
  const [photoFile, setPhotoFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let finalPhotoUrl = '';
      if (photoFile) {
        const uploadResult = await uploadToCloudinary(photoFile);
        finalPhotoUrl = uploadResult?.url || '';
      }
      
      const finalData = {
        ...formData,
        photoUrl: finalPhotoUrl
      };

      const docRef = await addDoc(collection(db, 'events'), {
        chapterId,
        ...finalData,
        createdAt: new Date().toISOString()
      });
      onEventAdded({ id: docRef.id, ...finalData });
      setFormData({ eventName: '', date: '', location: '', description: '', participants: '', peopleReached: '', photoUrl: '' });
      setPhotoFile(null);
      const fileInput = document.getElementById('event-photo-upload');
      if (fileInput) fileInput.value = '';
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rs-event-form-wrap">
      <h3>Submit New Event</h3>
      <form onSubmit={handleSubmit} className="rs-event-form">
        <div className="row">
          <input type="text" placeholder="Event Name" required value={formData.eventName} onChange={e => setFormData({...formData, eventName: e.target.value})} />
          <input type="date" required value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
        </div>
        <input type="text" placeholder="Location" required value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} />
        <textarea placeholder="Description" required rows="3" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}></textarea>
        <div className="row">
          <input type="number" placeholder="Number of Participants" required value={formData.participants} onChange={e => setFormData({...formData, participants: e.target.value})} />
          <input type="number" placeholder="People Impacted" required value={formData.peopleReached} onChange={e => setFormData({...formData, peopleReached: e.target.value})} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.8)' }}>Event Photo (optional)</label>
          <input id="event-photo-upload" type="file" accept="image/*" onChange={e => setPhotoFile(e.target.files[0])} style={{ padding: '8px 10px' }} />
        </div>
        <button type="submit" disabled={loading}>{loading ? 'Submitting...' : 'Submit Event Report'}</button>
      </form>
      <style>{`
        .rs-event-form-wrap {
          background: rgba(255,255,255,0.02);
          border: 1px dashed rgba(255,255,255,0.2);
          padding: 1.5rem;
          border-radius: 12px;
        }
        .rs-event-form-wrap h3 { margin-bottom: 1rem; }
        .rs-event-form { display: flex; flex-direction: column; gap: 1rem; }
        .rs-event-form .row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
        .rs-event-form input, .rs-event-form textarea {
          background: rgba(0,0,0,0.2); border: 1px solid rgba(255,255,255,0.1);
          color: white; padding: 10px 14px; border-radius: 8px; font-family: inherit;
        }
        .rs-event-form button {
          background: var(--rs-orange); color: white; border: none; padding: 12px;
          border-radius: 8px; cursor: pointer; font-weight: 600; transition: background 0.2s;
        }
        .rs-event-form button:hover:not(:disabled) {
          background: var(--rs-orange-dark);
        }
        .rs-event-form button:disabled { opacity: 0.7; cursor: not-allowed; }
      `}</style>
    </div>
  );
};

export default ChapterDashboard;
