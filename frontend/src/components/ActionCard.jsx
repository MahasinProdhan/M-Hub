import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const ActionCard = ({ title, description, link }) => {
  return (
    <Link
      to={link}
      className="p-6 transition-all duration-200 group card hover:shadow-card"
    >
      <h3 className="text-base font-semibold text-textPrimary">{title}</h3>

      <p className="mt-2 text-sm text-textSecondary">{description}</p>

      <div className="flex items-center mt-4 text-sm font-medium text-primary">
        Explore
        <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
      </div>
    </Link>
  );
};

export default ActionCard;
