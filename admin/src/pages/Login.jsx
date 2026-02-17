import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const Login = () => {
  const navigate = useNavigate();
  const { login, loading } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-appBg">
      <div className="w-full max-w-md p-8 card shadow-card">
        {/* Title */}
        <h1 className="text-2xl font-semibold text-textPrimary">Admin Login</h1>
        <p className="mt-1 text-sm text-textSecondary">
          Login to manage academic resources
        </p>

        {/* Error */}
        {error && (
          <div className="px-4 py-2 mt-4 text-sm rounded-md text-danger bg-red-50">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block mb-1 text-sm font-medium text-textSecondary">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
              className="w-full px-4 text-sm border rounded-md h-11 border-borderLight"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-textSecondary">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 text-sm border rounded-md h-11 border-borderLight"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 text-sm font-medium text-white rounded-md h-11 bg-primary hover:bg-primaryLight disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Footer note */}
        <p className="mt-4 text-xs text-center text-textMuted">
          This panel is restricted to administrators only.
        </p>
      </div>
    </div>
  );
};

export default Login;
