import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const ActionCard = ({ title, description, link }) => {
  return (
    <Link
      to={link}
      className="group rounded-2xl border border-slate-200 bg-white p-6 transition-all duration-200 hover:border-blue-200 hover:shadow-md"
    >
      <h3 className="text-base font-semibold text-slate-900">{title}</h3>

      <p className="mt-2 text-sm text-slate-600">{description}</p>

      <div className="mt-4 flex items-center text-sm font-medium text-blue-600">
        Explore
        <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
      </div>
    </Link>
  );
};

export default ActionCard;
