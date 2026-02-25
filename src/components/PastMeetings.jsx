import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { FileText, Calendar, Clock, AlertTriangle, CheckCircle2, MoreHorizontal } from 'lucide-react';
import { motion } from 'framer-motion';
import { fetchPastMeetingReports } from '../services/auditService';
import ReportModal from './ReportModal';

const PastMeetings = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewingReport, setViewingReport] = useState(null);

  const loadReports = async () => {
    try {
      setLoading(true);
      const data = await fetchPastMeetingReports();
      setReports(data);
    } catch (error) {
      console.error("Failed to load past meeting reports:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReports();
  }, []);

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
      <div className="loader"></div>
    </div>
  );

  return (
    <div className="past-meetings-container">
      {viewingReport && (
        <ReportModal 
          report={viewingReport} 
          onClose={() => setViewingReport(null)} 
        />
      )}

      <div className="reports-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '20px' }}>
        {reports.length === 0 ? (
          <div style={{ textAlign: 'center', color: 'var(--text-secondary)', gridColumn: '1/-1', padding: '60px 20px' }}>
            <Calendar size={48} style={{ marginBottom: '16px', opacity: 0.3 }} />
            <p style={{ fontSize: '1.1rem' }}>No past audit reports found.</p>
            <p style={{ fontSize: '0.9rem', marginTop: '8px' }}>Once meetings are completed, their reports will appear here.</p>
          </div>
        ) : (
          reports.map((report) => (
            <motion.div 
              key={report.id}
              className="report-card"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ y: -5 }}
              style={{
                background: 'rgba(255,255,255,0.05)',
                padding: '24px',
                borderRadius: '16px',
                border: '1px solid rgba(255,255,255,0.1)',
                display: 'flex', flexDirection: 'column', gap: '16px'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ 
                  padding: '6px 12px', 
                  borderRadius: '20px', 
                  fontSize: '0.75rem', 
                  fontWeight: 600,
                  background: report.risk_level === 'high' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                  color: report.risk_level === 'high' ? '#ef4444' : '#10b981',
                  display: 'flex', alignItems: 'center', gap: '4px'
                }}>
                  {report.risk_level === 'high' ? <AlertTriangle size={12} /> : <CheckCircle2 size={12} />}
                  {report.risk_level?.toUpperCase() || 'LOW'} RISK
                </div>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  {format(new Date(report.updated_at), 'MMM d, yyyy')}
                </span>
              </div>

              <div>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '8px', fontWeight: 600 }}>{report.meetings?.title || 'Unknown Meeting'}</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                  <Clock size={14} />
                  {format(new Date(report.updated_at), 'h:mm a')}
                </div>
              </div>

              <div className="report-preview" style={{ 
                fontSize: '0.9rem', 
                color: 'rgba(255,255,255,0.7)',
                display: '-webkit-box',
                WebkitLineClamp: 3,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                lineHeight: 1.5
              }}>
                {report.mom_summary || "No summary available for this meeting."}
              </div>

              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {report.top_topics?.slice(0, 3).map((topic, i) => (
                  <span key={i} style={{ 
                    fontSize: '0.7rem', 
                    padding: '4px 8px', 
                    background: 'rgba(255,255,255,0.05)', 
                    borderRadius: '4px',
                    color: 'var(--text-secondary)'
                  }}>
                    #{topic}
                  </span>
                ))}
              </div>

              <button 
                onClick={() => setViewingReport(report)}
                style={{
                  marginTop: '12px',
                  width: '100%',
                  padding: '12px',
                  borderRadius: '10px',
                  border: '1px solid rgba(255,255,255,0.1)',
                  background: 'rgba(255,255,255,0.05)',
                  color: 'white',
                  cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                  fontWeight: 500, fontSize: '0.9rem', transition: 'all 0.2s'
                }}
                onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
              >
                <FileText size={18} /> View Detailed Report
              </button>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default PastMeetings;
