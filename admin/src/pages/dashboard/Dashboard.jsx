import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import AdminLayout from "../../components/AdminLayout.jsx";
import { apiRequest } from "../../services/api.js";

const Dashboard = () => {
  const { user, logout } = useAuth();

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await apiRequest("/admin/stats");
        setStats(res.data);
      } catch (err) {
        console.error(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const allStats = [
    { title: "Total Users", count: stats?.totalUsers, link: "/users" },
    { title: "PYQs", count: stats?.pyqs },
    { title: "Study Materials", count: stats?.materials },
    { title: "Organizers", count: stats?.organizers },
    { title: "Syllabus", count: stats?.syllabus },
  ];

  const contentStats = [
    {
      title: "PYQs",
      add: "/pyqs/add",
      manage: "/pyqs/manage",
      desc: "Previous year question papers",
    },
    {
      title: "Study Materials",
      add: "/materials/add",
      manage: "/materials/manage",
      desc: "Notes, references, guides",
    },
    {
      title: "Organizers",
      add: "/organizers/add",
      manage: "/organizers/manage",
      desc: "Model question collections",
    },
    {
      title: "Syllabus",
      add: "/syllabus/add",
      manage: "/syllabus/manage",
      desc: "Semester-wise syllabus PDFs",
    },
  ];

  return (
    <AdminLayout>
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-2xl font-semibold text-textPrimary">
          Admin Dashboard
        </h1>
        <p className="mt-1 text-sm text-textSecondary">
          Manage all academic content and monitor platform usage
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 mb-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
        {allStats.map((s) => {
          const Card = (
            <div className="flex items-center justify-between p-5 transition card shadow-card hover:shadow-lg">
              <p className="text-sm text-textSecondary">{s.title}</p>
              <p className="text-xl font-semibold text-primary">
                {loading ? "—" : s.count}
              </p>
            </div>
          );

          return s.link ? (
            <Link key={s.title} to={s.link}>
              {Card}
            </Link>
          ) : (
            <div key={s.title}>{Card}</div>
          );
        })}
      </div>

      {/* Resource Management */}
      <div className="grid grid-cols-1 gap-6 mb-12 md:grid-cols-2">
        {contentStats.map((s) => (
          <div key={s.title} className="p-6 card shadow-card">
            <h2 className="text-lg font-semibold text-textPrimary">
              {s.title}
            </h2>

            <p className="mt-1 text-sm text-textSecondary">{s.desc}</p>

            <div className="flex gap-4 mt-5">
              <Link
                to={s.add}
                className="px-4 py-2 text-sm font-medium text-white rounded-md bg-primary"
              >
                + Add
              </Link>

              <Link
                to={s.manage}
                className="px-4 py-2 text-sm font-medium border rounded-md border-borderLight"
              >
                Manage
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Admin Info */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-5 card shadow-card">
        <div>
          <p className="text-sm text-textSecondary">Logged in as</p>
          <p className="text-base font-medium text-textPrimary">{user?.name}</p>
          <p className="text-sm text-textMuted">{user?.email}</p>

          <span className="inline-block px-3 py-1 mt-2 text-xs font-medium rounded-full bg-blue-50 text-primary">
            Role: {user?.role}
          </span>
        </div>

        <button
          onClick={logout}
          className="px-6 py-2 text-sm font-medium text-white rounded-md bg-danger"
        >
          Logout
        </button>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
