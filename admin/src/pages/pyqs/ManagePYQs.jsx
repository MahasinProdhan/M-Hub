import { useEffect, useState } from "react";
import AdminLayout from "../../components/AdminLayout.jsx";
import { apiRequest } from "../../services/api.js";
import toast from "react-hot-toast";
import { confirmToast } from "../../utils/confirmToast.jsx";

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

  const fetchPYQs = async () => {
    try {
      setLoading(true);
      const res = await apiRequest("/pyqs");
      setAllPyqs(res.data);
      setPyqs(res.data);
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
    let filtered = [...allPyqs];

    if (filters.course) {
      filtered = filtered.filter((p) => p.course === filters.course);
    }

    if (filters.semester) {
      filtered = filtered.filter(
        (p) => p.semester === Number(filters.semester),
      );
    }

    if (filters.year) {
      filtered = filtered.filter((p) => p.year === Number(filters.year));
    }

    if (filters.subject) {
      filtered = filtered.filter((p) =>
        p.subject.toLowerCase().includes(filters.subject.toLowerCase()),
      );
    }

    setPyqs(filtered);
  };

  const handleDelete = async (id) => {
    try {
      await apiRequest(`/admin/pyqs/${id}`, {
        method: "DELETE",
      });

      setAllPyqs((prev) => prev.filter((p) => p._id !== id));
      setPyqs((prev) => prev.filter((p) => p._id !== id));

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

  return (
    <AdminLayout>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-textPrimary">Manage PYQs</h1>
        <p className="mt-1 text-sm text-textSecondary">
          View and delete previous year question papers
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
                  <td>
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
    </AdminLayout>
  );
};

export default ManagePYQs;
