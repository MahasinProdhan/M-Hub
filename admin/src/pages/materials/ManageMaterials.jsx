import { useEffect, useState } from "react";
import AdminLayout from "../../components/AdminLayout.jsx";
import { apiRequest } from "../../services/api.js";
import toast from "react-hot-toast";
import { confirmToast } from "../../utils/confirmToast.jsx";

const ManageMaterials = () => {
  const [allMaterials, setAllMaterials] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [filters, setFilters] = useState({
    course: "",
    semester: "",
    type: "",
    subject: "",
  });

  const fetchMaterials = async () => {
    try {
      setLoading(true);
      const res = await apiRequest("/materials");
      setAllMaterials(res.data);
      setMaterials(res.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMaterials();
  }, []);

  const applyFilters = () => {
    let filtered = [...allMaterials];

    if (filters.course) {
      filtered = filtered.filter((m) => m.course === filters.course);
    }

    if (filters.semester) {
      filtered = filtered.filter(
        (m) => m.semester === Number(filters.semester),
      );
    }

    if (filters.type) {
      filtered = filtered.filter((m) => m.type === filters.type);
    }

    if (filters.subject) {
      filtered = filtered.filter((m) =>
        m.subject.toLowerCase().includes(filters.subject.toLowerCase()),
      );
    }

    setMaterials(filtered);
  };

  const handleDelete = async (id) => {
    try {
      await apiRequest(`/admin/materials/${id}`, {
        method: "DELETE",
      });

      setAllMaterials((prev) => prev.filter((m) => m._id !== id));
      setMaterials((prev) => prev.filter((m) => m._id !== id));

      toast.success("Study material deleted successfully");
    } catch (err) {
      toast.error(err.message);
    }
  };

  const confirmDelete = (id) => {
    confirmToast("Are you sure you want to delete this study material?", () =>
      handleDelete(id),
    );
  };

  return (
    <AdminLayout>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-textPrimary">
          Manage Study Materials
        </h1>
        <p className="mt-1 text-sm text-textSecondary">
          View and delete uploaded study materials
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

        <select
          value={filters.type}
          onChange={(e) => setFilters({ ...filters, type: e.target.value })}
          className="h-10 px-3 border rounded-md border-borderLight"
        >
          <option value="">All Types</option>
          <option value="notes">Notes</option>
          <option value="reference">Reference</option>
          <option value="guide">Guide</option>
        </select>

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
      {loading && (
        <p className="text-sm text-textSecondary">Loading materials...</p>
      )}

      {error && (
        <p className="p-3 text-sm rounded-md text-danger bg-red-50">{error}</p>
      )}

      {!loading && materials.length === 0 && (
        <p className="text-sm text-textSecondary">No materials found.</p>
      )}

      {/* Table */}
      {!loading && materials.length > 0 && (
        <div className="p-4 overflow-x-auto card shadow-card">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b text-textSecondary">
                <th className="py-2">Title</th>
                <th>Subject</th>
                <th>Course</th>
                <th>Semester</th>
                <th>Type</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {materials.map((m) => (
                <tr key={m._id} className="border-b last:border-none">
                  <td className="py-2 font-medium text-textPrimary">
                    {m.title}
                  </td>
                  <td>{m.subject}</td>
                  <td>{m.course}</td>
                  <td>{m.semester}</td>
                  <td className="capitalize">{m.type}</td>
                  <td>
                    <button
                      onClick={() => confirmDelete(m._id)}
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

export default ManageMaterials;
