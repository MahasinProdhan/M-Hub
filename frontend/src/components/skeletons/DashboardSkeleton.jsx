import ListSkeleton from "./ListSkeleton.jsx";

const DashboardSkeleton = () => {
  return (
    <main className="flex-1 p-8 animate-pulse">
      <div className="p-6 border rounded-xl border-borderLight bg-white">
        <div className="w-48 h-6 rounded bg-gray-200" />
        <div className="w-3/4 h-4 mt-3 rounded bg-gray-200" />
      </div>

      <div className="grid grid-cols-1 gap-6 mt-10 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={`dashboard-action-skeleton-${index}`} className="p-6 card">
            <div className="w-2/3 h-5 rounded bg-gray-200" />
            <div className="w-5/6 h-4 mt-3 rounded bg-gray-200" />
            <div className="w-16 h-4 mt-6 rounded bg-gray-200" />
          </div>
        ))}
      </div>

      <section className="mt-14">
        <div className="flex items-center justify-between mb-4">
          <div className="w-32 h-5 rounded bg-gray-200" />
          <div className="w-28 h-3 rounded bg-gray-200" />
        </div>

        <ListSkeleton count={4} cardVariant="recent" columnsClass="md:grid-cols-2" />
      </section>
    </main>
  );
};

export default DashboardSkeleton;
