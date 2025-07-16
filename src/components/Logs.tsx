import React from 'react';

interface LogsProps {
  jwt: string;
  role: string | null;
}

// Logs view for admin
const Logs: React.FC<LogsProps> = ({ jwt, role }) => {
  const [logs, setLogs] = React.useState<string[] | null>(null);
  const [logsError, setLogsError] = React.useState<string | null>(null);
  const [logsLoading, setLogsLoading] = React.useState<boolean>(false);

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
    <div>
      <h2>Logs</h2>
      {logsLoading && <div>Loading logs...</div>}
      {logsError && <div className="error">{logsError}</div>}
      {logs && (
        <pre style={{ background: '#111', color: '#0f0', padding: 16, borderRadius: 6, maxHeight: 500, overflow: 'auto' }}>
          {logs.length === 0 ? 'No logs found.' : logs.join('\n')}
        </pre>
      )}
    </div>
  );
};

export default Logs; 