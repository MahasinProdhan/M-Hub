import { BookMarked } from "lucide-react";
import { resolveResourceUrl } from "../utils/resourceLink.js";

const SyllabusCard = ({ syllabus }) => {
  const handleOpen = () => {
    const url = resolveResourceUrl(syllabus.fileUrl, syllabus.driveLink);
    if (!url) return;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="flex items-center justify-between p-5 transition card hover:shadow-card">
      <div className="flex items-center gap-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-50 text-orange-600">
          <BookMarked size={20} />
        </div>

        <div>
          <h3 className="text-base font-semibold text-textPrimary">
            {syllabus.course.toUpperCase()}
            {syllabus.branch && ` - ${syllabus.branch}`}
          </h3>

          <p className="text-sm text-textSecondary">Semester {syllabus.semester}</p>
        </div>
      </div>

      <button
        type="button"
        onClick={handleOpen}
        disabled={!syllabus.fileUrl && !syllabus.driveLink}
        className="text-sm font-medium text-primary hover:underline disabled:cursor-not-allowed disabled:text-slate-400 disabled:no-underline"
      >
        View PDF {"->"}
      </button>
    </div>
  );
};

export default SyllabusCard;
