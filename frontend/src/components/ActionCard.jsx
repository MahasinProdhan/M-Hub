import { Link } from "react-router-dom";

const ActionCard = ({ title, description, link }) => {
  return (
    <Link
      to={link}
      className="p-6 transition duration-200 card hover:shadow-card"
    >
      <h3 className="text-base font-medium text-textPrimary">{title}</h3>

      <p className="mt-2 text-sm text-textSecondary">{description}</p>

      <span className="inline-block mt-4 text-sm font-medium text-primary">
        Explore →
      </span>
    </Link>
  );
};

export default ActionCard;
