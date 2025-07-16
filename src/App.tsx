import { useState, useEffect } from 'react';
import './App.css';
import React from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Logs from './components/Logs';
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
      <div style={{ display: 'flex', minHeight: '100vh' }}>
        <Sidebar
          selectedMenu={selectedMenu}
          setSelectedMenu={setSelectedMenu}
          role={role}
          handleLogout={handleLogout}
        />
        <div style={{ flex: 1, padding: 32 }}>
          {selectedMenu === 'dashboard' && (
            <Dashboard role={role} debug={debug} />
          )}
          {selectedMenu === 'logs' && role === 'admin' && jwt && (
            <Logs jwt={jwt} role={role} />
          )}
        </div>
      </div>
      {dashboardVersion && (
        <div style={{ position: 'fixed', right: 12, bottom: 8, fontSize: 12, color: '#fff', background: 'rgba(0,0,0,0.5)', padding: '2px 10px', borderRadius: 6, zIndex: 1000 }}>
          v{dashboardVersion}
        </div>
      )}
    </>
  );
}

export default App;
