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
    <div className="sidebar" style={{ width: 230, minWidth: 60, background: '#222', color: '#fff', padding: 24, display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'flex-start', height: '100vh', boxSizing: 'border-box', position: 'sticky', left: 0, top: 0 }}>
      <h3 style={{ color: '#fff', marginBottom: 32, fontSize: 22, letterSpacing: 1 }}>Notematic</h3>
      <button
        style={{ background: selectedMenu === 'dashboard' ? '#444' : 'transparent', color: '#fff', border: 'none', padding: '12px 8px', textAlign: 'left', cursor: 'pointer', borderRadius: 4, width: '100%' }}
        onClick={() => setSelectedMenu('dashboard')}
      >
        Dashboard
      </button>
      <button class="btn">Button</button>
      {role === 'admin' && (
        <button
          style={{ background: selectedMenu === 'logs' ? '#444' : 'transparent', color: '#fff', border: 'none', padding: '12px 8px', textAlign: 'left', cursor: 'pointer', borderRadius: 4, width: '100%' }}
          onClick={() => setSelectedMenu('logs')}
        >
          Logs
        </button>
      )}
      <div style={{ flex: 1 }} />
      <button
        style={{ background: '#c00', color: '#fff', border: 'none', padding: '10px 8px', borderRadius: 4, cursor: 'pointer', width: '100%', marginTop: 0, marginBottom: 8 }}
        onClick={handleLogout}
      >
        Logout
      </button>
    </div>
  );
};

export default Sidebar; 