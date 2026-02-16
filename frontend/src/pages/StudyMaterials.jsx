import Sidebar from "../components/Sidebar";
import StudyMaterialCard from "../components/StudyMaterialCard";
import { STUDY_MATERIALS } from "../data/studyMaterials";

const StudyMaterials = () => {
  // frontend-only (no filtering yet)
  const filteredMaterials = STUDY_MATERIALS;

  return (
    <div className="flex min-h-screen bg-appBg">
      {/* Sidebar */}
      <Sidebar />

      {/* Main */}
      <main className="flex-1 p-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-textPrimary">
            Study Materials
          </h1>
          <p className="mt-1 text-sm text-textSecondary">
            Showing {filteredMaterials.length} resources
          </p>
        </div>

        {/* List */}
        {filteredMaterials.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredMaterials.map((material) => (
              <StudyMaterialCard key={material.id} material={material} />
            ))}
          </div>
        ) : (
          <div className="p-6 text-center card text-textSecondary">
            No study materials found for selected filters.
          </div>
        )}
      </main>
    </div>
  );
};

export default StudyMaterials;
