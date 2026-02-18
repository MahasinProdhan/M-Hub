import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const COURSES = [
  { id: "btech", name: "BTech", hasBranches: true },
  { id: "bca", name: "BCA" },
  { id: "bsc", name: "BSc" },
  { id: "ba", name: "BA" },
];

const BTECH_BRANCHES = ["CSE", "IT", "ECE", "EE", "ME", "CE"];

const Register = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    college: "",
    course: "",
    branch: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const selectedCourse = COURSES.find((c) => c.id === form.course);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (form.course === "btech" && !form.branch) {
      setError("Branch is required for BTech students");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          branch: form.course === "btech" ? form.branch : null,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Registration failed");
        return;
      }

      navigate("/login");
    } catch {
      setError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4 bg-gradient-to-br from-slate-100 via-white to-slate-200">
      <div className="w-full max-w-md p-8 bg-white border rounded-xl shadow-card border-borderLight">
        {/* Header */}
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold text-textPrimary">
            Create Account
          </h1>
          <p className="mt-2 text-sm text-textSecondary">
            Join M Hub and access premium academic resources
          </p>
        </div>

        {error && (
          <div className="p-3 mb-4 text-sm border border-red-200 rounded-md text-danger bg-red-50">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <div>
            <label className="block mb-1 text-sm font-medium text-textPrimary">
              Full Name
            </label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="input-style"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block mb-1 text-sm font-medium text-textPrimary">
              Email Address
            </label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
              className="input-style"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block mb-1 text-sm font-medium text-textPrimary">
              Password
            </label>
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              required
              className="input-style"
            />
          </div>

          {/* College */}
          <div>
            <label className="block mb-1 text-sm font-medium text-textPrimary">
              College Name
            </label>
            <input
              name="college"
              value={form.college}
              onChange={handleChange}
              required
              className="input-style"
            />
          </div>

          {/* Course */}
          <div>
            <label className="block mb-1 text-sm font-medium text-textPrimary">
              Course
            </label>
            <select
              name="course"
              value={form.course}
              onChange={handleChange}
              required
              className="input-style"
            >
              <option value="">Select Course</option>
              {COURSES.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Branch (BTech only) */}
          {selectedCourse?.hasBranches && (
            <div>
              <label className="block mb-1 text-sm font-medium text-textPrimary">
                Branch
              </label>
              <select
                name="branch"
                value={form.branch}
                onChange={handleChange}
                required
                className="input-style"
              >
                <option value="">Select Branch</option>
                {BTECH_BRANCHES.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Button */}
          <button
            disabled={loading}
            className="w-full h-11 rounded-md bg-primary text-white font-medium transition hover:opacity-90 active:scale-[0.98] disabled:opacity-60"
          >
            {loading ? "Creating Account..." : "Register"}
          </button>
        </form>

        {/* Footer */}
        <p className="mt-6 text-sm text-center text-textSecondary">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-medium text-primary hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
