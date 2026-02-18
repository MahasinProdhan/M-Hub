import { useEffect, useState } from "react";
import AdminLayout from "../../components/AdminLayout.jsx";
import { apiRequest } from "../../services/api.js";

const ManageSyllabus = () => {
  const [allSyllabus, setAllSyllabus] = useState([]);
  const [syllabus, setSyllabus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [filters, setFilters] = useState({
    course: "",
    semester: "",
  });

  const fetchSyllabus = async () => {
    try {
      setLoading(true);
      const res = await apiRequest("/syllabus");
      setAllSyllabus(res.data);
      setSyllabus(res.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSyllabus();
  }, []);

  const applyFilters = () => {
    let filtered = [...allSyllabus];

    if (filters.course) {
      filtered = filtered.filter((s) => s.course === filters.course);
    }

    if (filters.semester) {
      filtered = filtered.filter(
        (s) => s.semester === Number(filters.semester),
      );
    }

    setSyllabus(filtered);
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this syllabus?",
    );

    if (!confirmDelete) return;

    try {
      await apiRequest(`/admin/syllabus/${id}`, {
        method: "DELETE",
      });

      setAllSyllabus((prev) => prev.filter((s) => s._id !== id));
      setSyllabus((prev) => prev.filter((s) => s._id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <AdminLayout>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-textPrimary">
          Manage Syllabus
        </h1>
        <p className="mt-1 text-sm text-textSecondary">
          View and delete syllabus PDFs
        </p>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 gap-4 p-4 mb-6 md:grid-cols-3 card shadow-card">
        <select
          value={filters.course}
          onChange={(e) => setFilters({ ...filters, course: e.target.value })}
          className="h-10 px-3 border rounded-md border-borderLight"
        >
          <option value="">All Courses</option>
          <option value="btech">BTech</option>
          <option value="bca">BCA</option>
          <option value="bsc">BSc</option>
          <option value="ba">BA</option>
        </select>

        <select
          value={filters.semester}
          onChange={(e) => setFilters({ ...filters, semester: e.target.value })}
          className="h-10 px-3 border rounded-md border-borderLight"
        >
          <option value="">All Semesters</option>
          {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>

        <button
          onClick={applyFilters}
          className="h-10 text-white rounded-md bg-primary"
        >
          Apply Filters
        </button>
      </div>

      {/* States */}
      {loading && (
        <p className="text-sm text-textSecondary">Loading syllabus...</p>
      )}

      {error && (
        <p className="p-3 text-sm rounded-md text-danger bg-red-50">{error}</p>
      )}

      {!loading && syllabus.length === 0 && (
        <p className="text-sm text-textSecondary">No syllabus found.</p>
      )}

      {/* Table */}
      {!loading && syllabus.length > 0 && (
        <div className="p-4 overflow-x-auto card shadow-card">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b text-textSecondary">
                <th className="py-2">Course</th>
                <th>Branch</th>
                <th>Semester</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {syllabus.map((s) => (
                <tr key={s._id} className="border-b last:border-none">
                  <td className="py-2 font-medium text-textPrimary">
                    {s.course}
                  </td>
                  <td>{s.branch || "—"}</td>
                  <td>{s.semester}</td>
                  <td>
                    <button
                      onClick={() => handleDelete(s._id)}
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
    </AdminLayout>
  );
};

export default ManageSyllabus;
