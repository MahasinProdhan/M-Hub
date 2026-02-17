import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";
import { useAuth } from "../context/AuthContext.jsx";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Login failed");
        return;
      }

      login(data.token, data.user);
      navigate("/");
    } catch (err) {
      setError("Something went wrong. Try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-appBg">
      <div className="w-full max-w-md p-8 card">
        {/* Title */}
        <h1 className="text-2xl font-semibold text-textPrimary">
          Login to M Hub
        </h1>
        <p className="mt-1 text-sm text-textSecondary">
          Access your academic resources
        </p>

        {/* Error */}
        {error && <p className="mt-3 text-sm text-red-500">{error}</p>}

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block mb-1 text-sm font-medium text-textSecondary">
              Email
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 text-sm border rounded-md h-11 border-borderLight"
              required
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-textSecondary">
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 text-sm border rounded-md h-11 border-borderLight"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full mt-2 text-sm font-medium text-white rounded-md h-11 bg-primary"
          >
            Login
          </button>
        </form>

        {/* Footer */}
        <p className="mt-6 text-sm text-center text-textSecondary">
          Don’t have an account?{" "}
          <Link to="/register" className="font-medium text-primary">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
