import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, User, Calendar, History } from 'lucide-react';
import UpcomingMeetings from './UpcomingMeetings';
import PastMeetings from './PastMeetings';

const Dashboard = ({ token, logout, user }) => {
  const [activeTab, setActiveTab] = useState('upcoming');

  return (
    <div className="dashboard-container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px', minHeight: '100vh' }}>
      
      {/* Header */}
      <div className="dashboard-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', paddingBottom: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, background: 'var(--primary-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Meeting Auditor AI
        </h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {user && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.1)', padding: '6px 12px', borderRadius: '20px' }}>
               {user.picture ? (
                 <img 
                   src={user.picture} 
                   alt={user.name} 
                   style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover', border: '2px solid rgba(255,255,255,0.2)' }} 
                 />
               ) : <User size={24} color="white" />}
               <span style={{ fontSize: '0.9rem', color: 'white', fontWeight: 500 }}>{user.name}</span>
            </div>
          )}
          <button 
            onClick={logout} 
            className="logout-btn"
            style={{
              background: 'transparent',
              border: '1px solid rgba(255,255,255,0.2)',
              color: 'white',
              padding: '8px 16px',
              borderRadius: '8px',
              display: 'flex', alignItems: 'center', gap: '8px',
              cursor: 'pointer',
              fontFamily: 'inherit',
              fontWeight: 500
            }}
          >
            <LogOut size={16} /> Sign Out
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs-container" style={{ display: 'flex', gap: '12px', marginBottom: '32px' }}>
        <button 
          onClick={() => setActiveTab('upcoming')}
          style={{
            background: activeTab === 'upcoming' ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
            color: activeTab === 'upcoming' ? '#818cf8' : 'var(--text-secondary)',
            // border: 'none',
            padding: '10px 20px',
            borderRadius: '12px',
            cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: '8px',
            fontWeight: 600,
            fontSize: '0.95rem',
            transition: 'all 0.2s',
            border: activeTab === 'upcoming' ? '1px solid rgba(99, 102, 241, 0.2)' : '1px solid transparent'
          }}
        >
          <Calendar size={18} /> Upcoming Meetings
        </button>
        <button 
          onClick={() => setActiveTab('past')}
          style={{
            background: activeTab === 'past' ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
            color: activeTab === 'past' ? '#818cf8' : 'var(--text-secondary)',
            // border: 'none',
            padding: '10px 20px',
            borderRadius: '12px',
            cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: '8px',
            fontWeight: 600,
            fontSize: '0.95rem',
            transition: 'all 0.2s',
            border: activeTab === 'past' ? '1px solid rgba(99, 102, 241, 0.2)' : '1px solid transparent'
          }}
        >
          <History size={18} /> Past Meetings
        </button>
      </div>

      {/* Content Area */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: activeTab === 'upcoming' ? -10 : 10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: activeTab === 'upcoming' ? 10 : -10 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === 'upcoming' ? (
            <UpcomingMeetings token={token} user={user} />
          ) : (
            <PastMeetings />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default Dashboard;
