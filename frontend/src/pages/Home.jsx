import { useEffect, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import Sidebar from "../components/Sidebar";
import ActionCard from "../components/ActionCard";
import { apiRequest } from "../services/api.js";
import DashboardSkeleton from "../components/skeletons/DashboardSkeleton.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { resolveResourceUrl } from "../utils/resourceLink.js";

const COURSE_LABELS = {
  btech: "BTech",
  bca: "BCA",
  bsc: "BSc",
  ba: "BA",
};

const TYPE_CONFIG = {
  pyq: {
    label: "PYQ",
    badgeClass: "bg-blue-100 text-blue-700",
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

const getCourseLabel = (course) => {
  if (!course) return "";

  const normalizedCourse = String(course).trim();
  if (!normalizedCourse) return "";

  return COURSE_LABELS[normalizedCourse.toLowerCase()] || normalizedCourse;
};

const getRecentItemMeta = (item) => {
  const details = [];

  if (item.semester) {
    details.push(`Semester ${item.semester}`);
  }

  if (item.course) {
    details.push(String(item.course).toUpperCase());
  }

  if (item.branch) {
    details.push(item.branch);
  }

  return details.join(" - ");
};

const formatRecentDate = (createdAt) => {
  if (!createdAt) return "";

  const parsedDate = new Date(createdAt);
  if (Number.isNaN(parsedDate.getTime())) return "";

  return parsedDate.toLocaleDateString(undefined, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const normalizeRecentItems = ({
  pyqs = [],
  materials = [],
  organizers = [],
}) => {
  const pyqItems = pyqs.map((item) => ({
    id: `pyq:${item._id}`,
    type: "pyq",
    title: `${item.subject} (${item.year})`,
    meta: getRecentItemMeta(item),
    href: resolveResourceUrl(item.fileUrl, item.driveLink),
    createdAt: item.createdAt || "",
  }));

  const materialItems = materials.map((item) => ({
    id: `material:${item._id}`,
    type: "material",
    title: item.title,
    meta: getRecentItemMeta(item),
    href: resolveResourceUrl(item.fileUrl, item.driveLink),
    createdAt: item.createdAt || "",
  }));

  const organizerItems = organizers.map((item) => ({
    id: `organizer:${item._id}`,
    type: "organizer",
    title: item.title,
    meta: getRecentItemMeta(item),
    href: resolveResourceUrl(item.fileUrl, item.driveLink),
    createdAt: item.createdAt || "",
  }));

  return [...pyqItems, ...materialItems, ...organizerItems]
    .filter((item) => item.href)
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .slice(0, 4);
};

const Home = () => {
  const { user, isLoggedIn } = useAuth();

  const [recentItems, setRecentItems] = useState([]);
  const [recentLoading, setRecentLoading] = useState(true);
  const [recentError, setRecentError] = useState("");
  const displayName = user?.name?.trim() || "Student";
  const courseLabel = getCourseLabel(user?.course);
  const semesterLabel = String(user?.semester ?? "").trim();
  const hasPersonalizedWelcome = Boolean(courseLabel && semesterLabel);
  const welcomeSubtitle = hasPersonalizedWelcome
    ? `Resources curated for your ${courseLabel} Semester ${semesterLabel}`
    : "Quickly access academic resources like PYQs, study materials, organizers, and syllabus for your semester.";

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
        setRecentError(
          "We could not load recently added resources right now. Please try again shortly.",
        );
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
    <div className="min-h-screen bg-slate-50">
      {!isLoggedIn && (
        <div className="py-16 container-page">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl font-semibold text-slate-900">
              Welcome to M Hub
            </h1>
            <p className="mt-4 text-slate-600">
              A centralized platform to access PYQs, study materials,
              organizers, and syllabus under MAKAUT.
            </p>

            <div className="flex justify-center gap-4 mt-8">
              <a
                href="/login"
                className="px-6 py-3 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
              >
                Login to Continue
              </a>

              <a
                href="/"
                className="px-6 py-3 text-sm font-medium border rounded-lg border-slate-200 text-slate-700 hover:bg-slate-100"
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
          {recentLoading ? (
            <DashboardSkeleton />
          ) : (
            <main className="flex-1 p-8 transition-opacity duration-300 opacity-100">
              <div className="p-6 border border-blue-100 shadow-sm rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50">
                <h2 className="text-2xl font-semibold text-slate-900">
                  Welcome back, {displayName}
                </h2>

                <p className="max-w-xl mt-2 text-sm text-slate-600">
                  {welcomeSubtitle}
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
                  <h3 className="text-lg font-semibold text-slate-900">
                    Recently Added
                  </h3>
                  <span className="text-xs text-slate-500">
                    Updated automatically
                  </span>
                </div>

                {recentError && (
                  <div className="p-4 text-sm border border-red-200 rounded-xl text-red-700 bg-red-50">
                    {recentError}
                  </div>
                )}

                {!recentError && recentItems.length === 0 && (
                  <div className="p-4 text-sm bg-white border rounded-xl border-slate-200 text-slate-600">
                    Nothing new has been added yet. Check back soon for fresh
                    resources.
                  </div>
                )}

                {!recentError && recentItems.length > 0 && (
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {recentItems.map((item) => {
                      const formattedDate = formatRecentDate(item.createdAt);

                      return (
                        <a
                          key={item.id}
                          href={item.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex flex-col h-full gap-3 p-4 transition-all bg-white border rounded-xl border-slate-200 cursor-pointer hover:border-blue-200 hover:shadow-md"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <span
                              className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                                TYPE_CONFIG[item.type].badgeClass
                              }`}
                            >
                              {TYPE_CONFIG[item.type].label}
                            </span>
                            <ArrowUpRight className="w-4 h-4 mt-1 text-slate-400" />
                          </div>

                          <div className="min-w-0">
                            <p className="text-sm font-semibold truncate text-slate-900">
                              {item.title}
                            </p>
                            {item.meta && (
                              <p className="mt-1 text-sm truncate text-slate-500">
                                {item.meta}
                              </p>
                            )}
                          </div>

                          {formattedDate && (
                            <p className="mt-auto text-xs text-right text-slate-400">
                              {formattedDate}
                            </p>
                          )}
                        </a>
                      );
                    })}
                  </div>
                )}
              </section>
            </main>
          )}
        </div>
      )}
    </div>
  );
};

export default Home;
