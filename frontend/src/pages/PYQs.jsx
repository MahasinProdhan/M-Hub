import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import Sidebar from "../components/Sidebar";
import PYQCard from "../components/PYQCard";
import { useFilters } from "../context/FilterContext";
import { useAuth } from "../context/AuthContext.jsx";
import { useSavedResources } from "../context/SavedResourcesContext.jsx";

const PYQs = () => {
  const { filters } = useFilters();
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();
  const { isSaved, isResourcePending, toggleSavedResource } = useSavedResources();

  const [pyqs, setPyqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPYQs = async () => {
      try {
        setLoading(true);

        const params = new URLSearchParams();

        if (filters.course !== "all") params.append("course", filters.course);
        if (filters.semester !== "all") params.append("semester", filters.semester);
        if (filters.branch !== "all") params.append("branch", filters.branch);
        if (filters.subject !== "all") params.append("subject", filters.subject);
        if (filters.search) params.append("search", filters.search);

        const response = await fetch(
          `http://localhost:5000/api/pyqs?${params.toString()}`,
        );

        const result = await response.json();

        setPyqs(result.data);
        setError(null);
      } catch (err) {
        setError("Failed to load PYQs");
      } finally {
        setLoading(false);
      }
    };

    fetchPYQs();
  }, [filters]);

  const handleToggleSave = async (pyq) => {
    if (!isLoggedIn) {
      toast.error("Please login to save resources");
      navigate("/login");
      return;
    }

    await toggleSavedResource({
      resourceType: "pyq",
      resourceId: pyq._id,
      resource: pyq,
    });
  };

  return (
    <div className="flex min-h-screen bg-appBg">
      <Sidebar />

      <main className="flex-1 p-8">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-textPrimary">
            Previous Year Questions
          </h1>
          <p className="mt-1 text-sm text-textSecondary">
            Showing {pyqs.length} results
          </p>
        </div>

        {loading && <p>Loading PYQs...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {!loading && !error && pyqs.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {pyqs.map((pyq) => (
              <PYQCard
                key={pyq._id}
                pyq={pyq}
                isSaved={isSaved("pyq", pyq._id)}
                isSaving={isResourcePending("pyq", pyq._id)}
                onToggleSave={() => handleToggleSave(pyq)}
              />
            ))}
          </div>
        ) : (
          !loading &&
          !error && (
            <div className="p-6 text-center card text-textSecondary">
              No PYQs found for selected filters.
            </div>
          )
        )}
      </main>
    </div>
  );
};

export default PYQs;
