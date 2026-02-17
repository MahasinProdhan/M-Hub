import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import OrganizerCard from "../components/OrganizerCard";
import { useFilters } from "../context/FilterContext";

const Organizers = () => {
  const { filters } = useFilters();

  const [organizers, setOrganizers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrganizers = async () => {
      try {
        setLoading(true);

        const params = new URLSearchParams();

        if (filters.course !== "all") params.append("course", filters.course);
        if (filters.semester !== "all")
          params.append("semester", filters.semester);
        if (filters.branch !== "all") params.append("branch", filters.branch);
        if (filters.subject !== "all")
          params.append("subject", filters.subject);

        // 🔍 SEARCH SUPPORT
        if (filters.search) params.append("search", filters.search);
        const response = await fetch(
          `http://localhost:5000/api/organizers?${params.toString()}`,
        );

        const result = await response.json();

        setOrganizers(result.data);
        setError(null);
      } catch (err) {
        setError("Failed to load organizers");
      } finally {
        setLoading(false);
      }
    };

    fetchOrganizers();
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
            Organizers
          </h1>
          <p className="mt-1 text-sm text-textSecondary">
            Showing {organizers.length} results
          </p>
        </div>

        {/* Loading */}
        {loading && <p>Loading organizers...</p>}

        {/* Error */}
        {error && <p className="text-red-500">{error}</p>}

        {/* Organizer List */}
        {!loading && !error && organizers.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {organizers.map((organizer) => (
              <OrganizerCard key={organizer._id} organizer={organizer} />
            ))}
          </div>
        ) : (
          !loading &&
          !error && (
            <div className="p-6 text-center card text-textSecondary">
              No organizers found for selected filters.
            </div>
          )
        )}
      </main>
    </div>
  );
};

export default Organizers;
