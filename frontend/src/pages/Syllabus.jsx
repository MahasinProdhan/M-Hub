import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import SyllabusCard from "../components/SyllabusCard";
import { useFilters } from "../context/FilterContext";
import { apiRequest } from "../services/api.js";

const Syllabus = () => {
  const { filters } = useFilters();

  const [syllabus, setSyllabus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSyllabus = async () => {
      try {
        setLoading(true);

        const params = new URLSearchParams();

        if (filters.course !== "all") params.append("course", filters.course);
        if (filters.semester !== "all")
          params.append("semester", filters.semester);
        if (filters.branch !== "all") params.append("branch", filters.branch);

        const result = await apiRequest(`/syllabus?${params.toString()}`);

        setSyllabus(result.data);
        setError(null);
      } catch (err) {
        setError("Failed to load syllabus");
      } finally {
        setLoading(false);
      }
    };

    fetchSyllabus();
  }, [filters]);

  return (
    <div className="flex min-h-screen bg-appBg">
      {/* Sidebar */}
      <Sidebar />

      <main className="flex-1 p-8">
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-textPrimary">Syllabus</h1>
          <p className="mt-1 text-sm text-textSecondary">
            Showing {syllabus.length} results
          </p>
        </div>

        {/* Loading */}
        {loading && <p>Loading syllabus...</p>}

        {/* Error */}
        {error && <p className="text-red-500">{error}</p>}

        {/* Syllabus List */}
        {!loading && !error && syllabus.length > 0 ? (
          <div className="space-y-4">
            {syllabus.map((item) => (
              <SyllabusCard key={item._id} syllabus={item} />
            ))}
          </div>
        ) : (
          !loading &&
          !error && (
            <div className="p-6 text-center card text-textSecondary">
              No syllabus found for selected filters.
            </div>
          )
        )}
      </main>
    </div>
  );
};

export default Syllabus;
