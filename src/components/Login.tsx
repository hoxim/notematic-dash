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
    <div className="min-h-screen flex items-center justify-center bg-base-100" data-theme="dark">
      <div className="card w-96 bg-base-200 shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-center text-base-content mb-6">Notematic Dashboard Login</h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="form-control">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="input input-bordered w-full"
              />
            </div>
            <div className="form-control">
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                className="input input-bordered w-full"
              />
            </div>
            <button type="submit" className="btn btn-primary w-full">
              Login
            </button>
          </form>
          {error && <div className="alert alert-error mt-4">
            <span>{error}</span>
          </div>}
          {apiResponse && <div className="text-xs text-base-content opacity-70 mt-2">
            API response: {apiResponse}
          </div>}
        </div>
      </div>
      {dashboardVersion && (
        <div className="fixed bottom-2 right-3 text-xs text-base-content bg-base-300 bg-opacity-50 px-2 py-1 rounded z-50">
          v{dashboardVersion}
        </div>
      )}
    </div>
  );
};

export default Login; 