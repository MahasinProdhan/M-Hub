import { Link, NavLink } from "react-router-dom";
import logo from "../assets/icons/logo.png";

const Navbar = () => {
  // TEMPORARY: frontend-only
  const isLoggedIn = true;
  const userName = "Student";

  return (
    <nav className="bg-white border-b border-borderLight">
      <div className="container-page h-[72px] flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <img
            src={logo}
            alt="M Hub Logo"
            className="object-contain h-24 w-18 md:w-22 md:h-20"
          />

          <span className="text-lg font-semibold text-textPrimary"></span>
        </Link>

        {/* Navigation */}
        <div className="items-center hidden gap-10 md:flex">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `text-sm font-medium ${
                isActive ? "text-primary" : "text-textSecondary"
              }`
            }
          >
            Home
          </NavLink>

          <NavLink
            to="/pyqs"
            className={({ isActive }) =>
              `text-sm font-medium ${
                isActive ? "text-primary" : "text-textSecondary"
              }`
            }
          >
            PYQs
          </NavLink>

          <NavLink
            to="/materials"
            className={({ isActive }) =>
              `text-sm font-medium ${
                isActive ? "text-primary" : "text-textSecondary"
              }`
            }
          >
            Study Materials
          </NavLink>

          <NavLink
            to="/colleges"
            className={({ isActive }) =>
              `text-sm font-medium ${
                isActive ? "text-primary" : "text-textSecondary"
              }`
            }
          >
            Colleges
          </NavLink>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-4">
          {isLoggedIn ? (
            <NavLink
              to="/profile"
              className="text-sm font-medium text-textPrimary"
            >
              {userName}
            </NavLink>
          ) : (
            <>
              <NavLink
                to="/login"
                className="text-sm font-medium text-textSecondary"
              >
                Login
              </NavLink>
              <NavLink
                to="/login"
                className="px-4 py-2 text-sm font-medium text-white rounded-md bg-primary"
              >
                Register
              </NavLink>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
