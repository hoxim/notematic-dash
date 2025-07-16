import React, { useState } from 'react';
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

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
    <Box sx={{ width: drawerWidth, display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Typography variant="h6" sx={{ my: 3, ml: 2, fontWeight: 700, letterSpacing: 1 }}>
        Notematic
      </Typography>
      <List>
        <ListItem disablePadding>
          <ListItemButton selected={selectedMenu === 'dashboard'} onClick={() => { setSelectedMenu('dashboard'); setMobileOpen(false); }}>
            <ListItemText primary="Dashboard" />
          </ListItemButton>
        </ListItem>
        {role === 'admin' && (
          <ListItem disablePadding>
            <ListItemButton selected={selectedMenu === 'logs'} onClick={() => { setSelectedMenu('logs'); setMobileOpen(false); }}>
              <ListItemText primary="Logs" />
            </ListItemButton>
          </ListItem>
        )}
      </List>
      <Box sx={{ flex: 1 }} />
      <Button
        variant="contained"
        color="error"
        sx={{ m: 2, width: 'calc(100% - 32px)' }}
        onClick={handleLogout}
      >
        Logout
      </Button>
    </Box>
  );

  if (!jwt) {
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
  }

  // Main layout with AppBar, Drawer, and main content
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#222', width: '100vw', overflowX: 'hidden' }}>
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, bgcolor: '#181818' }}>
        <Toolbar>
          {isMobile && (
            <IconButton color="inherit" edge="start" onClick={() => setMobileOpen(true)} sx={{ mr: 2 }}>
              <MenuIcon />
            </IconButton>
          )}
          <Typography variant="h6" noWrap component="div">
            Notematic
          </Typography>
        </Toolbar>
      </AppBar>
      <Box component="nav" sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}>
        {/* Drawer for navigation, permanent on desktop, temporary on mobile */}
        <Drawer
          variant={isMobile ? 'temporary' : 'permanent'}
          open={isMobile ? mobileOpen : true}
          onClose={() => setMobileOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', md: 'block' },
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              boxSizing: 'border-box',
              bgcolor: '#222',
              color: '#fff',
            },
          }}
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flex: 1,
          p: { xs: 1, sm: 3 },
          mt: 8,
          ml: { md: `${drawerWidth}px` }, // margin left for desktop
          width: { xs: '100vw', md: `calc(100vw - ${drawerWidth}px)` },
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          overflowX: 'hidden',
        }}
      >
        {/* Main content area, max width for dashboard/logs */}
        <Box sx={{ width: '100%', maxWidth: 800, minHeight: 200, mx: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {selectedMenu === 'dashboard' && <Dashboard role={role} debug={debug} />}
          {selectedMenu === 'logs' && role === 'admin' && jwt && <Logs jwt={jwt} role={role} />}
        </Box>
        {dashboardVersion && (
          <Box sx={{ position: 'fixed', right: 12, bottom: 8, fontSize: 12, color: '#fff', background: 'rgba(0,0,0,0.5)', px: 2, py: 0.5, borderRadius: 6, zIndex: 1000 }}>
            v{dashboardVersion}
          </Box>
        )}
      </Box>
    </Box>
  );
}

export default App;
