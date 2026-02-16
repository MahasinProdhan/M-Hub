import { useMemo, useState } from "react";
import { COURSES, SEMESTERS, SUBJECTS } from "../utils/constants.js";

const BRANCH_TO_SUBJECT_KEY = {
  "Computer Science Engineering": "cse",
  "Information Technology": "it",
};

const Sidebar = () => {
  const initialCourseId = COURSES[0]?.id ?? "";
  const initialCourse = COURSES.find((course) => course.id === initialCourseId);
  const initialBranch = initialCourse?.hasBranches
    ? (initialCourse.branches?.[0] ?? "")
    : "";

  const [selectedCourseId, setSelectedCourseId] = useState(initialCourseId);
  const [selectedBranch, setSelectedBranch] = useState(initialBranch);
  const [selectedSemester, setSelectedSemester] = useState(
    String(SEMESTERS[0] ?? ""),
  );
  const [selectedSubject, setSelectedSubject] = useState("all");

  const selectedCourse = useMemo(
    () => COURSES.find((course) => course.id === selectedCourseId),
    [selectedCourseId],
  );

  const subjectOptions = useMemo(() => {
    if (!selectedCourse) return SUBJECTS.common;

    if (!selectedCourse.hasBranches) {
      return SUBJECTS.common;
    }

    const subjectKey = BRANCH_TO_SUBJECT_KEY[selectedBranch];
    const branchSubjects = subjectKey ? (SUBJECTS[subjectKey] ?? []) : [];

    return [...new Set([...SUBJECTS.common, ...branchSubjects])];
  }, [selectedCourse, selectedBranch]);

  const handleCourseChange = (event) => {
    const nextCourseId = event.target.value;
    const nextCourse = COURSES.find((course) => course.id === nextCourseId);

    setSelectedCourseId(nextCourseId);
    setSelectedBranch(
      nextCourse?.hasBranches ? (nextCourse.branches?.[0] ?? "") : "",
    );
    setSelectedSubject("all");
  };

  const handleBranchChange = (event) => {
    setSelectedBranch(event.target.value);
    setSelectedSubject("all");
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
          onChange={(event) => setSelectedSemester(event.target.value)}
          className="w-full h-10 px-3 text-sm border rounded-md border-borderLight"
        >
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
          onChange={(event) => setSelectedSubject(event.target.value)}
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
      <button className="w-full h-10 text-sm font-medium text-white rounded-md bg-primary">
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
