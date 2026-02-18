import { useEffect, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import Sidebar from "../components/Sidebar";
import ActionCard from "../components/ActionCard";
import { apiRequest } from "../services/api.js";

const TYPE_CONFIG = {
  pyq: {
    label: "PYQ",
    badgeClass: "bg-blue-100 text-primary",
  },
  material: {
    label: "Notes",
    badgeClass: "bg-green-100 text-green-700",
  },
  organizer: {
    label: "Organizer",
    badgeClass: "bg-purple-100 text-purple-700",
  },
};

const normalizeRecentItems = ({ pyqs = [], materials = [], organizers = [] }) => {
  const pyqItems = pyqs.map((item) => ({
    id: `pyq:${item._id}`,
    type: "pyq",
    title: `${item.subject} (${item.year})`,
    meta: `Semester ${item.semester} - ${item.course?.toUpperCase() || ""}${
      item.branch ? ` - ${item.branch}` : ""
    }`,
    href: item.driveLink,
    createdAt: item.createdAt || "",
  }));

  const materialItems = materials.map((item) => ({
    id: `material:${item._id}`,
    type: "material",
    title: item.title,
    meta: `Semester ${item.semester} - ${item.course?.toUpperCase() || ""}${
      item.branch ? ` - ${item.branch}` : ""
    }`,
    href: item.driveLink,
    createdAt: item.createdAt || "",
  }));

  const organizerItems = organizers.map((item) => ({
    id: `organizer:${item._id}`,
    type: "organizer",
    title: item.title,
    meta: `Semester ${item.semester} - ${item.course?.toUpperCase() || ""}${
      item.branch ? ` - ${item.branch}` : ""
    }`,
    href: item.driveLink,
    createdAt: item.createdAt || "",
  }));

  return [...pyqItems, ...materialItems, ...organizerItems]
    .filter((item) => item.href)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 4);
};

const Home = () => {
  // TEMPORARY: frontend-only
  const isLoggedIn = true;
  const userName = "Student";

  const [recentItems, setRecentItems] = useState([]);
  const [recentLoading, setRecentLoading] = useState(true);
  const [recentError, setRecentError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const fetchRecentlyAdded = async () => {
      try {
        setRecentLoading(true);
        setRecentError("");

        const [pyqResponse, materialResponse, organizerResponse] =
          await Promise.all([
            apiRequest("/pyqs"),
            apiRequest("/materials"),
            apiRequest("/organizers"),
          ]);

        if (cancelled) return;

        const items = normalizeRecentItems({
          pyqs: pyqResponse?.data || [],
          materials: materialResponse?.data || [],
          organizers: organizerResponse?.data || [],
        });

        setRecentItems(items);
      } catch (error) {
        if (cancelled) return;
        setRecentError("Unable to load recently added resources.");
      } finally {
        if (!cancelled) {
          setRecentLoading(false);
        }
      }
    };

    fetchRecentlyAdded();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="min-h-screen bg-appBg">
      {!isLoggedIn && (
        <div className="py-16 container-page">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl font-semibold text-textPrimary">
              Welcome to M Hub
            </h1>
            <p className="mt-4 text-textSecondary">
              A centralized platform to access PYQs, study materials, organizers,
              and syllabus under MAKAUT.
            </p>

            <div className="flex justify-center gap-4 mt-8">
              <a
                href="/login"
                className="px-6 py-3 text-sm font-medium text-white rounded-lg bg-primary"
              >
                Login to Continue
              </a>

              <a
                href="/"
                className="px-6 py-3 text-sm font-medium border rounded-lg border-borderLight text-textPrimary"
              >
                Explore as Guest
              </a>
            </div>
          </div>
        </div>
      )}

      {isLoggedIn && (
        <div className="flex">
          <Sidebar />

          <main className="flex-1 p-8">
            <div className="p-6 border rounded-xl bg-gradient-to-r from-blue-50 to-white border-borderLight">
              <h2 className="text-2xl font-semibold text-textPrimary">
                Welcome back, {userName}
              </h2>
              <p className="max-w-xl mt-2 text-sm text-textSecondary">
                Quickly access academic resources like PYQs, study materials,
                organizers, and syllabus for your semester.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 mt-10 sm:grid-cols-2 lg:grid-cols-4">
              <ActionCard
                title="Previous Year Questions"
                description="Browse semester-wise question papers"
                link="/pyqs"
              />

              <ActionCard
                title="Study Materials"
                description="Notes, PDFs, and reference materials"
                link="/materials"
              />

              <ActionCard
                title="Organizers"
                description="Model questions and compiled resources"
                link="/organizers"
              />

              <ActionCard
                title="Syllabus"
                description="View semester-wise syllabus"
                link="/syllabus"
              />
            </div>

            <section className="mt-14">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-textPrimary">Recently Added</h3>
                <span className="text-xs text-textSecondary">Updated automatically</span>
              </div>

              {recentLoading && (
                <div className="p-4 text-sm card text-textSecondary">
                  Loading recent resources...
                </div>
              )}

              {!recentLoading && recentError && (
                <div className="p-4 text-sm border rounded-lg text-danger border-danger/30 bg-red-50">
                  {recentError}
                </div>
              )}

              {!recentLoading && !recentError && recentItems.length === 0 && (
                <div className="p-4 text-sm card text-textSecondary">
                  No recent resources available right now.
                </div>
              )}

              {!recentLoading && !recentError && recentItems.length > 0 && (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {recentItems.map((item) => (
                    <a
                      key={item.id}
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-start justify-between gap-3 p-4 transition group card hover:shadow-card"
                    >
                      <div className="min-w-0">
                        <span
                          className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                            TYPE_CONFIG[item.type].badgeClass
                          }`}
                        >
                          {TYPE_CONFIG[item.type].label}
                        </span>

                        <p className="mt-2 text-sm font-medium truncate text-textPrimary">
                          {item.title}
                        </p>
                        <p className="mt-1 text-sm truncate text-textSecondary">
                          {item.meta}
                        </p>
                      </div>

                      <ArrowUpRight className="w-4 h-4 mt-1 transition-all -translate-x-1 opacity-0 text-textSecondary group-hover:translate-x-0 group-hover:opacity-100 group-hover:text-primary" />
                    </a>
                  ))}
                </div>
              )}
            </section>
          </main>
        </div>
      )}
    </div>
  );
};

export default Home;
