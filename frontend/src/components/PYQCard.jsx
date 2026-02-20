import { FileText } from "lucide-react";
import SaveResourceButton from "./SaveResourceButton.jsx";
import { resolveResourceUrl } from "../utils/resourceLink.js";

const PYQCard = ({ pyq, isSaved = false, isSaving = false, onToggleSave }) => {
  const handleOpen = () => {
    const url = resolveResourceUrl(pyq.fileUrl, pyq.driveLink);
    if (!url) return;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="flex flex-col justify-between p-5 transition duration-200 border rounded-2xl border-slate-200 bg-white hover:border-blue-200 hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-50 text-blue-600">
            <FileText size={20} />
          </div>

          <div>
            <h3 className="text-base font-semibold leading-tight text-slate-900">
              {pyq.subject}
            </h3>
            <p className="text-sm text-slate-600">PYQ - {pyq.year}</p>
          </div>
        </div>

        <SaveResourceButton
          saved={isSaved}
          loading={isSaving}
          onToggle={onToggleSave}
        />
      </div>

      <div className="mt-4">
        <div className="flex flex-wrap gap-2">
          <span className="px-2 py-1 text-xs font-medium text-blue-700 rounded bg-blue-100">
            {pyq.course.toUpperCase()}
          </span>
          <span className="px-2 py-1 text-xs font-medium rounded bg-slate-100 text-slate-600">
            Sem {pyq.semester}
          </span>
        </div>

        {pyq.branch && (
          <p className="mt-2 text-sm text-slate-600">{pyq.branch}</p>
        )}
      </div>

      <div className="flex items-center justify-between mt-5">
        <span className="px-2 py-1 text-xs rounded bg-slate-100 text-slate-600">
          {pyq.fileType}
        </span>

        <button
          type="button"
          onClick={handleOpen}
          disabled={!pyq.fileUrl && !pyq.driveLink}
          className="text-sm font-medium text-blue-600 hover:underline disabled:cursor-not-allowed disabled:text-slate-400 disabled:no-underline"
        >
          View
        </button>
      </div>
    </div>
  );
};

export default PYQCard;
