import { useState } from "react";
import AdminLayout from "../../components/AdminLayout.jsx";
import { COURSES, SEMESTERS } from "../../utils/constants.js";
import { apiRequest } from "../../services/api.js";
import toast from "react-hot-toast";

const AddPYQ = () => {
  const [formData, setFormData] = useState({
    title: "",
    subject: "",
    course: "",
    branch: "",
    semester: "",
    year: "",
    pdfFile: null,
    driveLink: "",
  });

  const [loading, setLoading] = useState(false);

  const selectedCourse = COURSES.find((c) => c.id === formData.course);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePdfChange = (e) => {
    const file = e.target.files?.[0] || null;
    setFormData((prev) => ({
      ...prev,
      pdfFile: file,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const hasDriveLink = formData.driveLink.trim().length > 0;
    const hasPdfFile = Boolean(formData.pdfFile);

    if (!hasDriveLink && !hasPdfFile) {
      toast.error("Upload a PDF OR paste a Google Drive link");
      return;
    }

    try {
      setLoading(true);

      const payload = new FormData();
      payload.append("title", formData.title);
      payload.append("subject", formData.subject);
      payload.append("course", formData.course);
      payload.append("semester", String(Number(formData.semester)));
      payload.append("year", String(Number(formData.year)));
      payload.append("fileType", "PDF");

      if (selectedCourse?.hasBranches) {
        payload.append("branch", formData.branch);
      }

      if (hasDriveLink) {
        payload.append("driveLink", formData.driveLink.trim());
      }

      if (hasPdfFile) {
        payload.append("pdfFile", formData.pdfFile);
      }

      await apiRequest("/admin/pyqs", {
        method: "POST",
        body: payload,
      });

      toast.success("PYQ added successfully");

      setFormData({
        title: "",
        subject: "",
        course: "",
        branch: "",
        semester: "",
        year: "",
        pdfFile: null,
        driveLink: "",
      });
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-textPrimary">Add PYQ</h1>
        <p className="mt-1 text-sm text-textSecondary">
          Add a previous year question paper
        </p>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="max-w-3xl p-6 space-y-5 card shadow-card"
      >
        {/* Title */}
        <div>
          <label className="block mb-1 text-sm font-medium">Title</label>
          <input
            type="text"
            name="title"
            required
            value={formData.title}
            onChange={handleChange}
            placeholder="Operating System PYQ (2023)"
            className="w-full px-4 border rounded-md h-11 border-borderLight"
          />
        </div>

        {/* Subject */}
        <div>
          <label className="block mb-1 text-sm font-medium">Subject</label>
          <input
            type="text"
            name="subject"
            required
            value={formData.subject}
            onChange={handleChange}
            placeholder="Operating System"
            className="w-full px-4 border rounded-md h-11 border-borderLight"
          />
        </div>

        {/* Course */}
        <div>
          <label className="block mb-1 text-sm font-medium">Course</label>
          <select
            name="course"
            required
            value={formData.course}
            onChange={handleChange}
            className="w-full px-4 border rounded-md h-11 border-borderLight"
          >
            <option value="">Select course</option>
            {COURSES.map((course) => (
              <option key={course.id} value={course.id}>
                {course.name}
              </option>
            ))}
          </select>
        </div>

        {/* Branch (conditional) */}
        {selectedCourse?.hasBranches && (
          <div>
            <label className="block mb-1 text-sm font-medium">Branch</label>
            <select
              name="branch"
              required
              value={formData.branch}
              onChange={handleChange}
              className="w-full px-4 border rounded-md h-11 border-borderLight"
            >
              <option value="">Select branch</option>
              {selectedCourse.branches.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Semester */}
        <div>
          <label className="block mb-1 text-sm font-medium">Semester</label>
          <select
            name="semester"
            required
            value={formData.semester}
            onChange={handleChange}
            className="w-full px-4 border rounded-md h-11 border-borderLight"
          >
            <option value="">Select semester</option>
            {SEMESTERS.map((sem) => (
              <option key={sem} value={sem}>
                {sem}
              </option>
            ))}
          </select>
        </div>

        {/* Year */}
        <div>
          <label className="block mb-1 text-sm font-medium">Year</label>
          <input
            type="number"
            name="year"
            required
            value={formData.year}
            onChange={handleChange}
            placeholder="2023"
            className="w-full px-4 border rounded-md h-11 border-borderLight"
          />
        </div>

        <div>
          <p className="text-xs text-textSecondary">
            Upload a PDF OR paste a Google Drive link
          </p>
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium">PDF File</label>
          <input
            type="file"
            name="pdfFile"
            accept="application/pdf"
            onChange={handlePdfChange}
            className="w-full px-4 py-2 border rounded-md border-borderLight"
          />
        </div>

        {/* Drive Link */}
        <div>
          <label className="block mb-1 text-sm font-medium">
            Google Drive Link
          </label>
          <input
            type="url"
            name="driveLink"
            value={formData.driveLink}
            onChange={handleChange}
            placeholder="https://drive.google.com/..."
            className="w-full px-4 border rounded-md h-11 border-borderLight"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 text-sm font-medium text-white rounded-md bg-primary hover:bg-primaryLight disabled:opacity-60"
        >
          {loading ? "Adding..." : "Add PYQ"}
        </button>
      </form>
    </AdminLayout>
  );
};

export default AddPYQ;
