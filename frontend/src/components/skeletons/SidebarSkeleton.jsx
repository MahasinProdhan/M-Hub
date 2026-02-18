const SidebarSkeleton = () => {
  return (
    <aside className="w-[280px] min-h-screen hidden md:block border-r border-borderLight bg-white p-6 animate-pulse">
      <div className="w-20 h-4 rounded bg-gray-200" />

      <div className="mt-5 space-y-4">
        <div className="space-y-2">
          <div className="w-12 h-3 rounded bg-gray-200" />
          <div className="w-full h-10 rounded-md bg-gray-200" />
        </div>
        <div className="space-y-2">
          <div className="w-12 h-3 rounded bg-gray-200" />
          <div className="w-full h-10 rounded-md bg-gray-200" />
        </div>
        <div className="space-y-2">
          <div className="w-12 h-3 rounded bg-gray-200" />
          <div className="w-full h-10 rounded-md bg-gray-200" />
        </div>
        <div className="space-y-2">
          <div className="w-12 h-3 rounded bg-gray-200" />
          <div className="w-full h-10 rounded-md bg-gray-200" />
        </div>
      </div>

      <div className="w-full h-10 mt-6 rounded-md bg-gray-200" />
      <div className="w-full h-10 mt-3 rounded-md bg-gray-200" />

      <div className="h-px my-6 bg-gray-200" />

      <div className="space-y-3">
        <div className="w-24 h-3 rounded bg-gray-200" />
        <div className="w-32 h-3 rounded bg-gray-200" />
        <div className="w-24 h-3 rounded bg-gray-200" />
      </div>
    </aside>
  );
};

export default SidebarSkeleton;
