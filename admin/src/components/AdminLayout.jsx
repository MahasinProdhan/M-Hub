import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const AdminLayout = ({ children }) => {
  const { user } = useAuth();

  // Protect admin routes
  if (!user || user.role !== "admin") {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-appBg">
      {/* Top Bar */}
      <header className="bg-white border-b border-borderLight">
        <div className="container-page h-[64px] flex items-center">
          <h1 className="text-lg font-semibold text-textPrimary">
            M Hub Admin
          </h1>
        </div>
      </header>

      {/* Page Content */}
      <main className="py-8 container-page">{children}</main>
    </div>
  );
};

export default AdminLayout;
