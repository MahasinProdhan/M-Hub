import { Link, NavLink, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { User } from "lucide-react";
import logo from "../assets/icons/logo.png";
import { useAuth } from "../context/AuthContext.jsx";

const Navbar = () => {
  const navigate = useNavigate();
  const { isLoggedIn, user, logout } = useAuth();
  const [avatarLoadError, setAvatarLoadError] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const firstMenuItemRef = useRef(null);

  const rawBase = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
  const baseUrl = rawBase.replace(/\/$/, "").replace(/\/api$/, "");
  const avatarPath = user?.avatar
    ? user.avatar.startsWith("/")
      ? user.avatar
      : `/${user.avatar}`
    : "";
  const avatarUrl = avatarPath ? `${baseUrl}${avatarPath}` : "";

  useEffect(() => {
    setAvatarLoadError(false);
  }, [user?.avatar]);

  useEffect(() => {
    if (!isMenuOpen) return;

    const handleOutsideClick = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("touchstart", handleOutsideClick);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("touchstart", handleOutsideClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isMenuOpen]);

  useEffect(() => {
    if (isMenuOpen) {
      firstMenuItemRef.current?.focus();
    }
  }, [isMenuOpen]);

  const handleAvatarKeyDown = (event) => {
    if (
      event.key === "Enter" ||
      event.key === " " ||
      event.key === "ArrowDown"
    ) {
      event.preventDefault();
      setIsMenuOpen(true);
    }
  };

  return (
    <nav className="bg-white border-b border-borderLight">
      <div className="container-page h-[68px] flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="M Hub Logo" className="object-contain h-12" />
        </Link>

        <div className="items-center hidden gap-10 md:flex">
          {[
            { to: "/", label: "Home" },
            { to: "/pyqs", label: "PYQs" },
            { to: "/materials", label: "Study Materials" },
            { to: "/organizers", label: "Organizers" },
          ].map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `text-sm font-medium transition ${
                  isActive
                    ? "text-primary"
                    : "text-textSecondary hover:text-textPrimary"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </div>

        <div className="flex items-center gap-4">
          {isLoggedIn ? (
            <div className="relative" ref={menuRef}>
              <button
                type="button"
                onClick={() => setIsMenuOpen((prev) => !prev)}
                onKeyDown={handleAvatarKeyDown}
                aria-haspopup="menu"
                aria-expanded={isMenuOpen}
                aria-controls="navbar-user-menu"
                className="flex items-center gap-2"
              >
                {avatarUrl && !avatarLoadError ? (
                  <img
                    src={avatarUrl}
                    alt="Profile"
                    onError={() => setAvatarLoadError(true)}
                    className="object-cover border rounded-full w-9 h-9"
                  />
                ) : (
                  <div className="flex items-center justify-center border rounded-full w-9 h-9 bg-gray-100 border-borderLight">
                    <User className="w-5 h-5 text-gray-500" />
                  </div>
                )}

                <span className="hidden text-sm font-medium md:block text-textPrimary">
                  {user?.name}
                </span>
              </button>

              {isMenuOpen && (
                <div
                  id="navbar-user-menu"
                  role="menu"
                  aria-label="User menu"
                  className="absolute right-0 z-50 w-44 py-1 mt-2 bg-white border rounded-md shadow-lg border-borderLight"
                >
                  <button
                    ref={firstMenuItemRef}
                    type="button"
                    role="menuitem"
                    onClick={() => {
                      setIsMenuOpen(false);
                      navigate("/profile");
                    }}
                    className="w-full px-4 py-2 text-sm text-left text-textPrimary hover:bg-gray-50"
                  >
                    Profile
                  </button>

                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => {
                      setIsMenuOpen(false);
                      logout();
                    }}
                    className="w-full px-4 py-2 text-sm text-left text-red-500 hover:bg-gray-50"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <NavLink
                to="/login"
                className="text-sm font-medium text-textSecondary hover:text-textPrimary"
              >
                Login
              </NavLink>

              <NavLink
                to="/register"
                className="px-4 py-2 text-sm font-medium text-white rounded-md bg-primary hover:opacity-90"
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
