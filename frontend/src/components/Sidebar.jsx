import { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Bookmark, RotateCcw, User } from "lucide-react";
import { COURSES, SEMESTERS, SUBJECTS } from "../utils/constants";
import { useFilters } from "../context/FilterContext";
import { useSavedResources } from "../context/SavedResourcesContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";

const BRANCH_TO_SUBJECT_KEY = {
  "Computer Science Engineering": "cse",
  "Information Technology": "it",
};

const Sidebar = () => {
  const { setFilters } = useFilters();
  const { savedItems } = useSavedResources();
  const { user } = useAuth();
  const location = useLocation();

  const isSyllabusPage = location.pathname === "/syllabus";
  const isSavedMaterialsPage = location.pathname.startsWith("/saved");
  const isProfilePage = location.pathname.startsWith("/profile");
  const savedCount = savedItems.length;
  const [avatarLoadError, setAvatarLoadError] = useState(false);

  const rawBase = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
  const baseUrl = rawBase.replace(/\/$/, "").replace(/\/api$/, "");
  const avatarPath = user?.avatar
    ? user.avatar.startsWith("/")
      ? user.avatar
      : `/${user.avatar}`
    : "";
  const avatarUrl = avatarPath ? `${baseUrl}${avatarPath}` : "";

  const [selectedCourseId, setSelectedCourseId] = useState("all");
  const [selectedSemester, setSelectedSemester] = useState("all");
  const [selectedBranch, setSelectedBranch] = useState("all");
  const [selectedSubject, setSelectedSubject] = useState("all");
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    setAvatarLoadError(false);
  }, [user?.avatar]);

  const selectedCourse = useMemo(() => {
    if (selectedCourseId === "all") return null;
    return COURSES.find((course) => course.id === selectedCourseId);
  }, [selectedCourseId]);

  const subjectOptions = useMemo(() => {
    if (!selectedCourse || !selectedCourse.hasBranches) {
      return SUBJECTS.common;
    }

    if (selectedBranch === "all") {
      return SUBJECTS.common;
    }

    const subjectKey = BRANCH_TO_SUBJECT_KEY[selectedBranch];
    const branchSubjects = subjectKey ? (SUBJECTS[subjectKey] ?? []) : [];

    return [...new Set([...SUBJECTS.common, ...branchSubjects])];
  }, [selectedCourse, selectedBranch]);

  const handleCourseChange = (event) => {
    const value = event.target.value;
    setSelectedCourseId(value);
    setSelectedBranch("all");
    setSelectedSubject("all");
  };

  const handleBranchChange = (event) => {
    setSelectedBranch(event.target.value);
    setSelectedSubject("all");
  };

  const applyFilters = () => {
    setFilters({
      course: selectedCourseId,
      semester: selectedSemester,
      branch: selectedBranch,
      subject: isSyllabusPage ? "all" : selectedSubject,
      search: isSyllabusPage ? "" : searchText,
    });
  };

  const hasActiveFilters =
    selectedCourseId !== "all" ||
    selectedSemester !== "all" ||
    selectedBranch !== "all" ||
    selectedSubject !== "all" ||
    searchText.trim() !== "";

  const handleClearFilters = () => {
    setSelectedCourseId("all");
    setSelectedSemester("all");
    setSelectedBranch("all");
    setSelectedSubject("all");
    setSearchText("");

    setFilters({
      course: "all",
      semester: "all",
      branch: "all",
      subject: "all",
      search: "",
    });
  };

  return (
    <aside className="hidden min-h-screen w-[280px] border-r border-slate-200 bg-white p-6 md:block">
      <h2 className="mb-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
        Filters
      </h2>

      {!isSyllabusPage && (
        <div className="mb-4">
          <label className="mb-1 block text-xs font-medium text-slate-500">
            Search
          </label>
          <input
            type="text"
            placeholder="Search subject or title..."
            value={searchText}
            onChange={(event) => setSearchText(event.target.value)}
            className="h-10 w-full rounded-md border border-slate-200 px-3 text-sm text-slate-700 placeholder:text-slate-400 focus:border-blue-300"
          />
        </div>
      )}

      <div className="mb-4">
        <label className="mb-1 block text-xs font-medium text-slate-500">
          Course
        </label>
        <select
          value={selectedCourseId}
          onChange={handleCourseChange}
          className="h-10 w-full rounded-md border border-slate-200 px-3 text-sm text-slate-700 focus:border-blue-300"
        >
          <option value="all">All Courses</option>
          {COURSES.map((course) => (
            <option key={course.id} value={course.id}>
              {course.name}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label className="mb-1 block text-xs font-medium text-slate-500">
          Semester
        </label>
        <select
          value={selectedSemester}
          onChange={(event) => setSelectedSemester(event.target.value)}
          className="h-10 w-full rounded-md border border-slate-200 px-3 text-sm text-slate-700 focus:border-blue-300"
        >
          <option value="all">All Semesters</option>
          {SEMESTERS.map((sem) => (
            <option key={sem} value={String(sem)}>
              Semester {sem}
            </option>
          ))}
        </select>
      </div>

      {selectedCourse?.hasBranches && (
        <div className="mb-4">
          <label className="mb-1 block text-xs font-medium text-slate-500">
            Branch
          </label>
          <select
            value={selectedBranch}
            onChange={handleBranchChange}
            className="h-10 w-full rounded-md border border-slate-200 px-3 text-sm text-slate-700 focus:border-blue-300"
          >
            <option value="all">All Branches</option>
            {selectedCourse.branches.map((branch) => (
              <option key={branch} value={branch}>
                {branch}
              </option>
            ))}
          </select>
        </div>
      )}

      {!isSyllabusPage && (
        <div className="mb-6">
          <label className="mb-1 block text-xs font-medium text-slate-500">
            Subject
          </label>
          <select
            value={selectedSubject}
            onChange={(event) => setSelectedSubject(event.target.value)}
            className="h-10 w-full rounded-md border border-slate-200 px-3 text-sm text-slate-700 focus:border-blue-300"
          >
            <option value="all">All Subjects</option>
            {subjectOptions.map((subject) => (
              <option key={subject} value={subject}>
                {subject}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="space-y-3">
        <button
          type="button"
          onClick={applyFilters}
          className="h-10 w-full rounded-md bg-blue-600 text-sm font-medium text-white transition-colors hover:bg-blue-700"
        >
          Apply Filters
        </button>

        <button
          type="button"
          onClick={handleClearFilters}
          disabled={!hasActiveFilters}
          className="flex h-10 w-full items-center justify-center gap-2 rounded-md border border-red-200 bg-red-50 text-sm font-medium text-red-600 transition-colors hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <RotateCcw size={16} />
          Clear Filters
        </button>
      </div>

      <hr className="my-6 border-slate-200" />

      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
          Quick Access
        </p>
        <ul className="space-y-2 text-sm text-slate-700">
          <li>
            <Link
              to="/saved"
              className={`group flex items-center justify-between rounded-md px-2 py-1.5 transition-colors ${
                isSavedMaterialsPage
                  ? "bg-amber-50 text-amber-700"
                  : "text-slate-700 hover:bg-slate-100 hover:text-blue-600"
              } cursor-pointer`}
            >
              <span className="flex items-center gap-2">
                <Bookmark
                  size={15}
                  className={`${
                    isSavedMaterialsPage
                      ? "text-amber-500"
                      : "text-amber-400 group-hover:text-amber-500"
                  } transition-colors`}
                />
                <span>Saved Materials</span>
              </span>
              {savedCount > 0 && (
                <span
                  className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                    isSavedMaterialsPage
                      ? "bg-amber-100 text-amber-700"
                      : "bg-slate-100 text-slate-600 group-hover:bg-blue-50 group-hover:text-blue-600"
                  } transition-colors`}
                  aria-label={`${savedCount} saved materials`}
                >
                  {savedCount}
                </span>
              )}
            </Link>
          </li>
          <li>
            <Link
              to="/profile"
              className={`group flex cursor-pointer items-center justify-between rounded-md px-2 py-1.5 transition-colors ${
                isProfilePage
                  ? "bg-blue-50 text-blue-700"
                  : "text-slate-700 hover:bg-slate-100 hover:text-blue-600"
              }`}
            >
              <span className="flex items-center gap-2">
                {avatarUrl && !avatarLoadError ? (
                  <img
                    src={avatarUrl}
                    alt="Profile"
                    onError={() => setAvatarLoadError(true)}
                    className={`h-5 w-5 rounded-full border object-cover transition-colors ${
                      isProfilePage
                        ? "border-blue-200"
                        : "border-slate-200 group-hover:border-blue-200"
                    }`}
                  />
                ) : (
                  <User
                    size={15}
                    className={`${
                      isProfilePage
                        ? "text-blue-500"
                        : "text-blue-400 group-hover:text-blue-500"
                    } transition-colors`}
                  />
                )}
                <span>My Profile</span>
              </span>
            </Link>
          </li>
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;
