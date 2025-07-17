import React from 'react';

// Props for Logs component
interface LogsProps {
  jwt: string;
  role: string | null;
}

// Logs view for admin, fetches and displays logs from API
const Logs: React.FC<LogsProps> = ({ jwt, role }) => {
  // State for logs, error, loading, and auto-refresh
  const [logs, setLogs] = React.useState<string[] | null>(null);
  const [logsError, setLogsError] = React.useState<string | null>(null);
  const [logsLoading, setLogsLoading] = React.useState<boolean>(false);
  const [autoRefresh, setAutoRefresh] = React.useState<boolean>(false);

  // Helper to extract and format timestamp from log line
  const formatLogLine = (log: string) => {
    // Szukaj timestampu w formacie 2025-07-17T14:16:02.123456Z lub podobnym
    const match = log.match(/(\d{4}-\d{2}-\d{2}[T ](\d{2}):(\d{2}):(\d{2})\.(\d{3,6}))/);
    if (match) {
      // match[2]=HH, [3]=mm, [4]=ss, [5]=ms/us
      const ms = match[5].padEnd(6, '0').slice(0, 5); // 5 cyfr
      const ts = `${match[2]}:${match[3]}:${match[4]}.${ms}`;
      return { ts, rest: log.replace(match[0], '').trim() };
    }
    return { ts: '', rest: log };
  };

  // Fetch logs from API
  const fetchLogs = React.useCallback(() => {
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

  // Fetch logs on mount and when jwt/role changes
  React.useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  // Auto-refresh effect
  React.useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(fetchLogs, 1000);
    return () => clearInterval(interval);
  }, [autoRefresh, fetchLogs]);

  if (role !== 'admin') return null;

  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold text-base-content mb-4">Logs</h2>
      <div className="flex items-center gap-4 mb-4">
        <button
          className="btn btn-sm btn-primary"
          onClick={fetchLogs}
          disabled={logsLoading}
        >
          Refresh
        </button>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            className="toggle toggle-primary"
            checked={autoRefresh}
            onChange={e => setAutoRefresh(e.target.checked)}
          />
          <span className="text-base-content">Auto-refresh (1s)</span>
        </label>
      </div>
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
                  {logs.map((log, index) => {
                    const { ts, rest } = formatLogLine(log);
                    return (
                      <pre key={index} data-prefix={`[${index + 1}]`} className="break-words whitespace-pre-wrap">
                        <code className="text-success">
                          {ts && <span className="text-info">[{ts}] </span>}{rest}
                        </code>
                      </pre>
                    );
                  })}
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