import { useEffect, useState } from "react";
import AdminLayout from "../../components/AdminLayout.jsx";
import { apiRequest } from "../../services/api.js";
import toast from "react-hot-toast";
import { confirmToast } from "../../utils/confirmToast.jsx";
import { COURSES, SEMESTERS } from "../../utils/constants.js";

const filterPyqList = (list, filters) => {
  let filtered = [...list];

  if (filters.course) {
    filtered = filtered.filter((p) => p.course === filters.course);
  }

  if (filters.semester) {
    filtered = filtered.filter((p) => p.semester === Number(filters.semester));
  }

  if (filters.year) {
    filtered = filtered.filter((p) => p.year === Number(filters.year));
  }

  if (filters.subject) {
    filtered = filtered.filter((p) =>
      p.subject.toLowerCase().includes(filters.subject.toLowerCase()),
    );
  }

  return filtered;
};

const ManagePYQs = () => {
  const [allPyqs, setAllPyqs] = useState([]);
  const [pyqs, setPyqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [filters, setFilters] = useState({
    course: "",
    semester: "",
    year: "",
    subject: "",
  });
  const [editingPyq, setEditingPyq] = useState(null);
  const [savingEdit, setSavingEdit] = useState(false);
  const [editForm, setEditForm] = useState({
    subject: "",
    course: "",
    branch: "",
    semester: "",
    year: "",
  });

  const selectedEditCourse = COURSES.find((course) => course.id === editForm.course);

  const fetchPYQs = async () => {
    try {
      setLoading(true);
      const res = await apiRequest("/pyqs");
      setAllPyqs(res.data);
      setPyqs(filterPyqList(res.data, filters));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPYQs();
  }, []);

  const applyFilters = () => {
    setPyqs(filterPyqList(allPyqs, filters));
  };

  const handleDelete = async (id) => {
    try {
      await apiRequest(`/admin/pyqs/${id}`, {
        method: "DELETE",
      });

      const updatedAllPyqs = allPyqs.filter((p) => p._id !== id);
      setAllPyqs(updatedAllPyqs);
      setPyqs(filterPyqList(updatedAllPyqs, filters));

      toast.success("PYQ deleted successfully");
    } catch (err) {
      toast.error(err.message);
    }
  };

  const confirmDelete = (id) => {
    confirmToast("Are you sure you want to delete this PYQ?", () =>
      handleDelete(id),
    );
  };

  const openEditModal = (pyq) => {
    setEditingPyq(pyq);
    setEditForm({
      subject: pyq.subject || "",
      course: pyq.course || "",
      branch: pyq.branch || "",
      semester: String(pyq.semester || ""),
      year: String(pyq.year || ""),
    });
  };

  const closeEditModal = () => {
    setEditingPyq(null);
    setEditForm({
      subject: "",
      course: "",
      branch: "",
      semester: "",
      year: "",
    });
  };

  const handleEditChange = (field, value) => {
    setEditForm((prev) => {
      const next = { ...prev, [field]: value };

      if (field === "course" && value !== "btech") {
        next.branch = "";
      }

      return next;
    });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();

    if (!editingPyq?._id) return;

    const trimmedSubject = editForm.subject.trim();
    const trimmedBranch = editForm.branch.trim();

    if (!trimmedSubject) {
      toast.error("Subject is required");
      return;
    }

    if (!editForm.course) {
      toast.error("Course is required");
      return;
    }

    if (!editForm.semester) {
      toast.error("Semester is required");
      return;
    }

    if (!editForm.year) {
      toast.error("Year is required");
      return;
    }

    if (editForm.course === "btech" && !trimmedBranch) {
      toast.error("Branch is required for BTech");
      return;
    }

    const payload = {
      subject: trimmedSubject,
      course: editForm.course,
      branch: editForm.course === "btech" ? trimmedBranch : null,
      semester: Number(editForm.semester),
      year: Number(editForm.year),
    };

    try {
      setSavingEdit(true);

      const response = await apiRequest(`/admin/pyqs/${editingPyq._id}`, {
        method: "PATCH",
        body: JSON.stringify(payload),
      });

      const updatedPyq = response.pyq;
      const updatedAllPyqs = allPyqs.map((p) =>
        p._id === updatedPyq._id ? updatedPyq : p,
      );

      setAllPyqs(updatedAllPyqs);
      setPyqs(filterPyqList(updatedAllPyqs, filters));
      closeEditModal();

      toast.success("PYQ updated successfully");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSavingEdit(false);
    }
  };

  return (
    <AdminLayout>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-textPrimary">Manage PYQs</h1>
        <p className="mt-1 text-sm text-textSecondary">
          View, edit and delete previous year question papers
        </p>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 gap-4 p-4 mb-6 md:grid-cols-4 card shadow-card">
        <select
          value={filters.course}
          onChange={(e) => setFilters({ ...filters, course: e.target.value })}
          className="h-10 px-3 border rounded-md border-borderLight"
        >
          <option value="">All Courses</option>
          {COURSES.map((course) => (
            <option key={course.id} value={course.id}>
              {course.name}
            </option>
          ))}
        </select>

        <select
          value={filters.semester}
          onChange={(e) => setFilters({ ...filters, semester: e.target.value })}
          className="h-10 px-3 border rounded-md border-borderLight"
        >
          <option value="">All Semesters</option>
          {SEMESTERS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>

        <input
          type="number"
          placeholder="Year"
          value={filters.year}
          onChange={(e) => setFilters({ ...filters, year: e.target.value })}
          className="h-10 px-3 border rounded-md border-borderLight"
        />

        <input
          type="text"
          placeholder="Search subject"
          value={filters.subject}
          onChange={(e) => setFilters({ ...filters, subject: e.target.value })}
          className="h-10 px-3 border rounded-md border-borderLight"
        />

        <button
          onClick={applyFilters}
          className="h-10 text-white rounded-md bg-primary"
        >
          Apply Filters
        </button>
      </div>

      {/* States */}
      {loading && <p className="text-sm text-textSecondary">Loading PYQs...</p>}

      {error && (
        <p className="p-3 text-sm rounded-md text-danger bg-red-50">{error}</p>
      )}

      {!loading && pyqs.length === 0 && (
        <p className="text-sm text-textSecondary">No PYQs found.</p>
      )}

      {/* Table */}
      {!loading && pyqs.length > 0 && (
        <div className="p-4 overflow-x-auto card shadow-card">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b text-textSecondary">
                <th className="py-2">Subject</th>
                <th>Course</th>
                <th>Semester</th>
                <th>Year</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {pyqs.map((pyq) => (
                <tr key={pyq._id} className="border-b last:border-none">
                  <td className="py-2 font-medium text-textPrimary">
                    {pyq.subject}
                  </td>
                  <td>{pyq.course}</td>
                  <td>{pyq.semester}</td>
                  <td>{pyq.year}</td>
                  <td className="space-x-3">
                    <button
                      onClick={() => openEditModal(pyq)}
                      className="text-sm font-medium text-primary hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => confirmDelete(pyq._id)}
                      className="text-sm font-medium text-danger hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {editingPyq && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
          <div className="w-full max-w-lg p-6 space-y-4 bg-white rounded-lg shadow-xl">
            <div>
              <h2 className="text-lg font-semibold text-textPrimary">Edit PYQ</h2>
              <p className="text-sm text-textSecondary">
                Update PYQ details without re-uploading the file.
              </p>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block mb-1 text-sm font-medium">Subject</label>
                <input
                  type="text"
                  value={editForm.subject}
                  onChange={(e) => handleEditChange("subject", e.target.value)}
                  className="w-full h-10 px-3 border rounded-md border-borderLight"
                  required
                />
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium">Course</label>
                <select
                  value={editForm.course}
                  onChange={(e) => handleEditChange("course", e.target.value)}
                  className="w-full h-10 px-3 border rounded-md border-borderLight"
                  required
                >
                  <option value="">Select course</option>
                  {COURSES.map((course) => (
                    <option key={course.id} value={course.id}>
                      {course.name}
                    </option>
                  ))}
                </select>
              </div>

              {selectedEditCourse?.hasBranches && (
                <div>
                  <label className="block mb-1 text-sm font-medium">Branch</label>
                  <select
                    value={editForm.branch}
                    onChange={(e) => handleEditChange("branch", e.target.value)}
                    className="w-full h-10 px-3 border rounded-md border-borderLight"
                    required
                  >
                    <option value="">Select branch</option>
                    {selectedEditCourse.branches.map((branch) => (
                      <option key={branch} value={branch}>
                        {branch}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block mb-1 text-sm font-medium">Semester</label>
                  <select
                    value={editForm.semester}
                    onChange={(e) => handleEditChange("semester", e.target.value)}
                    className="w-full h-10 px-3 border rounded-md border-borderLight"
                    required
                  >
                    <option value="">Select semester</option>
                    {SEMESTERS.map((sem) => (
                      <option key={sem} value={sem}>
                        {sem}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block mb-1 text-sm font-medium">Year</label>
                  <input
                    type="number"
                    value={editForm.year}
                    onChange={(e) => handleEditChange("year", e.target.value)}
                    className="w-full h-10 px-3 border rounded-md border-borderLight"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeEditModal}
                  className="px-4 py-2 text-sm border rounded-md border-borderLight"
                  disabled={savingEdit}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm text-white rounded-md bg-primary disabled:opacity-60"
                  disabled={savingEdit}
                >
                  {savingEdit ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default ManagePYQs;
