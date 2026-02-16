import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import { Calendar, Clock, Video, Bot } from 'lucide-react';
import { motion } from 'framer-motion';

// Meeting BaaS API URL for direct bot joining (Proxied via package.json)
const MEETING_BAAS_API_URL = "/v2/bots"; 

const UpcomingMeetings = ({ token, user }) => {
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);

  useEffect(() => {
    const fetchMeetings = async () => {
      try {
        const response = await axios.get('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
          headers: { Authorization: `Bearer ${token}` },
          params: {
            timeMin: new Date().toISOString(),
            maxResults: 10,
            singleEvents: true,
            orderBy: 'startTime',
          },
        });
        setMeetings(response.data.items);
      } catch (error) {
        console.error("Error fetching calendar:", error);
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchMeetings();
  }, [token]);

  const sendBot = async (meeting) => {
    setProcessingId(meeting.id);
    try {
      // Prioritize hangoutLink, then location, then description urls
      const meetingUrl = meeting.hangoutLink || meeting.location; 
      
      if (!meetingUrl) {
        alert("No meeting link found (Google Meet or location)!");
        setProcessingId(null);
        return;
      }

      console.log("Current User:", user);
      
      const apiKey = process.env.REACT_APP_MEETING_BAAS_API_KEY;
      if (!apiKey) {
        alert("Missing Meeting BaaS API Key in .env file!");
        setProcessingId(null);
        return;
      }

      const payload = {
        meeting_url: meetingUrl,
        bot_name: "AI Meeting Auditor",
        recording_mode: "speaker_view",
        reserved: new Date(meeting.start.dateTime) > new Date() ? true : false,
        entry_time: meeting.start.dateTime,
        webhook_url: "https://n8n-q8ji.onrender.com/webhook/autopilot",
        transcription_enabled: true,
        transcription_config: {
           provider: "gladia"
        },
        extra: {
          organizer_email: user?.email || meeting.organizer?.email || "ravinder.s.negi@intglobal.com",
          title: meeting.summary,
          agenda: meeting.description || "No description provided"
        }
      };
      
      console.log("Sending Meeting BaaS Payload:", payload);

      await axios.post(MEETING_BAAS_API_URL, payload, {
        headers: {
          "x-meeting-baas-api-key": apiKey,
          "Content-Type": "application/json"
        }
      });

      alert(`Bot scheduled for: ${meeting.summary}`);
    } catch (error) {
      console.error("Error sending bot:", error);
      alert("Failed to send bot. Check console (" + (error.response?.data?.message || error.message) + ")");
    } finally {
      // converting to 'sent' state conceptually, but we just reset for now
      setProcessingId(null);
    }
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
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
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

                {meeting.hangoutLink && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px', fontSize: '0.85rem', color: '#6366f1', background: 'rgba(99, 102, 241, 0.1)', padding: '6px 12px', borderRadius: '8px', width: 'fit-content' }}>
                    <Video size={14} />
                    Valid Link Detected
                  </div>
                )}
              </div>

              <button 
                className="action-btn"
                onClick={() => sendBot(meeting)}
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
                  fontWeight: 600,
                  fontSize: '1rem',
                  transition: 'all 0.2s'
                }}
              >
                {processingId === meeting.id ? (
                  <>Sending...</>
                ) : (
                  <>
                    <Bot size={20} /> Send AI Auditor
                  </>
                )}
              </button>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default UpcomingMeetings;
