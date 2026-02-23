import React, { useState, useEffect, useCallback } from 'react';
import { format } from 'date-fns';
import { Calendar, Clock, Video, Bot, FileText } from 'lucide-react';
import { motion } from 'framer-motion';
import { fetchUpcomingMeetings } from '../services/calendarService';
import { joinMeeting } from '../services/botService';
import { fetchAuditStatus, logAuditStart } from '../services/auditService';
import { toast } from 'sonner';
import AgendaModal from './AgendaModal';
import ReportModal from './ReportModal'; // We will create this next

const UpcomingMeetings = ({ token, user }) => {
  const [meetings, setMeetings] = useState([]);
  const [audits, setAudits] = useState([]); // Store DB audit statuses
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);
  const [selectedMeeting, setSelectedMeeting] = useState(null);
  const [viewingReport, setViewingReport] = useState(null);

  const loadData = useCallback(async () => {
    if (!token) return;
    try {
      setLoading(true);
      const [meetingsData, auditsData] = await Promise.all([
        fetchUpcomingMeetings(token),
        fetchAuditStatus()
      ]);
      setMeetings(meetingsData);
      setAudits(auditsData);
    } catch (error) {
      console.error("Failed to load meetings or audits", error);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    loadData();
    
    // Optional: Refresh audits every 30 seconds to catch n8n updates
    const interval = setInterval(loadData, 30000);
    return () => clearInterval(interval);
  }, [loadData]);

  // Step 1: User clicks "Send AI Auditor"
  const handleInitiateJoin = (meeting) => {
    setSelectedMeeting(meeting);
  };

  // Step 2: User confirms from Modal
  const handleConfirmJoin = async (customAgenda) => {
    if (!selectedMeeting) return;
    
    const meeting = selectedMeeting;
    setProcessingId(meeting.id);
    setSelectedMeeting(null);
    
    // Log optimistic start to DB via n8n
    await logAuditStart(meeting.id, meeting.summary);
    
    toast.promise(joinMeeting(meeting, user, customAgenda), {
      loading: 'Summoning AI Meeting Auditor... 🤖',
      success: (data) => {
        // Refresh audits to show "Auditing" state immediately
        loadData();
        return `Auditor has joined: ${meeting.summary} 🚀`;
      },
      error: (err) => `Failed to join: ${err.message}`,
      finally: () => setProcessingId(null)
    });
  };

  const getAuditStatus = (meetingId) => {
    return audits.find(a => a.meeting_id === meetingId);
  };

  if (loading && meetings.length === 0) return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
      <div className="loader"></div>
    </div>
  );

  return (
    <div className="upcoming-meetings-container">
      {selectedMeeting && (
        <AgendaModal 
          meeting={selectedMeeting} 
          onClose={() => setSelectedMeeting(null)} 
          onConfirm={handleConfirmJoin} 
        />
      )}

      {viewingReport && (
        <ReportModal 
          report={viewingReport} 
          onClose={() => setViewingReport(null)} 
        />
      )}

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
                onClick={() => {
                  const audit = getAuditStatus(meeting.id);
                  if (audit?.status === 'completed') {
                    setViewingReport(audit);
                  } else {
                    handleInitiateJoin(meeting);
                  }
                }}
                disabled={processingId === meeting.id || getAuditStatus(meeting.id)?.status === 'auditing'}
                style={{
                  width: '100%',
                  padding: '14px',
                  borderRadius: '12px',
                  border: 'none',
                  background: (processingId === meeting.id || getAuditStatus(meeting.id)?.status === 'auditing') 
                    ? 'rgba(255,255,255,0.1)' 
                    : getAuditStatus(meeting.id)?.status === 'completed'
                    ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' // Green for completed
                    : 'var(--primary-gradient)',
                  color: 'white',
                  cursor: (processingId === meeting.id || getAuditStatus(meeting.id)?.status === 'auditing') ? 'not-allowed' : 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                  fontWeight: 600, fontSize: '1rem', transition: 'all 0.2s',
                  boxShadow: getAuditStatus(meeting.id)?.status === 'completed' ? '0 4px 12px rgba(16, 185, 129, 0.2)' : 'none'
                }}
              >
                {processingId === meeting.id || getAuditStatus(meeting.id)?.status === 'auditing' ? (
                  <><div className="loader-small" style={{ width: '16px', height: '16px', border: '2px solid white', borderTop: '2px solid transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div> Auditing...</>
                ) : getAuditStatus(meeting.id)?.status === 'completed' ? (
                  <><FileText size={20} /> View AI Report</>
                ) : (
                  <><Bot size={20} /> Configure & Send</>
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
