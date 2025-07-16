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
import Login from './components/Login';

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
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#222' }}>
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
      {/* Sidebar Drawer, fixed width, no own scroll */}
      <Box component="nav" sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}>
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
      {/* Main content, flex:1, centered, no horizontal scroll */}
      <Box
        component="main"
        sx={{
          flex: 1,
          p: { xs: 1, sm: 3 },
          mt: 8,
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          overflowX: 'hidden',
        }}
      >
        <Box sx={{ width: '100%', maxWidth: 900, minHeight: 200, mx: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
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
