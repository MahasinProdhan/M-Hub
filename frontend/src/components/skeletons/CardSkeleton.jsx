const CardSkeleton = ({ variant = "resource" }) => {
  if (variant === "recent") {
    return (
      <div className="flex items-start justify-between gap-3 p-4 card animate-pulse">
        <div className="min-w-0 flex-1">
          <div className="w-16 h-5 rounded-full bg-gray-200" />
          <div className="w-3/4 h-4 mt-3 rounded bg-gray-200" />
          <div className="w-2/3 h-3 mt-2 rounded bg-gray-200" />
        </div>
        <div className="w-4 h-4 mt-1 rounded bg-gray-200" />
      </div>
    );
  }

  if (variant === "list") {
    return (
      <div className="p-5 card animate-pulse">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <div className="w-14 h-5 rounded-full bg-gray-200" />
              <div className="w-12 h-5 rounded-full bg-gray-200" />
            </div>
            <div className="w-2/3 h-5 mt-3 rounded bg-gray-200" />
            <div className="w-1/2 h-4 mt-2 rounded bg-gray-200" />
            <div className="flex gap-2 mt-3">
              <div className="w-16 h-5 rounded bg-gray-200" />
              <div className="w-16 h-5 rounded bg-gray-200" />
              <div className="w-20 h-5 rounded bg-gray-200" />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-4 rounded bg-gray-200" />
            <div className="w-20 h-9 rounded-md bg-gray-200" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-between p-5 card animate-pulse">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-lg bg-gray-200" />
          <div>
            <div className="w-40 h-4 rounded bg-gray-200" />
            <div className="w-24 h-3 mt-2 rounded bg-gray-200" />
          </div>
        </div>
        <div className="w-8 h-8 rounded-full bg-gray-200" />
      </div>

      <div className="mt-4">
        <div className="flex gap-2">
          <div className="w-16 h-5 rounded bg-gray-200" />
          <div className="w-14 h-5 rounded bg-gray-200" />
        </div>
        <div className="w-24 h-3 mt-3 rounded bg-gray-200" />
      </div>

      <div className="flex items-center justify-between mt-5">
        <div className="w-12 h-5 rounded bg-gray-200" />
        <div className="w-14 h-4 rounded bg-gray-200" />
      </div>
    </div>
  );
};

export default CardSkeleton;
