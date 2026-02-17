import { Link, NavLink } from "react-router-dom";
import logo from "../assets/icons/logo.png";
// import { useAuth } from "../context/AuthContext";
import { useAuth } from "../context/AuthContext.jsx";

const Navbar = () => {
  const { isLoggedIn, user, logout } = useAuth();

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
            <>
              <div className="flex items-center gap-3">
                <NavLink
                  to="/profile"
                  className="px-3 py-1 text-sm font-medium bg-gray-100 rounded-md text-textPrimary hover:bg-gray-200"
                >
                  {user?.name}
                </NavLink>

                <button
                  onClick={logout}
                  className="text-sm font-medium text-red-500 hover:text-red-600"
                >
                  Logout
                </button>
              </div>
            </>
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
