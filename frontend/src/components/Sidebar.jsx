import { useMemo, useState } from "react";
import { COURSES, SEMESTERS, SUBJECTS } from "../utils/constants";
import { useFilters } from "../context/FilterContext";

const BRANCH_TO_SUBJECT_KEY = {
  "Computer Science Engineering": "cse",
  "Information Technology": "it",
};

const Sidebar = () => {
  const { setFilters } = useFilters();

  // ✅ IMPORTANT: start with "all"
  const [selectedCourseId, setSelectedCourseId] = useState("all");
  const [selectedSemester, setSelectedSemester] = useState("all");
  const [selectedBranch, setSelectedBranch] = useState("all");
  const [selectedSubject, setSelectedSubject] = useState("all");

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

    // reset dependent filters
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
      subject: selectedSubject,
    });
  };

  return (
    <aside className="w-[280px] min-h-screen bg-white border-r border-borderLight p-6 hidden md:block">
      {/* Title */}
      <h2 className="mb-4 text-sm font-semibold text-textPrimary">Filters</h2>

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

      {/* Subject */}
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

      {/* Apply Button */}
      <button
        onClick={applyFilters}
        className="w-full h-10 text-sm font-medium text-white rounded-md bg-primary"
      >
        Apply Filters
      </button>

      {/* Divider */}
      <hr className="my-6 border-borderLight" />

      {/* Quick Links */}
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
