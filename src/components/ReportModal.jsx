import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertTriangle, ListFilter, ClipboardCheck, FileText, Tag } from 'lucide-react';

const ReportModal = ({ report, onClose }) => {
  // Use fields directly from the report object (new schema)
  const { 
    mom_summary, 
    decisions = [], 
    action_items = [], 
    top_topics = [], 
    risk_level, 
    meetings 
  } = report;

  const meetingTitle = meetings?.title || report.meeting_summary || "Untitled Meeting";

  return (
    <AnimatePresence>
      <div className="modal-overlay" style={{
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)',
        zIndex: 1100, display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '20px'
      }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          style={{
            background: '#0a0a0b',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '24px',
            width: '100%', maxWidth: '850px',
            maxHeight: '90vh',
            overflowY: 'auto',
            color: 'white',
            boxShadow: '0 30px 60px rgba(0,0,0,0.8), 0 0 20px rgba(99, 102, 241, 0.1)'
          }}
        >
          {/* Header */}
          <div style={{ 
            padding: '24px 32px', 
            borderBottom: '1px solid rgba(255,255,255,0.08)',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            position: 'sticky', top: 0, background: '#0a0a0b', zIndex: 10
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <div style={{ 
                background: risk_level === 'high' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)', 
                padding: '10px', 
                borderRadius: '12px',
                color: risk_level === 'high' ? '#ef4444' : '#10b981'
              }}>
                {risk_level === 'high' ? <AlertTriangle size={24} /> : <CheckCircle size={24} />}
              </div>
              <div>
                <h2 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 700 }}>AI Meeting Audit Report</h2>
                <p style={{ margin: '4px 0 0 0', fontSize: '0.9rem', color: 'rgba(255,255,255,0.5)' }}>{meetingTitle}</p>
              </div>
            </div>
            <button onClick={onClose} style={{ 
              background: 'rgba(255,255,255,0.05)', 
              border: 'none', 
              color: '#fff', 
              cursor: 'pointer',
              padding: '8px',
              borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <X size={20} />
            </button>
          </div>

          <div style={{ padding: '32px' }}>
            {/* Top Topics / Tags */}
            {top_topics.length > 0 && (
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '24px' }}>
                {top_topics.map((topic, i) => (
                  <span key={i} style={{ 
                    background: 'rgba(99, 102, 241, 0.1)', 
                    color: '#818cf8', 
                    padding: '6px 12px', 
                    borderRadius: '20px', 
                    fontSize: '0.8rem',
                    fontWeight: 500,
                    display: 'flex', alignItems: 'center', gap: '6px'
                  }}>
                    <Tag size={12} /> {topic}
                  </span>
                ))}
              </div>
            )}

            {/* Content Sections */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '40px' }}>
              
              <Section title="Minutes of Meeting" icon={<FileText size={18} />}>
                <div style={{ 
                  lineHeight: 1.7, 
                  color: 'rgba(255,255,255,0.8)', 
                  fontSize: '1rem',
                  padding: '24px',
                  background: 'rgba(255,255,255,0.03)',
                  borderRadius: '16px',
                  border: '1px solid rgba(255,255,255,0.05)'
                }}>
                  {mom_summary || "Meeting summary is being generated or was too short to process."}
                </div>
              </Section>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
                <Section title="Key Decisions" icon={<ClipboardCheck size={18} />}>
                  <ul style={{ paddingLeft: '0', listStyle: 'none', margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {decisions.length > 0 ? decisions.map((d, i) => (
                      <li key={i} style={{ 
                        display: 'flex', gap: '12px', 
                        background: 'rgba(16, 185, 129, 0.05)', 
                        padding: '12px 16px', 
                        borderRadius: '12px',
                        borderLeft: '4px solid #10b981',
                        fontSize: '0.95rem'
                      }}>
                        <span style={{ color: '#10b981', fontWeight: 700 }}>•</span> {d}
                      </li>
                    )) : (
                      <li style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.9rem', fontStyle: 'italic' }}>No key decisions identified.</li>
                    )}
                  </ul>
                </Section>

                <Section title="Action Items" icon={<ListFilter size={18} />}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {action_items.length > 0 ? action_items.map((item, i) => (
                          <div key={i} style={{ 
                            background: 'rgba(99, 102, 241, 0.05)', 
                            padding: '12px 16px', 
                            borderRadius: '12px',
                            borderLeft: '4px solid #6366f1',
                            fontSize: '0.95rem',
                            display: 'flex', gap: '12px'
                          }}>
                              <span style={{ color: '#6366f1', fontWeight: 700 }}>→</span> {item}
                          </div>
                        )) : (
                          <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.9rem', fontStyle: 'italic' }}>No action items detected.</div>
                        )}
                    </div>
                </Section>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div style={{ 
            padding: '24px 32px', 
            borderTop: '1px solid rgba(255,255,255,0.08)', 
            display: 'flex', justifyContent: 'flex-end',
            background: 'rgba(255,255,255,0.02)'
          }}>
            <button 
              onClick={onClose}
              style={{ 
                padding: '12px 32px', 
                background: 'var(--primary-gradient)', 
                border: 'none', 
                borderRadius: '12px', 
                color: 'white', 
                fontWeight: 600, 
                cursor: 'pointer',
                boxShadow: '0 4px 15px rgba(99, 102, 241, 0.3)',
                transition: 'all 0.2s'
              }}
              onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              Close Report
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

const Section = ({ title, icon, children }) => (
  <div style={{ marginBottom: '10px' }}>
    <h3 style={{ 
      display: 'flex', alignItems: 'center', gap: '10px', 
      fontSize: '0.9rem', color: 'rgba(255,255,255,0.5)', 
      fontWeight: 600, marginBottom: '16px', 
      textTransform: 'uppercase', letterSpacing: '1.5px' 
    }}>
      {icon} {title}
    </h3>
    {children}
  </div>
);

export default ReportModal;
