import React from 'react';

interface DashboardProps {
  role: string | null;
  debug: any;
}

// Dashboard view after login
const Dashboard: React.FC<DashboardProps> = ({ role, debug }) => {
  return (
    <>
      <h2>Welcome to Notematic Dashboard</h2>
      <p>
        <strong>Role:</strong> {role === 'admin' ? 'admin' : 'user'}
      </p>
      <div className="debug">
        <h4>Debug info (decoded JWT):</h4>
        <pre>{JSON.stringify(debug, null, 2)}</pre>
      </div>
    </>
  );
};

export default Dashboard; 