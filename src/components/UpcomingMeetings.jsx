import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Calendar, Clock, Video, Bot } from 'lucide-react';
import { motion } from 'framer-motion';
import { fetchUpcomingMeetings } from '../services/calendarService';
import { joinMeeting } from '../services/botService';
import { toast } from 'sonner';

const UpcomingMeetings = ({ token, user }) => {
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);

  useEffect(() => {
    const loadMeetings = async () => {
      if (!token) return;
      try {
        const data = await fetchUpcomingMeetings(token);
        setMeetings(data);
      } catch (error) {
        console.error("Failed to load meetings", error);
      } finally {
        setLoading(false);
      }
    };
    loadMeetings();
  }, [token]);



  const handleJoinMeeting = async (meeting) => {
    setProcessingId(meeting.id);
    
    toast.promise(joinMeeting(meeting, user), {
      loading: 'Summoning AI Meeting Auditor... 🤖',
      success: (data) => `Auditor has joined: ${meeting.summary} 🚀`,
      error: (err) => `Failed to join: ${err.message}`, // err.message from BotService
      finally: () => setProcessingId(null)
    });
  };

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
      <div className="loader"></div>
    </div>
  );

  return (
    <div className="upcoming-meetings-container">
      <div className="meetings-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
        {meetings.length === 0 ? (
          <div style={{ textAlign: 'center', color: 'var(--text-secondary)', gridColumn: '1/-1' }}>
            <Calendar size={48} style={{ marginBottom: '10px', opacity: 0.5 }} />
            <p>No upcoming meetings found in your calendar.</p>
          </div>
        ) : (
          meetings.map((meeting) => (
            <motion.div 
              key={meeting.id}
              className="meeting-card"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ y: -5 }}
              style={{
                background: 'rgba(255,255,255,0.05)',
                padding: '24px',
                borderRadius: '16px',
                border: '1px solid rgba(255,255,255,0.1)',
                display: 'flex', flexDirection: 'column', justifyContent: 'space-between'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', color: 'var(--primary)' }}>
                  <Calendar size={18} />
                  <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>
                    {meeting.start.dateTime ? format(new Date(meeting.start.dateTime), 'MMM d, yyyy') : 'All Day'}
                  </span>
                </div>
                
                <h3 style={{ fontSize: '1.25rem', marginBottom: '12px', lineHeight: 1.4 }}>{meeting.summary}</h3>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px', color: 'var(--text-secondary)' }}>
                  <Clock size={16} />
                  <span style={{ fontSize: '0.9rem' }}>
                    {meeting.start.dateTime ? format(new Date(meeting.start.dateTime), 'h:mm a') : 'All Day'}
                  </span>
                </div>

                {(meeting.hangoutLink || meeting.location) && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px', fontSize: '0.85rem', color: '#6366f1', background: 'rgba(99, 102, 241, 0.1)', padding: '6px 12px', borderRadius: '8px', width: 'fit-content' }}>
                    <Video size={14} />
                    Valid Link Detected
                  </div>
                )}
              </div>

              <button 
                className="action-btn"
                onClick={() => handleJoinMeeting(meeting)}
                disabled={processingId === meeting.id}
                style={{
                  width: '100%',
                  padding: '14px',
                  borderRadius: '12px',
                  border: 'none',
                  background: processingId === meeting.id ? 'var(--text-secondary)' : 'var(--primary-gradient)',
                  color: 'white',
                  cursor: processingId === meeting.id ? 'not-allowed' : 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                  fontWeight: 600, fontSize: '1rem', transition: 'all 0.2s'
                }}
              >
                {processingId === meeting.id ? "Sending..." : <><Bot size={20} /> Send AI Auditor</>}
              </button>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default UpcomingMeetings;
