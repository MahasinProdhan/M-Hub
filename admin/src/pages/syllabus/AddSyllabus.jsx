import { useState } from "react";
import AdminLayout from "../../components/AdminLayout.jsx";
import { COURSES, SEMESTERS } from "../../utils/constants.js";
import { apiRequest } from "../../services/api.js";

const AddSyllabus = () => {
  const [formData, setFormData] = useState({
    course: "",
    branch: "",
    semester: "",
    driveLink: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const selectedCourse = COURSES.find((c) => c.id === formData.course);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      setLoading(true);

      await apiRequest("/admin/syllabus", {
        method: "POST",
        body: JSON.stringify({
          course: formData.course,
          semester: Number(formData.semester),
          driveLink: formData.driveLink,
          branch: selectedCourse?.hasBranches ? formData.branch : null,
        }),
      });

      setSuccess("Syllabus added successfully ✅");

      setFormData({
        course: "",
        branch: "",
        semester: "",
        driveLink: "",
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-textPrimary">
          Add Syllabus
        </h1>
        <p className="mt-1 text-sm text-textSecondary">
          Upload semester-wise syllabus PDF
        </p>
      </div>

      {/* Messages */}
      {error && (
        <div className="p-3 mb-4 text-sm rounded-md text-danger bg-red-50">
          {error}
        </div>
      )}

      {success && (
        <div className="p-3 mb-4 text-sm rounded-md text-success bg-green-50">
          {success}
        </div>
      )}

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="max-w-3xl p-6 space-y-5 card shadow-card"
      >
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

        {/* Drive Link */}
        <div>
          <label className="block mb-1 text-sm font-medium">
            Google Drive Link
          </label>
          <input
            type="url"
            name="driveLink"
            required
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
          {loading ? "Adding..." : "Add Syllabus"}
        </button>
      </form>
    </AdminLayout>
  );
};

export default AddSyllabus;
