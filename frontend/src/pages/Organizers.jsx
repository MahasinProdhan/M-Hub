import Sidebar from "../components/Sidebar";
import OrganizerCard from "../components/OrganizerCard";
import { ORGANIZERS } from "../data/organizers";
import { useFilters } from "../context/FilterContext";

const Organizers = () => {
  const { filters } = useFilters();

  const filteredOrganizers = ORGANIZERS.filter((organizer) => {
    if (filters.course !== "all" && organizer.course !== filters.course) {
      return false;
    }

    if (
      filters.semester !== "all" &&
      organizer.semester !== Number(filters.semester)
    ) {
      return false;
    }

    if (filters.branch !== "all" && organizer.branch !== filters.branch) {
      return false;
    }

    if (filters.subject !== "all" && organizer.subject !== filters.subject) {
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
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-textPrimary">
            Organizers
          </h1>
          <p className="mt-1 text-sm text-textSecondary">
            Showing {filteredOrganizers.length} resources
          </p>
        </div>

        {/* List */}
        {filteredOrganizers.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredOrganizers.map((organizer) => (
              <OrganizerCard key={organizer.id} organizer={organizer} />
            ))}
          </div>
        ) : (
          <div className="p-6 text-center card text-textSecondary">
            No organizers found for selected filters.
          </div>
        )}
      </main>
    </div>
  );
};

export default Organizers;
