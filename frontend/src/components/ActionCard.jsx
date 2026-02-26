import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const ActionCard = ({ title, description, link, icon: Icon }) => {
  return (
    <Link
      to={link}
      className="relative flex flex-col justify-between h-full p-6 transition-all duration-300 bg-white border group rounded-2xl border-slate-200 hover:-translate-y-1 hover:border-blue-300 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      {/* Top content */}
      <div>
        {Icon && (
          <div className="flex items-center justify-center w-10 h-10 mb-3 text-blue-600 rounded-lg bg-blue-50">
            <Icon className="w-5 h-5" />
          </div>
        )}

        <h3 className="text-base font-semibold text-slate-900">{title}</h3>

        <p className="mt-2 text-sm leading-relaxed text-slate-600">
          {description}
        </p>
      </div>

      {/* CTA */}
      <div className="mt-6">
        <span
          className="
      inline-flex items-center gap-1
      rounded-md border border-blue-200
      px-3 py-1.5 text-sm font-medium
      text-blue-600
      transition-all
      group-hover:bg-blue-50
      group-hover:border-blue-300
    "
        >
          Explore
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  );
};

export default ActionCard;
