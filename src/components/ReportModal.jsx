import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertTriangle, TrendingUp, Link as LinkIcon, FileText } from 'lucide-react';

const ReportModal = ({ report, onClose }) => {
  const data = report.report_data || {};

  return (
    <AnimatePresence>
      <div className="modal-overlay" style={{
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)',
        zIndex: 1100, display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '20px'
      }}>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          style={{
            background: '#121212',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '24px',
            width: '100%', maxWidth: '800px',
            maxHeight: '85vh',
            overflowY: 'auto',
            color: 'white',
            boxShadow: '0 30px 60px rgba(0,0,0,0.5)'
          }}
        >
          {/* Header */}
          <div style={{ 
            padding: '24px 32px', 
            borderBottom: '1px solid rgba(255,255,255,0.1)',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            position: 'sticky', top: 0, background: '#121212', zIndex: 10
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <div style={{ background: '#10b981', padding: '8px', borderRadius: '10px' }}>
                <CheckCircle size={24} color="white" />
              </div>
              <div>
                <h2 style={{ margin: 0, fontSize: '1.25rem' }}>AI Meeting Audit</h2>
                <p style={{ margin: 0, fontSize: '0.85rem', color: '#888' }}>{report.meeting_summary}</p>
              </div>
            </div>
            <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#666', cursor: 'pointer' }}>
              <X size={24} />
            </button>
          </div>

          <div style={{ padding: '32px' }}>
            {/* Quick Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '15px', marginBottom: '32px' }}>
              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '15px', borderRadius: '15px', textAlign: 'center' }}>
                <TrendingUp size={20} color="#818cf8" style={{ marginBottom: '8px' }} />
                <div style={{ fontSize: '0.75rem', color: '#888', textTransform: 'uppercase' }}>Sentiment</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 600 }}>{data.sentiment || 'Positive'}</div>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '15px', borderRadius: '15px', textAlign: 'center' }}>
                <AlertTriangle size={20} color="#f59e0b" style={{ marginBottom: '8px' }} />
                <div style={{ fontSize: '0.75rem', color: '#888', textTransform: 'uppercase' }}>Risks</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 600 }}>{data.risks_detected || 0}</div>
              </div>
            </div>

            {/* Content Sections */}
            <Section title="Minutes of Meeting" icon={<FileText size={18} />}>
              <p style={{ lineHeight: 1.6, color: '#ccc', fontSize: '0.95rem' }}>
                {data.mom && data.mom !== "N/A" 
                  ? data.mom 
                  : "Meeting was too short or no audio was detected to generate a summary."}
              </p>
            </Section>

            <Section title="Key Decisions" icon={<CheckCircle size={18} />}>
              <ul style={{ paddingLeft: '20px', color: '#ccc' }}>
                {(data.decisions || ['No specific decisions recorded']).map((d, i) => <li key={i} style={{ marginBottom: '8px' }}>{d}</li>)}
              </ul>
            </Section>

            <Section title="Action Items" icon={<LinkIcon size={18} />}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {(data.action_items || []).map((item, i) => (
                        <div key={i} style={{ borderLeft: '3px solid #6366f1', padding: '10px 15px', background: 'rgba(99, 102, 241, 0.05)', borderRadius: '0 8px 8px 0' }}>
                            {item}
                        </div>
                    ))}
                    {(!data.action_items || data.action_items.length === 0) && <p style={{ color: '#666' }}>No action items detected.</p>}
                </div>
            </Section>
          </div>

          {/* Footer */}
          <div style={{ padding: '20px 32px', borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'flex-end' }}>
            <button 
              onClick={onClose}
              style={{ padding: '10px 24px', background: 'var(--primary-gradient)', border: 'none', borderRadius: '10px', color: 'white', fontWeight: 600, cursor: 'pointer' }}
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
  <div style={{ marginBottom: '32px' }}>
    <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1rem', color: '#818cf8', fontWeight: 600, marginBottom: '15px', textTransform: 'uppercase', letterSpacing: '1px' }}>
      {icon} {title}
    </h3>
    {children}
  </div>
);

export default ReportModal;
