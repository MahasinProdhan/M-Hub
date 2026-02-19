import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import ListSkeleton from "../components/skeletons/ListSkeleton.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { useSavedResources } from "../context/SavedResourcesContext.jsx";

const TYPE_LABEL_MAP = {
  pyq: "PYQ",
  material: "Study Material",
  organizer: "Organizer",
};

const TYPE_BADGE_CLASS_MAP = {
  pyq: "bg-blue-100 text-blue-700",
  material: "bg-green-100 text-green-700",
  organizer: "bg-purple-100 text-purple-700",
};

const getResourceTitle = (item) => {
  if (item.resourceType === "pyq") {
    return item.resource?.subject || "Untitled PYQ";
  }

  return item.resource?.title || item.resource?.subject || "Untitled Resource";
};

const SavedMaterials = () => {
  const navigate = useNavigate();
  const { isLoggedIn, loading: authLoading } = useAuth();
  const { savedItems, loading, initialized, isResourcePending, toggleSavedResource } =
    useSavedResources();

  useEffect(() => {
    if (!authLoading && !isLoggedIn) {
      navigate("/login", { replace: true });
    }
  }, [authLoading, isLoggedIn, navigate]);

  if (authLoading || (!initialized && isLoggedIn)) {
    return (
      <div className="flex min-h-screen bg-appBg">
        <Sidebar />
        <main className="flex-1 p-8">
          <div className="mb-6 animate-pulse">
            <div className="w-48 h-7 rounded bg-gray-200" />
            <div className="w-32 h-4 mt-2 rounded bg-gray-200" />
          </div>
          <ListSkeleton count={4} layout="list" />
        </main>
      </div>
    );
  }

  if (!isLoggedIn) {
    return null;
  }

  const visibleItems = savedItems.filter((item) => item.resource);

  return (
    <div className="flex min-h-screen bg-appBg">
      <Sidebar />

      <main className="flex-1 p-8">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-textPrimary">Saved Materials</h1>
          <p className="mt-1 text-sm text-textSecondary">
            {visibleItems.length} saved item{visibleItems.length === 1 ? "" : "s"}
          </p>
        </div>

        {loading && visibleItems.length === 0 ? (
          <ListSkeleton count={4} layout="list" />
        ) : visibleItems.length === 0 ? (
          <div className="p-6 text-center card text-textSecondary">
            You have no saved resources yet.
          </div>
        ) : (
          <div className="space-y-4">
            {visibleItems.map((item) => {
              const resource = item.resource;
              const pending = isResourcePending(item.resourceType, item.resourceId);
              const metaParts = [
                resource.course ? resource.course.toUpperCase() : "",
                resource.semester ? `Sem ${resource.semester}` : "",
              ].filter(Boolean);

              return (
                <div
                  key={`${item.resourceType}:${item.resourceId}`}
                  className="p-5 card"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded ${
                            TYPE_BADGE_CLASS_MAP[item.resourceType]
                          }`}
                        >
                          {TYPE_LABEL_MAP[item.resourceType]}
                        </span>

                        {resource.fileType && (
                          <span className="px-2 py-1 text-xs rounded bg-gray-100 text-textSecondary">
                            {resource.fileType}
                          </span>
                        )}
                      </div>

                      <h2 className="mt-2 text-lg font-semibold text-textPrimary">
                        {getResourceTitle(item)}
                      </h2>

                      {resource.subject && item.resourceType !== "pyq" && (
                        <p className="mt-1 text-sm text-textSecondary">{resource.subject}</p>
                      )}

                      <div className="flex flex-wrap gap-2 mt-3">
                        {metaParts.map((part) => (
                          <span
                            key={part}
                            className="px-2 py-1 text-xs rounded bg-gray-100 text-textSecondary"
                          >
                            {part}
                          </span>
                        ))}

                        {resource.branch && (
                          <span className="px-2 py-1 text-xs rounded bg-gray-100 text-textSecondary">
                            {resource.branch}
                          </span>
                        )}

                        {resource.year && (
                          <span className="px-2 py-1 text-xs rounded bg-gray-100 text-textSecondary">
                            {resource.year}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => {
                          const url = resource.fileUrl || resource.driveLink;
                          if (!url) return;
                          window.open(url, "_blank", "noopener,noreferrer");
                        }}
                        disabled={!resource.fileUrl && !resource.driveLink}
                        className="text-sm font-medium text-primary hover:underline disabled:cursor-not-allowed disabled:text-slate-400 disabled:no-underline"
                      >
                        Open
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          toggleSavedResource({
                            resourceType: item.resourceType,
                            resourceId: item.resourceId,
                            resource: item.resource,
                          })
                        }
                        disabled={pending}
                        className="px-3 py-1.5 text-sm border rounded-md border-borderLight text-textPrimary hover:bg-gray-50 disabled:opacity-60 disabled:cursor-not-allowed"
                      >
                        {pending ? "Removing..." : "Remove"}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

export default SavedMaterials;
