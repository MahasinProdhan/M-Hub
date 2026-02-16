import Sidebar from "../components/Sidebar";
import PYQCard from "../components/PYQCard";
import { PYQS } from "../data/pyqs";
import { useFilters } from "../context/FilterContext";

const PYQs = () => {
  const { filters } = useFilters();

  const filteredPYQs = PYQS.filter((pyq) => {
    if (filters.course !== "all" && pyq.course !== filters.course) {
      return false;
    }

    if (
      filters.semester !== "all" &&
      pyq.semester !== Number(filters.semester)
    ) {
      return false;
    }

    if (filters.branch !== "all" && pyq.branch !== filters.branch) {
      return false;
    }

    if (filters.subject !== "all" && pyq.subject !== filters.subject) {
      return false;
    }

    return true;
  });

  return (
    <div className="flex min-h-screen bg-appBg">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 p-8">
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-textPrimary">
            Previous Year Questions
          </h1>
          <p className="mt-1 text-sm text-textSecondary">
            Showing {filteredPYQs.length} results
          </p>
        </div>

        {/* PYQ List */}
        {filteredPYQs.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredPYQs.map((pyq) => (
              <PYQCard key={pyq.id} pyq={pyq} />
            ))}
          </div>
        ) : (
          <div className="p-6 text-center card text-textSecondary">
            No PYQs found for selected filters.
          </div>
        )}
      </main>
    </div>
  );
};

export default PYQs;
