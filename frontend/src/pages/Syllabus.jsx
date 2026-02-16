import Sidebar from "../components/Sidebar";
import SyllabusCard from "../components/SyllabusCard";
import { SYLLABUS } from "../data/syllabus";
import { useFilters } from "../context/FilterContext";

const Syllabus = () => {
  const { filters } = useFilters();

  const filteredSyllabus = SYLLABUS.filter((item) => {
    if (filters.course !== "all" && item.course !== filters.course) {
      return false;
    }

    if (
      filters.semester !== "all" &&
      item.semester !== Number(filters.semester)
    ) {
      return false;
    }

    if (filters.branch !== "all" && item.branch !== filters.branch) {
      return false;
    }

    return true;
  });

  return (
    <div className="flex min-h-screen bg-appBg">
      <Sidebar />

      <main className="flex-1 p-8">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-textPrimary">Syllabus</h1>
          <p className="mt-1 text-sm text-textSecondary">
            Showing {filteredSyllabus.length} results
          </p>
        </div>

        {filteredSyllabus.length > 0 ? (
          <div className="space-y-4">
            {filteredSyllabus.map((syllabus) => (
              <SyllabusCard key={syllabus.id} syllabus={syllabus} />
            ))}
          </div>
        ) : (
          <div className="p-6 text-center card text-textSecondary">
            No syllabus found for selected filters.
          </div>
        )}
      </main>
    </div>
  );
};

export default Syllabus;
