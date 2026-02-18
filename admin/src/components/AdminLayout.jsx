import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import logo from "../assets/icons/logo2.png";

const AdminLayout = ({ children }) => {
  const { user, logout } = useAuth();

  if (!user || !["admin", "superadmin"].includes(user.role)) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 z-50 bg-white border-b shadow-sm border-borderLight">
        <div className="container-page h-[70px] flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img
              src={logo}
              alt="M Hub Logo"
              className="object-contain w-auto h-14"
            />

            <div className="flex flex-col leading-tight">
              <span className="text-lg font-semibold text-textPrimary">
                M Hub Admin
              </span>
              <span className="text-xs text-textSecondary">Control Panel</span>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden text-sm sm:block text-textSecondary">
              Welcome, <span className="font-medium text-textPrimary">{user?.name}</span>
            </div>

            <button
              onClick={logout}
              className="px-4 py-2 text-sm font-semibold text-white transition-all duration-300 rounded-lg bg-danger hover:opacity-90 hover:shadow-md"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="py-5 container-page">{children}</main>
    </div>
  );
};

export default AdminLayout;
