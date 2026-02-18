import { useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { RotateCcw } from "lucide-react";
import { COURSES, SEMESTERS, SUBJECTS } from "../utils/constants";
import { useFilters } from "../context/FilterContext";

const BRANCH_TO_SUBJECT_KEY = {
  "Computer Science Engineering": "cse",
  "Information Technology": "it",
};

const Sidebar = () => {
  const { setFilters } = useFilters();
  const location = useLocation();

  const isSyllabusPage = location.pathname === "/syllabus";

  const [selectedCourseId, setSelectedCourseId] = useState("all");
  const [selectedSemester, setSelectedSemester] = useState("all");
  const [selectedBranch, setSelectedBranch] = useState("all");
  const [selectedSubject, setSelectedSubject] = useState("all");
  const [searchText, setSearchText] = useState("");

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
            <Link to="/saved" className="transition-colors hover:text-blue-600">
              Saved Materials
            </Link>
          </li>
          <li>
            <Link to="/profile" className="transition-colors hover:text-blue-600">
              My Profile
            </Link>
          </li>
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;
