import { useState } from 'react';
import './App.css';
import React from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Logs from './components/Logs';
import { version as dashboardVersion } from './version.js'

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

  if (!jwt) {
    return (
      <div className="login-container">
        <h2>Notematic Dashboard Login</h2>
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          <button type="submit">Login</button>
        </form>
        {error && <div className="error">{error}</div>}
        {apiResponse && <div className="debug">API response: {apiResponse}</div>}
      </div>
    );
  }

  return (
    <>
      <div style={{ display: 'flex', minHeight: '100vh', background: '#222' }}>
        <Sidebar
          selectedMenu={selectedMenu}
          setSelectedMenu={setSelectedMenu}
          role={role}
          handleLogout={handleLogout}
        />
        <main
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '24px 8px',
            width: '100%',
            boxSizing: 'border-box',
          }}
        >
          <div
            style={{
              width: '100%',
              maxWidth: 800,
              minHeight: 200,
              margin: '0 auto',
              background: 'none',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            {selectedMenu === 'dashboard' && <Dashboard role={role} debug={debug} />}
            {selectedMenu === 'logs' && role === 'admin' && jwt && <Logs jwt={jwt} role={role} />}
          </div>
        </main>
      </div>
      {dashboardVersion && (
        <div style={{ position: 'fixed', right: 12, bottom: 8, fontSize: 12, color: '#fff', background: 'rgba(0,0,0,0.5)', padding: '2px 10px', borderRadius: 6, zIndex: 1000 }}>
          v{dashboardVersion}
        </div>
      )}
      <style>{`
        @media (max-width: 700px) {
          .sidebar {
            width: 60px !important;
            padding: 12px 4px !important;
          }
          main > div {
            max-width: 98vw !important;
            padding: 0 !important;
          }
        }
      `}</style>
    </>
  );
}

export default App;
