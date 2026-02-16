import React from 'react';
import { motion } from 'framer-motion';
import { LogOut } from 'lucide-react';
import UpcomingMeetings from './UpcomingMeetings';

const Dashboard = ({ token, logout, user }) => {
  return (
    <div className="dashboard-container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      
      {/* Header */}
      <div className="dashboard-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', paddingBottom: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, background: 'var(--primary-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Meeting Auditor AI
        </h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {user && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
               <img src={user.picture} alt={user.name} style={{ width: '32px', height: '32px', borderRadius: '50%' }} />
               <span style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.8)' }}>{user.name}</span>
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
              cursor: 'pointer'
            }}
          >
            <LogOut size={16} /> Sign Out
          </button>
        </div>
      </div>

      {/* Content Area */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <UpcomingMeetings token={token} user={user} />
      </motion.div>
    </div>
  );
};

export default Dashboard;
