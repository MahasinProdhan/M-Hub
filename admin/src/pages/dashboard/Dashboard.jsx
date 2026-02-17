import { useAuth } from "../../context/AuthContext.jsx";
import AdminLayout from "../../components/AdminLayout.jsx";

const Dashboard = () => {
  const { user, logout } = useAuth();

  return (
    <AdminLayout>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-textPrimary">Admin Home</h1>
        <p className="mt-1 text-sm text-textSecondary">
          Manage academic content for M Hub (MAKAUT Hub)
        </p>
      </div>

      {/* Admin Identity */}
      <div className="max-w-xl p-6 mb-10 card shadow-card">
        <p className="text-sm text-textSecondary">Logged in as</p>

        <p className="mt-1 text-lg font-medium text-textPrimary">
          {user?.name}
        </p>

        <p className="text-sm text-textMuted">{user?.email}</p>

        <span className="inline-block px-3 py-1 mt-3 text-xs font-medium rounded-full bg-blue-50 text-primary">
          Role: {user?.role}
        </span>
      </div>

      {/* What Admin Can Do */}
      <div className="mb-10">
        <h2 className="text-lg font-semibold text-textPrimary">
          What you can manage
        </h2>

        <ul className="mt-4 space-y-3 text-sm text-textSecondary">
          <li>• Previous Year Question papers (PYQs)</li>
          <li>• Study materials (notes, references, guides)</li>
          <li>• Organizers (model question collections)</li>
          <li>• Semester-wise syllabus PDFs</li>
        </ul>

        <p className="mt-4 text-sm text-textMuted">
          Use the sidebar to add or manage these resources.
        </p>
      </div>

      {/* System Note */}
      <div className="max-w-2xl p-5 border border-blue-100 card bg-blue-50">
        <p className="text-sm text-textSecondary">
          This admin panel is designed only for content management. All uploaded
          resources are immediately available to students on the public
          platform.
        </p>
      </div>

      {/* Logout */}
      <div className="mt-12">
        <button
          onClick={logout}
          className="px-6 py-2 text-sm font-medium text-white rounded-md bg-danger hover:bg-red-600"
        >
          Logout
        </button>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
