import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import StudyMaterialCard from "../components/StudyMaterialCard";
import { useFilters } from "../context/FilterContext";

const StudyMaterials = () => {
  const { filters } = useFilters();

  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        setLoading(true);

        const params = new URLSearchParams();

        if (filters.course !== "all") params.append("course", filters.course);
        if (filters.semester !== "all")
          params.append("semester", filters.semester);
        if (filters.branch !== "all") params.append("branch", filters.branch);
        if (filters.subject !== "all")
          params.append("subject", filters.subject);

        const response = await fetch(
          `http://localhost:5000/api/materials?${params.toString()}`,
        );

        const result = await response.json();

        setMaterials(result.data);
        setError(null);
      } catch (err) {
        setError("Failed to load study materials");
      } finally {
        setLoading(false);
      }
    };

    fetchMaterials();
  }, [filters]);

  return (
    <div className="flex min-h-screen bg-appBg">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 p-8">
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-textPrimary">
            Study Materials
          </h1>
          <p className="mt-1 text-sm text-textSecondary">
            Showing {materials.length} results
          </p>
        </div>

        {/* Loading */}
        {loading && <p>Loading study materials...</p>}

        {/* Error */}
        {error && <p className="text-red-500">{error}</p>}

        {/* Study Material List */}
        {!loading && !error && materials.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {materials.map((material) => (
              <StudyMaterialCard key={material._id} material={material} />
            ))}
          </div>
        ) : (
          !loading &&
          !error && (
            <div className="p-6 text-center card text-textSecondary">
              No study materials found for selected filters.
            </div>
          )
        )}
      </main>
    </div>
  );
};

export default StudyMaterials;
