import React from 'react';

interface SidebarProps {
  selectedMenu: 'dashboard' | 'logs';
  setSelectedMenu: (menu: 'dashboard' | 'logs') => void;
  role: string | null;
  handleLogout: () => void;
}

// Sidebar menu for navigation
const Sidebar: React.FC<SidebarProps> = ({ selectedMenu, setSelectedMenu, role, handleLogout }) => {
  return (
    <div style={{ width: 220, background: '#222', color: '#fff', padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <h3 style={{ color: '#fff', marginBottom: 32 }}>Notematic</h3>
      <button
        style={{ background: selectedMenu === 'dashboard' ? '#444' : 'transparent', color: '#fff', border: 'none', padding: '12px 8px', textAlign: 'left', cursor: 'pointer', borderRadius: 4 }}
        onClick={() => setSelectedMenu('dashboard')}
      >
        Dashboard
      </button>
      {role === 'admin' && (
        <button
          style={{ background: selectedMenu === 'logs' ? '#444' : 'transparent', color: '#fff', border: 'none', padding: '12px 8px', textAlign: 'left', cursor: 'pointer', borderRadius: 4 }}
          onClick={() => setSelectedMenu('logs')}
        >
          Logs
        </button>
      )}
      <div style={{ flex: 1 }} />
      <button
        style={{ background: '#c00', color: '#fff', border: 'none', padding: '10px 8px', borderRadius: 4, cursor: 'pointer', marginTop: 32 }}
        onClick={handleLogout}
      >
        Logout
      </button>
    </div>
  );
};

export default Sidebar; 