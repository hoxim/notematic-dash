import React from 'react';

// Dashboard view after login
interface DashboardProps {
  role: string | null;
  debug: any;
}

const Dashboard: React.FC<DashboardProps> = ({ role, debug }) => {
  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold text-white mb-4">Welcome to Notematic Dashboard</h2>
      <p className="text-gray-300 mb-6">
        <strong>Role:</strong> {role === 'admin' ? 'admin' : 'user'}
      </p>
      <div className="card">
        <h4 className="text-lg font-semibold text-white mb-3">Debug info (decoded JWT):</h4>
        <pre className="bg-gray-900 text-green-400 p-4 rounded overflow-auto text-sm">
          {JSON.stringify(debug, null, 2)}
        </pre>
      </div>
    </div>
  );
};

export default Dashboard; 