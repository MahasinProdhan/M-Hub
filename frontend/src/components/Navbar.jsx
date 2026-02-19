import { Link, NavLink, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { User } from "lucide-react";
import logo from "../assets/icons/logo.png";
import { useAuth } from "../context/AuthContext.jsx";

const Navbar = () => {
  const navigate = useNavigate();
  const { isLoggedIn, user, logout, loading: authLoading } = useAuth();

  const [avatarLoadError, setAvatarLoadError] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuRef = useRef(null);
  const firstMenuItemRef = useRef(null);

  // Avatar URL handling (unchanged logic)
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

    const handleOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsMenuOpen(false);
      }
    };

    const handleEscape = (e) => {
      if (e.key === "Escape") setIsMenuOpen(false);
    };

    document.addEventListener("mousedown", handleOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isMenuOpen]);

  useEffect(() => {
    if (isMenuOpen) firstMenuItemRef.current?.focus();
  }, [isMenuOpen]);

  return (
    <nav className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="container-page flex h-[68px] items-center justify-between">
        {/* Left: Logo */}
        <Link to="/" className="flex items-center gap-3">
          <img src={logo} alt="M Hub Logo" className="object-contain h-14" />
          <div className="flex-col hidden leading-tight md:flex">
            <span className="text-sm font-semibold text-slate-900">M Hub</span>
            <span className="text-xs text-slate-500">
              MAKAUT Academic Portal
            </span>
          </div>
        </Link>

        {/* Middle: Global Navigation */}
        <div className="items-center hidden gap-8 ml-12 md:flex">
          {[
            { to: "/", label: "Home" },
            { to: "/about", label: "About" },
            { to: "/faq", label: "FAQ" },
            { to: "/help", label: "Help" },
          ].map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `text-sm font-medium transition ${
                  isActive
                    ? "text-blue-600"
                    : "text-slate-600 hover:text-slate-900"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </div>

        {/* Right: Auth / Profile */}
        <div className="flex items-center gap-4">
          {authLoading ? (
            <div className="flex items-center gap-2 animate-pulse">
              <div className="rounded-full h-9 w-9 bg-slate-200" />
              <div className="hidden w-20 h-4 rounded bg-slate-200 md:block" />
            </div>
          ) : isLoggedIn ? (
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setIsMenuOpen((p) => !p)}
                className="flex items-center gap-2 px-1 py-1 rounded-md hover:bg-slate-50"
                aria-haspopup="menu"
                aria-expanded={isMenuOpen}
              >
                {avatarUrl && !avatarLoadError ? (
                  <img
                    src={avatarUrl}
                    alt="Profile"
                    onError={() => setAvatarLoadError(true)}
                    className="object-cover border rounded-full h-9 w-9"
                  />
                ) : (
                  <div className="flex items-center justify-center border rounded-full h-9 w-9 bg-slate-100">
                    <User className="w-5 h-5 text-slate-500" />
                  </div>
                )}

                <span className="hidden text-sm font-medium md:block text-slate-900">
                  {user?.name}
                </span>
              </button>

              {isMenuOpen && (
                <div className="absolute right-0 py-1 mt-2 bg-white border rounded-md shadow-lg w-44">
                  <button
                    ref={firstMenuItemRef}
                    onClick={() => {
                      setIsMenuOpen(false);
                      navigate("/profile");
                    }}
                    className="w-full px-4 py-2 text-sm text-left text-slate-700 hover:bg-slate-50"
                  >
                    Profile
                  </button>

                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      logout();
                    }}
                    className="w-full px-4 py-2 text-sm text-left text-red-600 hover:bg-red-50"
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
                className="text-sm font-medium text-slate-600 hover:text-slate-900"
              >
                Login
              </NavLink>

              <NavLink
                to="/register"
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
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
