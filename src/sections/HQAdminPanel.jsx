import React, { useState, useEffect } from 'react';
import { collection, query, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const HQAdminPanel = () => {
  const navigate = useNavigate();
  const { currentUser, userData } = useAuth();
  const [chapters, setChapters] = useState([]);
  const [stats, setStats] = useState({ volunteers: 0, hours: 0, events: 0, impact: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHQData = async () => {
      if (!currentUser) {
        navigate('/login');
        return;
      }
      if (!userData) return;
      if (!userData.foundingMember) {
        navigate('/');
        return;
      }
      try {
        const usersSnap = await getDocs(collection(db, 'users'));
        const usersList = usersSnap.docs.map(d => d.data());

        const chaptersSnap = await getDocs(collection(db, 'chapters'));
        const chaptersList = chaptersSnap.docs.map(d => {
          const data = d.data();
          const president = usersList.find(u => u.uid === data.presidentUid) || {};
          return {
            id: d.id,
            ...data,
            presidentName: president.name || 'Unknown',
            presidentEmail: president.email || 'Unknown'
          };
        });
        setChapters(chaptersList);

        const eventsSnap = await getDocs(collection(db, 'events'));
        const eventsList = eventsSnap.docs.map(d => d.data());

        const totalHours = usersList.reduce((sum, v) => sum + (Number(v.volunteerHours) || 0), 0);
        const totalImpact = eventsList.reduce((sum, e) => sum + (Number(e.peopleReached) || 0), 0);

        setStats({
          volunteers: usersList.length,
          hours: totalHours,
          events: eventsList.length,
          impact: totalImpact
        });
      } catch (err) {
        console.error("Failed to fetch HQ data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchHQData();
  }, [currentUser, userData, navigate]);

  const toggleApproval = async (chapterId, currentStatus) => {
    try {
      await updateDoc(doc(db, 'chapters', chapterId), {
        approved: !currentStatus
      });
      setChapters(chapters.map(c => c.id === chapterId ? { ...c, approved: !currentStatus } : c));
    } catch (err) {
      console.error("Error updating approval", err);
    }
  };

  const copyInviteLink = () => {
    const url = `${window.location.origin}/unlisted-chapter-signup`;
    navigator.clipboard.writeText(url);
    alert('Invite link copied to clipboard!');
  };

  if (loading) return <div style={{ color: 'white', textAlign: 'center', marginTop: '100px' }}>Loading HQ Admin...</div>;

  return (
    <div className="rs-hq-admin">
      <div className="rs-hq-admin__inner">
        <header className="rs-hq-admin__header">
          <h1 style={{ color: "white" }}>RecycleSpecs HQ Admin</h1>
          <button className="rs-btn-gold" onClick={copyInviteLink}>Copy Signup Invitation Link</button>
        </header>

        <section className="rs-hq-admin__stats">
          <div className="stat-card">
            <h3>Total Chapters</h3>
            <div className="value">{chapters.length}</div>
          </div>
          <div className="stat-card">
            <h3>Total Volunteers</h3>
            <div className="value">{stats.volunteers}</div>
          </div>
          <div className="stat-card">
            <h3>Volunteer Hours</h3>
            <div className="value">{stats.hours}</div>
          </div>
          <div className="stat-card">
            <h3>Total Impact</h3>
            <div className="value">{stats.impact}</div>
          </div>
        </section>

        <section className="rs-hq-admin__chapters">
          <h2>Chapter Management</h2>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Chapter Name</th>
                  <th>President</th>
                  <th>Email</th>
                  <th>Joined</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {chapters.map(c => (
                  <tr key={c.id}>
                    <td>{c.displayName || c.chapterName}</td>
                    <td>{c.presidentName}</td>
                    <td>{c.presidentEmail}</td>
                    <td>{c.createdAt ? new Date(c.createdAt).toLocaleDateString() : 'N/A'}</td>
                    <td>
                      <span className={`status-badge ${c.approved ? 'approved' : 'pending'}`}>
                        {c.approved ? 'Approved' : 'Disabled'}
                      </span>
                    </td>
                    <td>
                      <button 
                        className="rs-btn-outline" 
                        onClick={() => toggleApproval(c.id, c.approved)}
                      >
                        {c.approved ? 'Disable' : 'Approve'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      <style>{`
        .rs-hq-admin {
          min-height: 100vh;
          background: var(--bg-dark);
          color: white;
          padding: calc(80px + 2rem) 2rem 2rem;
          font-family: 'Inter', sans-serif;
        }

        .rs-hq-admin__inner {
          max-width: 1200px;
          margin: 0 auto;
        }

        .rs-hq-admin__header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
        }

        .rs-hq-admin__header h1 {
          font-family: 'Fraunces', serif;
        }

        .rs-btn-gold {
          background: var(--rs-gold);
          color: var(--bg-dark);
          border: none;
          padding: 10px 20px;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
        }

        .rs-hq-admin__stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1.5rem;
          margin-bottom: 3rem;
        }

        .stat-card {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 12px;
          padding: 1.5rem;
          text-align: center;
        }

        .stat-card h3 {
          font-size: 0.9rem;
          color: rgba(255,255,255,0.6);
          font-weight: 500;
        }

        .stat-card .value {
          font-family: 'Fraunces', serif;
          font-size: 2.5rem;
          color: var(--rs-teal);
          margin-top: 0.5rem;
        }

        .rs-hq-admin__chapters h2 {
          margin-bottom: 1rem;
        }

        .table-wrap {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 12px;
          overflow-x: auto;
        }

        table {
          width: 100%;
          border-collapse: collapse;
        }

        th, td {
          padding: 1rem;
          text-align: left;
          border-bottom: 1px solid rgba(255,255,255,0.05);
        }

        th {
          font-weight: 600;
          color: rgba(255,255,255,0.6);
          font-size: 0.85rem;
          text-transform: uppercase;
        }

        .status-badge {
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 0.75rem;
          font-weight: 600;
        }

        .status-badge.approved { background: rgba(45, 125, 125, 0.2); color: #4ade80; }
        .status-badge.pending { background: rgba(220, 53, 69, 0.2); color: #ff6b6b; }

        .rs-btn-outline {
          background: transparent;
          border: 1px solid rgba(255,255,255,0.2);
          color: white;
          padding: 6px 12px;
          border-radius: 6px;
          cursor: pointer;
        }
        .rs-btn-outline:hover { background: rgba(255,255,255,0.1); }
      `}</style>
    </div>
  );
};

export default HQAdminPanel;
