import React from 'react';

// Dashboard view after login
interface DashboardProps {
  role: string | null;
  debug: any;
}

const Dashboard: React.FC<DashboardProps> = ({ role, debug }) => {
  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold text-base-content mb-4">Welcome to Notematic Dashboard</h2>
      <div className="flex items-center gap-2 mb-6">
        <span className="text-base-content opacity-70">Role:</span>
        <div className="badge badge-primary">{role === 'admin' ? 'admin' : 'user'}</div>
      </div>
      <div className="card bg-base-200 shadow-xl">
        <div className="card-body">
          <h4 className="card-title text-base-content mb-3">Debug info (decoded JWT):</h4>
          <div className="mockup-code bg-base-300">
            <pre data-prefix="$">
              <code className="text-success">{JSON.stringify(debug, null, 2)}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 