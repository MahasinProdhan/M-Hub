import { BookOpen } from "lucide-react";
import SaveResourceButton from "./SaveResourceButton.jsx";

const StudyMaterialCard = ({
  material,
  isSaved = false,
  isSaving = false,
  onToggleSave,
}) => {
  return (
    <div className="flex flex-col justify-between p-5 transition card hover:shadow-card">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="flex items-center justify-center w-10 h-10 text-green-600 rounded-lg bg-green-50">
            <BookOpen size={20} />
          </div>

          <div>
            <h3 className="text-base font-semibold leading-snug text-textPrimary">
              {material.title}
            </h3>
            <p className="text-sm text-textSecondary">{material.type}</p>
          </div>
        </div>

        <SaveResourceButton
          saved={isSaved}
          loading={isSaving}
          onToggle={onToggleSave}
        />
      </div>

      <div className="mt-4 space-y-1 text-sm text-textSecondary">
        <p>
          Semester {material.semester} - {material.course.toUpperCase()}
        </p>
        {material.branch && <p>{material.branch}</p>}
        <p>{material.subject}</p>
      </div>

      <div className="flex items-center justify-between mt-5">
        <span className="px-2 py-1 text-xs bg-gray-100 rounded text-textSecondary">
          {material.fileType}
        </span>

        <a
          href={material.driveLink}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-medium text-primary hover:underline"
        >
          View
        </a>
      </div>
    </div>
  );
};

export default StudyMaterialCard;
