import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Registration failed");
        return;
      }

      navigate("/login");
    } catch (err) {
      setError("Something went wrong. Try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-appBg">
      <div className="w-full max-w-md p-8 card">
        {/* Title */}
        <h1 className="text-2xl font-semibold text-textPrimary">
          Create an Account
        </h1>
        <p className="mt-1 text-sm text-textSecondary">
          Join M Hub to access academic resources
        </p>

        {/* Error */}
        {error && <p className="mt-3 text-sm text-red-500">{error}</p>}

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block mb-1 text-sm font-medium text-textSecondary">
              Full Name
            </label>
            <input
              type="text"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 text-sm border rounded-md h-11 border-borderLight"
              required
            />
          </div>

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
            Register
          </button>
        </form>

        {/* Footer */}
        <p className="mt-6 text-sm text-center text-textSecondary">
          Already have an account?{" "}
          <Link to="/login" className="font-medium text-primary">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
