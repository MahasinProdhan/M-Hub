import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import AdminLayout from "../../components/AdminLayout.jsx";
import { apiRequest } from "../../services/api.js";

const Dashboard = () => {
  const { user } = useAuth();

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

  // 🔥 KEEPING ORIGINAL STATS STRUCTURE
  const allStats = [
    { title: "Total Users", count: stats?.totalUsers, link: "/users" },
    { title: "PYQs", count: stats?.pyqs },
    { title: "Study Materials", count: stats?.materials },
    { title: "Organizers", count: stats?.organizers },
    { title: "Syllabus", count: stats?.syllabus },
  ];

  const resources = [
    {
      title: "PYQs",
      desc: "Previous year question papers",
      add: "/pyqs/add",
      manage: "/pyqs/manage",
    },
    {
      title: "Study Materials",
      desc: "Notes, references, guides",
      add: "/materials/add",
      manage: "/materials/manage",
    },
    {
      title: "Organizers",
      desc: "Model question collections",
      add: "/organizers/add",
      manage: "/organizers/manage",
    },
    {
      title: "Syllabus",
      desc: "Semester-wise syllabus PDFs",
      add: "/syllabus/add",
      manage: "/syllabus/manage",
    },
  ];

  return (
    <AdminLayout>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-textPrimary">
          Admin Dashboard
        </h1>
        <p className="mt-1 text-sm text-textSecondary">
          Welcome back, {user?.name}
        </p>
      </div>

      {/* 🔥 ORIGINAL STATS LAYOUT */}
      <div className="grid grid-cols-1 gap-4 mb-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
        {allStats.map((s) => {
          const Card = (
            <div className="flex items-center justify-between p-5 transition bg-white border shadow-sm rounded-xl hover:shadow-lg border-borderLight">
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
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {resources.map((item) => (
          <div
            key={item.title}
            className="p-8 transition-all duration-300 bg-white border shadow-sm rounded-2xl hover:shadow-lg border-borderLight"
          >
            <h2 className="text-xl font-semibold text-textPrimary">
              {item.title}
            </h2>

            <p className="mt-2 text-sm text-textSecondary">{item.desc}</p>

            <div className="flex gap-4 mt-6">
              <Link
                to={item.add}
                className="px-5 py-2.5 text-sm font-semibold text-white rounded-lg bg-primary transition-all duration-300 hover:shadow-md hover:opacity-90"
              >
                + Add
              </Link>

              <Link
                to={item.manage}
                className="px-5 py-2.5 text-sm font-semibold border rounded-lg border-borderLight transition-all duration-300 hover:border-primary hover:bg-gray-50"
              >
                Manage
              </Link>
            </div>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
