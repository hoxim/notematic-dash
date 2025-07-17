import React, { useState } from 'react';
import MenuIcon from '@mui/icons-material/Menu';
import Dashboard from './components/Dashboard';
import Logs from './components/Logs';
import Login from './components/Login';
import Button from './components/Button';
import { version as dashboardVersion } from './version.js';

// Helper to decode JWT (base64 decode, no validation)
function parseJwt(token: string): any {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch {
    return null;
  }
}

// Drawer width for desktop layout
const drawerWidth = 240;

function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [jwt, setJwt] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [debug, setDebug] = useState<any>(null);
  const [apiResponse, setApiResponse] = useState<any>(null);
  const [selectedMenu, setSelectedMenu] = useState<'dashboard' | 'logs'>('dashboard');
  const [mobileOpen, setMobileOpen] = useState(false);

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
  };

  // Drawer content for navigation and logout
  const drawer = (
    <div className="w-60 flex flex-col h-screen bg-stone-800">
      <h1 className="text-xl font-bold text-white my-8 ml-4 tracking-wide">Notematic</h1>
      <nav className="flex-1">
        <ul className="space-y-1">
          <li>
            <button
              className={`w-full text-left px-4 py-3 rounded-lg mx-2 transition-all duration-200 ${
                selectedMenu === 'dashboard' 
                  ? 'bg-stone-700 text-white' 
                  : 'text-stone-300 hover:bg-stone-700 hover:text-white'
              }`}
              onClick={() => setSelectedMenu('dashboard')}
            >
              Dashboard
            </button>
          </li>
          {role === 'admin' && (
            <li>
              <button
                className={`w-full text-left px-4 py-3 rounded-lg mx-2 transition-all duration-200 ${
                  selectedMenu === 'logs' 
                    ? 'bg-stone-700 text-white' 
                    : 'text-stone-300 hover:bg-stone-700 hover:text-white'
                }`}
                onClick={() => setSelectedMenu('logs')}
              >
                Logs
              </button>
            </li>
          )}
        </ul>
      </nav>
      <div className="p-4">
        <Button 
          variant="danger" 
          className="w-full" 
          onClick={handleLogout}
        >
          Logout
        </Button>
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

  // Main layout with AppBar, Drawer, and main content
  return (
    <div className="flex min-h-screen bg-stone-950">
      {/* Top navigation bar */}
      <header className="fixed top-0 left-0 right-0 bg-stone-900 z-50">
        <div className="flex items-center px-4 py-2">
          <button
            className="md:hidden mr-4 p-2 text-white hover:bg-stone-800 rounded"
            onClick={() => setMobileOpen(true)}
          >
            <MenuIcon />
          </button>
          <h1 className="text-lg font-semibold text-white">Notematic</h1>
        </div>
      </header>

      {/* Sidebar Drawer, fixed width, no own scroll */}
      <aside className="w-60 flex-shrink-0 bg-stone-800 flex flex-col">
        {drawer}
      </aside>

      {/* Main content, flex:1, centered, no horizontal scroll */}
      <main className="flex-1 p-4 md:p-8 mt-16 min-h-screen flex flex-col items-center overflow-x-hidden">
        <div className="w-full max-w-4xl min-h-48 mx-auto flex flex-col items-center">
          {selectedMenu === 'dashboard' && <Dashboard role={role} debug={debug} />}
          {selectedMenu === 'logs' && role === 'admin' && jwt && <Logs jwt={jwt} role={role} />}
        </div>
        {dashboardVersion && (
          <div className="fixed bottom-2 right-3 text-xs text-white bg-black bg-opacity-50 px-2 py-1 rounded z-50">
            v{dashboardVersion}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
