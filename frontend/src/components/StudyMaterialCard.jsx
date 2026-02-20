import { BookOpen } from "lucide-react";
import SaveResourceButton from "./SaveResourceButton.jsx";
import { resolveResourceUrl } from "../utils/resourceLink.js";

const StudyMaterialCard = ({
  material,
  isSaved = false,
  isSaving = false,
  onToggleSave,
}) => {
  const handleOpen = () => {
    const url = resolveResourceUrl(material.fileUrl, material.driveLink);
    if (!url) return;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="flex flex-col justify-between p-5 transition border rounded-2xl border-slate-200 bg-white hover:border-green-200 hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="flex items-center justify-center w-10 h-10 text-green-600 rounded-lg bg-green-50">
            <BookOpen size={20} />
          </div>

          <div>
            <h3 className="text-base font-semibold leading-snug text-slate-900">
              {material.title}
            </h3>
            <p className="text-sm text-slate-600">{material.type}</p>
          </div>
        </div>

        <SaveResourceButton
          saved={isSaved}
          loading={isSaving}
          onToggle={onToggleSave}
        />
      </div>

      <div className="mt-4 space-y-1 text-sm text-slate-600">
        <p>
          Semester {material.semester} - {material.course.toUpperCase()}
        </p>
        {material.branch && <p>{material.branch}</p>}
        <p>{material.subject}</p>
      </div>

      <div className="flex items-center justify-between mt-5">
        <span className="px-2 py-1 text-xs rounded bg-slate-100 text-slate-600">
          {material.fileType}
        </span>

        <button
          type="button"
          onClick={handleOpen}
          disabled={!material.fileUrl && !material.driveLink}
          className="text-sm font-medium text-blue-600 hover:underline disabled:cursor-not-allowed disabled:text-slate-400 disabled:no-underline"
        >
          View
        </button>
      </div>
    </div>
  );
};

export default StudyMaterialCard;
