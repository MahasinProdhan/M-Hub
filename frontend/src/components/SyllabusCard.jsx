import { BookMarked } from "lucide-react";

const SyllabusCard = ({ syllabus }) => {
  return (
    <div className="flex items-center justify-between p-5 transition card hover:shadow-card">
      <div className="flex items-center gap-4">
        <div className="flex items-center justify-center w-10 h-10 text-orange-600 rounded-lg bg-orange-50">
          <BookMarked size={20} />
        </div>

        <div>
          {/* Main title */}
          <h3 className="text-base font-semibold text-textPrimary">
            {syllabus.course.toUpperCase()}
            {syllabus.branch && ` - ${syllabus.branch}`}
          </h3>

          {/* Subtitle */}
          <p className="text-sm text-textSecondary">
            Semester {syllabus.semester}
          </p>
        </div>
      </div>

      <a
        href={syllabus.driveLink}
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm font-medium text-primary hover:underline"
      >
        View PDF →
      </a>
    </div>
  );
};

export default SyllabusCard;
