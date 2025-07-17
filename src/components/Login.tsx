import React from 'react';
import Button from './Button';

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
    <div className="min-h-screen flex items-center justify-center bg-stone-950">
      <div className="w-80 bg-stone-900 p-8 rounded-lg shadow-xl">
        <h2 className="text-xl font-semibold text-white text-center mb-6">Notematic Dashboard Login</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            className="w-full p-3 rounded border border-stone-600 bg-stone-800 text-white placeholder-stone-400 focus:outline-none focus:border-stone-500 focus:ring-1 focus:ring-stone-500"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            className="w-full p-3 rounded border border-stone-600 bg-stone-800 text-white placeholder-stone-400 focus:outline-none focus:border-stone-500 focus:ring-1 focus:ring-stone-500"
          />
          <Button type="submit" className="w-full">
            Login
          </Button>
        </form>
        {error && <p className="text-red-400 mt-4 text-sm">{error}</p>}
        {apiResponse && <p className="text-stone-400 mt-2 text-xs">API response: {apiResponse}</p>}
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