/* ===============================
   University Info
================================ */

export const UNIVERSITY = {
  name: "XYZ University",
  shortName: "XYZU",
};

/* ===============================
   Courses & Branches
================================ */

/**
 * NOTE:
 * - Only BTech has branches
 * - Other courses are kept simple
 * - This avoids over-engineering
 */

export const COURSES = [
  {
    id: "btech",
    name: "BTech",
    hasBranches: true,
    branches: [
      "Computer Science Engineering",
      "Information Technology",
      "Electronics & Communication",
      "Electrical Engineering",
      "Mechanical Engineering",
      "Civil Engineering",
      "Computer Science & Business Systems (CSBS)",
      "Data Science",
      "ECE (AI & ML)",
      "Computer Science (Cyber Security)",
    ],
  },
  {
    id: "bca",
    name: "BCA",
    hasBranches: false,
  },
  {
    id: "bsc",
    name: "BSc",
    hasBranches: false,
  },
  {
    id: "ba",
    name: "BA",
    hasBranches: false,
  },
];

/* ===============================
   Semesters
================================ */

export const SEMESTERS = [1, 2, 3, 4, 5, 6, 7, 8];

/* ===============================
   Subjects (Common / Sample)
================================ */

/**
 * These are sample subjects.
 * In frontend-only mode, this is enough.
 */

export const SUBJECTS = {
  common: ["Mathematics", "Physics", "Chemistry"],

  cse: ["Data Structures", "Operating System", "DBMS", "Computer Networks"],

  it: ["Web Technology", "Software Engineering", "DBMS"],
};

/* ===============================
   Resource Types
================================ */

export const RESOURCE_TYPES = ["Previous Year Question", "Notes", "Syllabus"];

/* ===============================
   File Types
================================ */

export const FILE_TYPES = ["PDF"];

/* ===============================
   UI Constants
================================ */

export const ITEMS_PER_PAGE = 10;
