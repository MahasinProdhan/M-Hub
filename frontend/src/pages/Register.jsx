import { Link } from "react-router-dom";

const Register = () => {
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

        {/* Form */}
        <form className="mt-6 space-y-4">
          <div>
            <label className="block mb-1 text-sm font-medium text-textSecondary">
              Full Name
            </label>
            <input
              type="text"
              placeholder="Your name"
              className="w-full px-4 text-sm border rounded-md h-11 border-borderLight"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-textSecondary">
              Email
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              className="w-full px-4 text-sm border rounded-md h-11 border-borderLight"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-textSecondary">
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full px-4 text-sm border rounded-md h-11 border-borderLight"
            />
          </div>

          <button
            type="button"
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

        <p className="mt-3 text-xs text-center text-textSecondary">
          Registration will be enabled after backend integration
        </p>
      </div>
    </div>
  );
};

export default Register;
