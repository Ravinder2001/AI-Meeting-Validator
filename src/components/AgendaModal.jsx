import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, FileText, Calendar } from 'lucide-react';

const AgendaModal = ({ meeting, onClose, onConfirm }) => {
  const [editedAgenda, setEditedAgenda] = useState(
    meeting.description || "No description provided. Add your agenda here..."
  );

  return (
    <AnimatePresence>
      <div className="modal-overlay" style={{
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)',
        zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center'
      }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          style={{
            background: '#1a1a1a',
            backgroundImage: 'linear-gradient(to bottom right, #1f1f1f, #151515)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '24px',
            width: '90%', maxWidth: '550px',
            padding: '32px',
            color: 'white',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)'
          }}
        >
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
            <div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 700, margin: '0 0 8px 0', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ 
                  background: 'rgba(99, 102, 241, 0.1)', 
                  color: '#818cf8', 
                  padding: '8px', 
                  borderRadius: '12px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  <FileText size={24} />
                </span>
                Configure Mission
              </h2>
              <p style={{ margin: 0, color: '#888', fontSize: '0.95rem' }}>
                Review and refine the autopilot instructions.
              </p>
            </div>
            <button 
              onClick={onClose} 
              style={{ 
                background: 'rgba(255,255,255,0.05)', 
                border: 'none', 
                color: '#aaa', 
                cursor: 'pointer',
                padding: '8px',
                borderRadius: '50%',
                transition: 'all 0.2s',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = 'white'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = '#aaa'; }}
            >
              <X size={20} />
            </button>
          </div>

          {/* Meeting Info Badge */}
          <div style={{ 
            background: 'rgba(99, 102, 241, 0.05)', 
            border: '1px solid rgba(99, 102, 241, 0.1)', 
            borderRadius: '12px', 
            padding: '12px 16px', 
            marginBottom: '24px',
            display: 'flex', alignItems: 'center', gap: '12px'
          }}>
            <Calendar size={18} color="#818cf8" />
            <span style={{ color: '#e0e0e0', fontSize: '0.95rem', fontWeight: 500 }}>
              {meeting.summary}
            </span>
          </div>

          {/* Agenda Editor */}
          <div style={{ marginBottom: '32px' }}>
            <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, color: '#e0e0e0', marginBottom: '12px' }}>
              Mission Brief / Agenda
            </label>
            <div style={{ position: 'relative' }}>
              <textarea
                value={editedAgenda}
                onChange={(e) => setEditedAgenda(e.target.value)}
                placeholder="Paste the meeting agenda or type instructions for the AI..."
                style={{
                  width: '94%', height: '180px',
                  background: '#121212',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '12px',
                  padding: '16px',
                  color: '#e0e0e0',
                  fontFamily: "'Menlo', 'Monaco', 'Courier New', monospace",
                  fontSize: '0.9rem',
                  resize: 'none',
                  outline: 'none',
                  lineHeight: '1.6',
                  transition: 'border-color 0.2s'
                }}
                onFocus={(e) => e.target.style.borderColor = '#6366f1'}
                onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
              />
            </div>
            <p style={{ marginTop: '8px', fontSize: '0.8rem', color: '#666' }}>
              Tip: Be specific about what the AI should look for.
            </p>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
            <button 
              onClick={onClose}
              style={{
                padding: '12px 24px', borderRadius: '12px',
                background: 'transparent',
                border: '1px solid rgba(255,255,255,0.1)',
                color: '#aaa', 
                cursor: 'pointer',
                fontWeight: 500,
                fontSize: '0.95rem',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.color = 'white'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = '#aaa'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; }}
            >
              Cancel
            </button>
            <button
              onClick={() => onConfirm(editedAgenda)}
              style={{
                padding: '12px 24px', borderRadius: '12px',
                background: 'var(--primary-gradient)',
                border: 'none',
                color: 'white', fontWeight: 600,
                fontSize: '0.95rem',
                display: 'flex', alignItems: 'center', gap: '8px',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)',
                transition: 'transform 0.1s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-1px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <Send size={18} /> Deploy Auditor
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default AgendaModal;
