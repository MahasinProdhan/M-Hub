import { Link, NavLink } from "react-router-dom";
import logo from "../assets/icons/logo.png";

const Navbar = () => {
  // TEMPORARY: frontend-only
  const isLoggedIn = false;
  const userName = "Student";

  return (
    <nav className="bg-white border-b border-borderLight">
      <div className="container-page h-[68px] flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <img
            src={logo}
            alt="M Hub Logo"
            className="object-contain w-auto h-20"
          />
        </Link>

        {/* Navigation */}
        <div className="items-center hidden gap-14 md:flex">
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
            to="/organizers"
            className={({ isActive }) =>
              `text-sm font-medium ${
                isActive ? "text-primary" : "text-textSecondary"
              }`
            }
          >
            Organizers
          </NavLink>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-4">
          {isLoggedIn ? (
            <NavLink
              to="/profile"
              className="text-sm font-medium text-textPrimary hover:text-primary"
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
                to="/register"
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
