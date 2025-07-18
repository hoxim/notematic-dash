import React, { useState } from 'react';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AssessmentIcon from '@mui/icons-material/Assessment';
import LogoutIcon from '@mui/icons-material/Logout';
import Dashboard from './components/Dashboard';
import Logs from './components/Logs';
import Login from './components/Login';
import { version as dashboardVersion } from './version.js';

// Helper to decode JWT (base64 decode, no validation)
function parseJwt(token: string): any {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch {
    return null;
  }
}

function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [jwt, setJwt] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [debug, setDebug] = useState<any>(null);
  const [apiResponse, setApiResponse] = useState<any>(null);
  const [selectedMenu, setSelectedMenu] = useState<'dashboard' | 'logs'>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setRole(null);
    setJwt(null);
    setDebug(null);
    setApiResponse(null);
    try {
      const res = await fetch('http://192.109.245.95:8080/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      setApiResponse(res.status + ' ' + res.statusText);
      if (!res.ok) {
        setError('Login failed');
        return;
      }
      const data = await res.json();
      setJwt(data.access_token);
      const decoded = parseJwt(data.access_token);
      setRole(decoded?.role || 'unknown');
      setDebug(decoded);
    } catch (err) {
      setError('Network error');
      setApiResponse(String(err));
    }
  };

  const handleLogout = () => {
    setJwt(null);
    setRole(null);
    setDebug(null);
    setApiResponse(null);
    setSelectedMenu('dashboard');
    setSidebarOpen(false);
  };

  // Drawer content for navigation and logout
  const drawer = (
    <div className="w-60 flex flex-col bg-base-200 h-full">
      <h1 className="text-xl font-bold text-base-content my-8 ml-4 tracking-wide">Notematic</h1>
      
      {/* Main Navigation Section */}
      <nav className="flex-1">
        <ul className="menu menu-lg">
          <li>
            <button
              className={`w-full text-left transition-all duration-200 flex items-center ${
                selectedMenu === 'dashboard' 
                  ? 'active bg-primary text-primary-content' 
                  : 'text-base-content hover:bg-base-300'
              }`}
              onClick={() => {
                setSelectedMenu('dashboard');
                setSidebarOpen(false);
              }}
            >
              <DashboardIcon className="mr-3 text-lg" />
              Dashboard
            </button>
          </li>
          {role === 'admin' && (
            <li>
              <button
                className={`w-full text-left transition-all duration-200 flex items-center ${
                  selectedMenu === 'logs' 
                    ? 'active bg-primary text-primary-content' 
                    : 'text-base-content hover:bg-base-300'
                }`}
                onClick={() => {
                  setSelectedMenu('logs');
                  setSidebarOpen(false);
                }}
              >
                <AssessmentIcon className="mr-3 text-lg" />
                Logs
              </button>
          </li>
          )}
        </ul>
      </nav>

      {/* Settings/Logout Section */}
      <div className="border-t border-base-300">
        <div className="p-4">
          <button
            className="btn btn-ghost w-full justify-start text-base-content hover:bg-base-300"
            onClick={() => {
              handleLogout();
              setSidebarOpen(false);
            }}
          >
            <LogoutIcon className="mr-3 text-lg" />
            Logout
          </button>
        </div>
      </div>
    </div>
  );

  // Show login form if not authenticated
  if (!jwt) {
    return (
      <Login
        email={email}
        password={password}
        setEmail={setEmail}
        setPassword={setPassword}
        handleLogin={handleLogin}
        error={error}
        apiResponse={apiResponse}
        dashboardVersion={dashboardVersion}
      />
    );
  }

  // Main layout with responsive sidebar
  return (
    <div className="flex h-screen bg-base-100 overflow-hidden" data-theme="dark">
      {/* Top navigation bar */}
      <header className="fixed top-0 left-0 right-0 bg-base-200 z-50">
        <div className="navbar">
          <div className="navbar-start">
            <button
              className="btn btn-ghost lg:hidden"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <MenuIcon />
            </button>
            <h1 className="text-lg font-semibold text-base-content">Notematic</h1>
          </div>
        </div>
      </header>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 h-full z-50 transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        {drawer}
      </aside>

      {/* Main content */}
      <main className="flex-1 p-4 md:p-8 mt-16 flex flex-col items-center overflow-x-hidden overflow-y-auto">
        <div className="w-full mx-auto flex flex-col items-center">
          {selectedMenu === 'dashboard' && <Dashboard role={role} debug={debug} />}
          {selectedMenu === 'logs' && role === 'admin' && jwt && <Logs jwt={jwt} role={role} />}
        </div>
        {dashboardVersion && (
          <div className="fixed bottom-2 right-3 text-xs text-base-content bg-base-300 bg-opacity-50 px-2 py-1 rounded z-50">
            v{dashboardVersion}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
