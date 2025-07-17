import React from 'react';

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
    <div className="w-full max-w-full overflow-x-auto">
      <h2 className="text-2xl font-bold text-white mb-4">Logs</h2>
      {logsLoading && <div className="text-gray-300 mb-4">Loading logs...</div>}
      {logsError && <div className="text-red-400 mb-4">{logsError}</div>}
      {logs && (
        <div className="bg-gray-900 text-green-400 p-4 rounded border border-gray-700 max-h-96 overflow-auto w-full max-w-full font-mono text-sm">
          {logs.length === 0 ? 'No logs found.' : logs.join('\n')}
        </div>
      )}
    </div>
  );
};

export default Logs; 