import { Bookmark, BookmarkCheck, Loader2 } from "lucide-react";

const SaveResourceButton = ({ saved, loading, onToggle }) => {
  const handleClick = (event) => {
    event.preventDefault();
    event.stopPropagation();
    onToggle?.();
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      onMouseDown={(event) => event.stopPropagation()}
      disabled={loading}
      aria-label={saved ? "Unsave resource" : "Save resource"}
      className={`inline-flex h-8 w-8 items-center justify-center rounded-full border transition ${
        saved
          ? "border-primary bg-blue-50 text-primary"
          : "border-borderLight bg-white text-textSecondary hover:text-primary"
      } ${loading ? "cursor-not-allowed opacity-70" : ""}`}
    >
      {loading ? (
        <Loader2 size={16} className="animate-spin" />
      ) : saved ? (
        <BookmarkCheck size={16} />
      ) : (
        <Bookmark size={16} />
      )}
    </button>
  );
};

export default SaveResourceButton;
