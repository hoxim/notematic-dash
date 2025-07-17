import React from 'react';

// Login form component, centered on the page
interface LoginProps {
  email: string;
  password: string;
  setEmail: (v: string) => void;
  setPassword: (v: string) => void;
  handleLogin: (e: React.FormEvent) => void;
  error: string | null;
  apiResponse: string | null;
  dashboardVersion: string | undefined;
}

const Login: React.FC<LoginProps> = ({ email, password, setEmail, setPassword, handleLogin, error, apiResponse, dashboardVersion }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="w-80 bg-gray-800 p-8 rounded-lg shadow-xl">
        <h2 className="text-xl font-semibold text-white text-center mb-6">Notematic Dashboard Login</h2>
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            className="input-field mb-3"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            className="input-field mb-4"
          />
          <button type="submit" className="btn-primary w-full">
            Login
          </button>
        </form>
        {error && <p className="text-red-400 mt-4 text-sm">{error}</p>}
        {apiResponse && <p className="text-gray-400 mt-2 text-xs">API response: {apiResponse}</p>}
      </div>
      {dashboardVersion && (
        <div className="fixed bottom-2 right-3 text-xs text-white bg-black bg-opacity-50 px-2 py-1 rounded z-50">
          v{dashboardVersion}
        </div>
      )}
    </div>
  );
};

export default Login; 