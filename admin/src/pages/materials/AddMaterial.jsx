import { useState } from "react";
import AdminLayout from "../../components/AdminLayout.jsx";
import { COURSES, SEMESTERS } from "../../utils/constants.js";
import { apiRequest } from "../../services/api.js";
import toast from "react-hot-toast";

const MATERIAL_TYPES = ["notes", "reference", "guide"];

const AddMaterial = () => {
  const [formData, setFormData] = useState({
    title: "",
    subject: "",
    course: "",
    branch: "",
    semester: "",
    type: "",
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await apiRequest("/admin/materials", {
        method: "POST",
        body: JSON.stringify({
          ...formData,
          semester: Number(formData.semester),
          fileType: "PDF",
          branch: selectedCourse?.hasBranches ? formData.branch : null,
        }),
      });

      toast.success("Study material added successfully");

      setFormData({
        title: "",
        subject: "",
        course: "",
        branch: "",
        semester: "",
        type: "",
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
        <h1 className="text-2xl font-semibold text-textPrimary">
          Add Study Material
        </h1>
        <p className="mt-1 text-sm text-textSecondary">
          Upload notes, references, or guides
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
            placeholder="DBMS Notes – Unit Wise"
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
            placeholder="Database Management System"
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

        {/* Type */}
        <div>
          <label className="block mb-1 text-sm font-medium">
            Material Type
          </label>
          <select
            name="type"
            required
            value={formData.type}
            onChange={handleChange}
            className="w-full px-4 border rounded-md h-11 border-borderLight"
          >
            <option value="">Select type</option>
            {MATERIAL_TYPES.map((t) => (
              <option key={t} value={t}>
                {t.charAt(0).toUpperCase() + t.slice(1)}
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
          {loading ? "Adding..." : "Add Material"}
        </button>
      </form>
    </AdminLayout>
  );
};

export default AddMaterial;
