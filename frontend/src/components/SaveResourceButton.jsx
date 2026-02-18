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
          ? "border-yellow-200 bg-yellow-50 text-yellow-400 hover:bg-yellow-100"
          : "border-slate-200 bg-white text-slate-400 hover:border-slate-300 hover:text-slate-600"
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
