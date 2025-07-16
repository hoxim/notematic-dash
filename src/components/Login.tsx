import React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

// Login form component, centered on the page
interface LoginProps {
  email: string;
  password: string;
  setEmail: (v: string) => void;
  setPassword: (v: string) => void;
  handleLogin: (e: React.FormEvent) => void;
  error: string | null;
  apiResponse: string | null;
  dashboardVersion: string | undefined;
}

const Login: React.FC<LoginProps> = ({ email, password, setEmail, setPassword, handleLogin, error, apiResponse, dashboardVersion }) => {
  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#222' }}>
      <Box sx={{ width: 340, bgcolor: '#222', p: 4, borderRadius: 2, boxShadow: 3 }}>
        <Typography variant="h6" sx={{ mb: 2, color: '#fff', textAlign: 'center' }}>Notematic Dashboard Login</Typography>
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            style={{ width: '100%', marginBottom: 12, padding: 10, borderRadius: 4, border: '1px solid #444', background: '#111', color: '#fff' }}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            style={{ width: '100%', marginBottom: 12, padding: 10, borderRadius: 4, border: '1px solid #444', background: '#111', color: '#fff' }}
          />
          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 1 }}>
            Login
          </Button>
        </form>
        {error && <Typography color="error" sx={{ mt: 2 }}>{error}</Typography>}
        {apiResponse && <Typography color="text.secondary" sx={{ mt: 1, fontSize: 13 }}>API response: {apiResponse}</Typography>}
      </Box>
      {dashboardVersion && (
        <Box sx={{ position: 'fixed', right: 12, bottom: 8, fontSize: 12, color: '#fff', background: 'rgba(0,0,0,0.5)', px: 2, py: 0.5, borderRadius: 6, zIndex: 1000 }}>
          v{dashboardVersion}
        </Box>
      )}
    </Box>
  );
};

export default Login; 