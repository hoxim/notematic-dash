import { useState } from 'react';
import './App.css';

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
    <div className="dashboard-container">
      <h2>Welcome to Notematic Dashboard</h2>
      <p>
        <strong>Role:</strong> {role === 'admin' ? 'admin' : 'user'}
      </p>
      <button onClick={() => { setJwt(null); setRole(null); setDebug(null); setApiResponse(null); }}>Logout</button>
      <div className="debug">
        <h4>Debug info (decoded JWT):</h4>
        <pre>{JSON.stringify(debug, null, 2)}</pre>
      </div>
    </div>
  );
}

export default App;
