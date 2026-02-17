import { useMemo, useState } from "react";
import { useLocation } from "react-router-dom"; // ✅ NEW
import { RotateCcw } from "lucide-react";
import { COURSES, SEMESTERS, SUBJECTS } from "../utils/constants";
import { useFilters } from "../context/FilterContext";

const BRANCH_TO_SUBJECT_KEY = {
  "Computer Science Engineering": "cse",
  "Information Technology": "it",
};

const Sidebar = () => {
  const { setFilters } = useFilters();
  const location = useLocation(); // ✅ NEW

  // 🔍 hide search & subject on syllabus page
  const isSyllabusPage = location.pathname === "/syllabus";

  // existing local states
  const [selectedCourseId, setSelectedCourseId] = useState("all");
  const [selectedSemester, setSelectedSemester] = useState("all");
  const [selectedBranch, setSelectedBranch] = useState("all");
  const [selectedSubject, setSelectedSubject] = useState("all");

  // 🔍 SEARCH: local search state
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

  const handleCourseChange = (e) => {
    const value = e.target.value;
    setSelectedCourseId(value);

    setSelectedBranch("all");
    setSelectedSubject("all");
  };

  const handleBranchChange = (e) => {
    setSelectedBranch(e.target.value);
    setSelectedSubject("all");
  };

  const applyFilters = () => {
    setFilters({
      course: selectedCourseId,
      semester: selectedSemester,
      branch: selectedBranch,
      subject: isSyllabusPage ? "all" : selectedSubject, // ✅ SAFE
      search: isSyllabusPage ? "" : searchText, // ✅ SAFE
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
    <aside className="w-[280px] min-h-screen bg-white border-r border-borderLight p-6 hidden md:block">
      <h2 className="mb-4 text-sm font-semibold text-textPrimary">Filters</h2>

      {/* 🔍 SEARCH (HIDDEN ON SYLLABUS) */}
      {!isSyllabusPage && (
        <div className="mb-4">
          <label className="block mb-1 text-xs font-medium text-textSecondary">
            Search
          </label>
          <input
            type="text"
            placeholder="Search subject or title..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="w-full h-10 px-3 text-sm border rounded-md border-borderLight"
          />
        </div>
      )}

      {/* Course */}
      <div className="mb-4">
        <label className="block mb-1 text-xs font-medium text-textSecondary">
          Course
        </label>
        <select
          value={selectedCourseId}
          onChange={handleCourseChange}
          className="w-full h-10 px-3 text-sm border rounded-md border-borderLight"
        >
          <option value="all">All Courses</option>
          {COURSES.map((course) => (
            <option key={course.id} value={course.id}>
              {course.name}
            </option>
          ))}
        </select>
      </div>

      {/* Semester */}
      <div className="mb-4">
        <label className="block mb-1 text-xs font-medium text-textSecondary">
          Semester
        </label>
        <select
          value={selectedSemester}
          onChange={(e) => setSelectedSemester(e.target.value)}
          className="w-full h-10 px-3 text-sm border rounded-md border-borderLight"
        >
          <option value="all">All Semesters</option>
          {SEMESTERS.map((sem) => (
            <option key={sem} value={String(sem)}>
              Semester {sem}
            </option>
          ))}
        </select>
      </div>

      {/* Branch */}
      {selectedCourse?.hasBranches && (
        <div className="mb-4">
          <label className="block mb-1 text-xs font-medium text-textSecondary">
            Branch
          </label>
          <select
            value={selectedBranch}
            onChange={handleBranchChange}
            className="w-full h-10 px-3 text-sm border rounded-md border-borderLight"
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

      {/* Subject (HIDDEN ON SYLLABUS) */}
      {!isSyllabusPage && (
        <div className="mb-6">
          <label className="block mb-1 text-xs font-medium text-textSecondary">
            Subject
          </label>
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="w-full h-10 px-3 text-sm border rounded-md border-borderLight"
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
          className="w-full h-10 text-sm font-medium text-white transition-colors rounded-md bg-primary hover:bg-primary/90"
        >
          Apply Filters
        </button>

        <button
          type="button"
          onClick={handleClearFilters}
          disabled={!hasActiveFilters}
          className="flex items-center justify-center w-full h-10 gap-2 text-sm font-medium transition-colors border rounded-md border-danger/30 bg-red-50 text-danger hover:bg-red-100 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <RotateCcw size={16} />
          Clear Filters
        </button>
      </div>

      <hr className="my-6 border-borderLight" />

      <div>
        <p className="mb-2 text-xs font-semibold text-textSecondary">
          Quick Access
        </p>
        <ul className="space-y-2 text-sm text-textPrimary">
          <li className="cursor-pointer hover:text-primary">Saved Materials</li>
          <li className="cursor-pointer hover:text-primary">My Downloads</li>
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;
