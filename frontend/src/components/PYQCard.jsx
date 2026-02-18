import { FileText } from "lucide-react";
import SaveResourceButton from "./SaveResourceButton.jsx";

const PYQCard = ({ pyq, isSaved = false, isSaving = false, onToggleSave }) => {
  return (
    <div className="flex flex-col justify-between p-5 transition duration-200 card hover:shadow-card">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-50 text-primary">
            <FileText size={20} />
          </div>

          <div>
            <h3 className="text-base font-semibold leading-tight text-textPrimary">
              {pyq.subject}
            </h3>
            <p className="text-sm text-textSecondary">PYQ - {pyq.year}</p>
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
          <span className="px-2 py-1 text-xs font-medium bg-blue-100 rounded text-primary">
            {pyq.course.toUpperCase()}
          </span>
          <span className="px-2 py-1 text-xs font-medium bg-gray-100 rounded text-textSecondary">
            Sem {pyq.semester}
          </span>
        </div>

        {pyq.branch && <p className="mt-2 text-sm text-textSecondary">{pyq.branch}</p>}
      </div>

      <div className="flex items-center justify-between mt-5">
        <span className="px-2 py-1 text-xs bg-gray-100 rounded text-textSecondary">
          {pyq.fileType}
        </span>

        <a
          href={pyq.driveLink}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-medium text-primary hover:underline"
        >
          View PDF
        </a>
      </div>
    </div>
  );
};

export default PYQCard;
