import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { FileText, Calendar, Clock, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { fetchPastMeetingReports } from '../services/auditService';
import ReportModal from './ReportModal';

const PastMeetings = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewingReport, setViewingReport] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

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

  const filteredReports = reports.filter(report => 
    report.meetings?.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    total: reports.length,
    highRisk: reports.filter(r => r.risk_level === 'high').length,
    avgCompliance: reports.length > 0 ? 'High' : 'N/A' // Simulating for now
  };

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

      {/* Stats Summary */}
      <div className="stats-summary" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '32px' }}>
        <div style={{ background: 'rgba(99, 102, 241, 0.05)', padding: '20px', borderRadius: '16px', border: '1px solid rgba(99, 102, 241, 0.1)' }}>
          <div style={{ color: '#818cf8', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: '8px' }}>Total Audited</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 700 }}>{stats.total}</div>
        </div>
        <div style={{ background: 'rgba(239, 68, 68, 0.05)', padding: '20px', borderRadius: '16px', border: '1px solid rgba(239, 68, 68, 0.1)' }}>
          <div style={{ color: '#ef4444', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: '8px' }}>High Risk Detected</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 700 }}>{stats.highRisk}</div>
        </div>
        <div style={{ background: 'rgba(16, 185, 129, 0.05)', padding: '20px', borderRadius: '16px', border: '1px solid rgba(16, 185, 129, 0.1)' }}>
          <div style={{ color: '#10b981', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: '8px' }}>System Health</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 700 }}>Optimal</div>
        </div>
      </div>

      {/* Search Bar */}
      <div style={{ marginBottom: '32px', position: 'relative' }}>
        <input 
          type="text" 
          placeholder="Search by meeting title..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: '100%',
            padding: '16px 20px',
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '12px',
            color: 'white',
            fontSize: '1rem',
            outline: 'none',
            transition: 'border-color 0.2s'
          }}
          onFocus={(e) => e.target.style.borderColor = 'rgba(99, 102, 241, 0.5)'}
          onBlur={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)'}
        />
      </div>

      <div className="reports-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '24px' }}>
        {filteredReports.length === 0 ? (
          <div style={{ textAlign: 'center', color: 'var(--text-secondary)', gridColumn: '1/-1', padding: '60px 20px' }}>
            <Calendar size={48} style={{ marginBottom: '16px', opacity: 0.3 }} />
            <p style={{ fontSize: '1.1rem' }}>No matching reports found.</p>
          </div>
        ) : (
          filteredReports.map((report) => (
            <motion.div 
              key={report.id}
              className="report-card"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ y: -5 }}
              style={{
                background: 'rgba(255,255,255,0.05)',
                padding: '24px',
                borderRadius: '20px',
                border: report.risk_level === 'high' ? '1px solid rgba(239, 68, 68, 0.2)' : '1px solid rgba(255,255,255,0.1)',
                display: 'flex', flexDirection: 'column', gap: '16px',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              {report.risk_level === 'high' && (
                <div style={{ 
                  position: 'absolute', top: 0, right: 0, 
                  width: '4px', height: '100%', 
                  background: 'var(--danger)',
                  boxShadow: '0 0 10px var(--danger)'
                }} />
              )}

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
                <h3 style={{ fontSize: '1.2rem', marginBottom: '8px', fontWeight: 600, color: 'white' }}>{report.meetings?.title || 'Unknown Meeting'}</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                  <Clock size={14} />
                  {format(new Date(report.updated_at), 'h:mm a')}
                </div>
              </div>

              <div className="report-preview" style={{ 
                fontSize: '0.9rem', 
                color: 'rgba(255,255,255,0.6)',
                display: '-webkit-box',
                WebkitLineClamp: 3,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                lineHeight: 1.6
              }}>
                {report.mom_summary || "No summary available for this meeting."}
              </div>

              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {report.top_topics?.slice(0, 3).map((topic, i) => (
                  <span key={i} style={{ 
                    fontSize: '0.7rem', 
                    padding: '4px 10px', 
                    background: 'rgba(255,255,255,0.05)', 
                    borderRadius: '6px',
                    color: '#818cf8',
                    border: '1px solid rgba(129, 140, 248, 0.1)'
                  }}>
                    #{topic}
                  </span>
                ))}
              </div>

              <button 
                onClick={() => setViewingReport(report)}
                style={{
                  marginTop: 'auto',
                  width: '100%',
                  padding: '14px',
                  borderRadius: '12px',
                  border: 'none',
                  background: 'var(--primary-gradient)',
                  color: 'white',
                  cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                  fontWeight: 600, fontSize: '0.95rem', transition: 'all 0.2s',
                  boxShadow: '0 4px 12px rgba(99, 102, 241, 0.2)'
                }}
                onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <FileText size={18} /> View AI Insight
              </button>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default PastMeetings;
