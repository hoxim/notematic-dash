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
    <div className="w-full">
      <h2 className="text-2xl font-bold text-base-content mb-4">Logs</h2>
      {logsLoading && <div className="text-base-content opacity-70 mb-4">Loading logs...</div>}
      {logsError && <div className="alert alert-error mb-4">
        <span>{logsError}</span>
      </div>}
      {logs && (
        <div className="card bg-base-200 shadow-xl">
          <div className="card-body">
            <h3 className="card-title text-base-content">System Logs</h3>
            <div className="max-h-[70vh] overflow-y-auto overflow-x-hidden">
              {logs.length === 0 ? (
                <div className="text-base-content opacity-50 italic">No logs found.</div>
              ) : (
                <div className="mockup-code bg-base-300">
                  {logs.map((log, index) => (
                    <pre key={index} data-prefix={`[${index + 1}]`} className="break-words whitespace-pre-wrap">
                      <code className="text-success">{log}</code>
                    </pre>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Logs; 