import React from 'react';
import Box from '@mui/material/Box';

// Props for Logs component
interface LogsProps {
  jwt: string;
  role: string | null;
}

// Logs view for admin, fetches and displays logs from API
const Logs: React.FC<LogsProps> = ({ jwt, role }) => {
  // State for logs, error, and loading
  const [logs, setLogs] = React.useState<string[] | null>(null);
  const [logsError, setLogsError] = React.useState<string | null>(null);
  const [logsLoading, setLogsLoading] = React.useState<boolean>(false);

  // Fetch logs from API when role/jwt changes
  React.useEffect(() => {
    if (role === 'admin' && jwt) {
      setLogsLoading(true);
      setLogsError(null);
      fetch('http://192.109.245.95:8080/admin/logs', {
        headers: { 'Authorization': `Bearer ${jwt}` },
      })
        .then(res => {
          if (!res.ok) throw new Error('Failed to fetch logs');
          return res.json();
        })
        .then(data => {
          setLogs(Array.isArray(data.logs) ? data.logs : []);
        })
        .catch(() => {
          setLogsError('Could not load logs');
        })
        .finally(() => setLogsLoading(false));
    }
  }, [jwt, role]);

  if (role !== 'admin') return null;

  return (
    <Box sx={{ width: '100%', maxWidth: '100%', overflowX: 'auto' }}>
      <h2>Logs</h2>
      {logsLoading && <div>Loading logs...</div>}
      {logsError && <div className="error">{logsError}</div>}
      {logs && (
        <Box
          component="pre"
          sx={{
            background: '#111',
            color: '#0f0',
            padding: 2,
            borderRadius: 2,
            maxHeight: 500,
            overflow: 'auto',
            width: '100%',
            maxWidth: '100%',
            fontFamily: 'monospace',
            fontSize: '1rem',
            boxSizing: 'border-box',
          }}
        >
          {logs.length === 0 ? 'No logs found.' : logs.join('\n')}
        </Box>
      )}
    </Box>
  );
};

export default Logs; 